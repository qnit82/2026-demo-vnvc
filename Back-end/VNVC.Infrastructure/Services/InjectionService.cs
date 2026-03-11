using Microsoft.EntityFrameworkCore;
using VNVC.Application.DTOs;
using VNVC.Application.Interfaces;
using VNVC.Domain.Entities;
using VNVC.Domain.Enums;
using VNVC.Infrastructure.Persistence;

namespace VNVC.Infrastructure.Services;

public class InjectionService : IInjectionService
{
    private readonly VNVCDbContext _context;

    public InjectionService(VNVCDbContext context)
    {
        _context = context;
    }

    public async Task<InjectionQueueResponse> GetQueueAsync(int status, DateTime date, int page, int pageSize, string? searchTerm = null)
    {
        var query = _context.Visits.AsNoTracking();

        // 1. Lọc theo ngày
        var startDate = date.Date;
        var endDate = startDate.AddDays(1);
        query = query.Where(v => v.CheckInTime >= startDate && v.CheckInTime < endDate);

        // 2. Lọc theo trạng thái
        if (status == 0) // Chờ tiêm
        {
            query = query.Where(v => v.Status == VisitStatus.WaitInjection);
        }
        else // Đã tiêm (Đang theo dõi hoặc Đã hoàn thành)
        {
            query = query.Where(v => v.Status == VisitStatus.Monitoring || v.Status == VisitStatus.Completed);
        }

        // 3. Lọc theo từ khóa tìm kiếm
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(v =>
                v.Customer.PID.ToLower().Contains(term) ||
                v.Customer.FullName.ToLower().Contains(term)
            );
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(v => v.CheckInTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new InjectionQueueDTO
            {
                VisitId = v.Id,
                PID = v.Customer.PID,
                FullName = v.Customer.FullName,
                DOB = v.Customer.DOB,
                Gender = v.Customer.Gender,
                ScreeningTime = v.ScreeningResult != null ? v.ScreeningResult.ExaminationTime : v.CheckInTime,
                DoctorNote = v.ScreeningResult != null ? v.ScreeningResult.DoctorNote : ""
            })
            .ToListAsync();

        return new InjectionQueueResponse
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<VisitDetailDto?> GetVisitDetailAsync(int visitId)
    {
        /**
        * Lấy thông tin chi tiết của đợt tiêm
        * @param visitId
        * @returns VisitDetailDto
        * Viết theo kiểu Projection DTO thay cho .Include và .ThenInclude nhiều table trước đó (dẽ gây dublicate data và tốn RAM/CPU)
        */
        var visit = await _context.Visits
            .AsNoTracking()
            .Where(v => v.Id == visitId)
            .Select(v => new VisitDetailDto
            {
                VisitId = v.Id,
                PID = v.Customer.PID,
                FullName = v.Customer.FullName,
                DOB = v.Customer.DOB,
                Gender = v.Customer.Gender,
                MedicalHistory = v.Customer.MedicalHistory,
                DoctorNote = v.ScreeningResult != null ? v.ScreeningResult.DoctorNote : "Chưa có kết quả khám sàng lọc (Vui lòng kiểm tra lại quy trình)",
                PrescribedVaccines = v.ScreeningResult != null
                    ? v.ScreeningResult.Prescriptions.Select(p => new PrescriptionDto
                    {
                        PrescriptionId = p.Id,
                        VaccineId = p.VaccineId,
                        VaccineName = p.Vaccine.Name,
                        DoseNumber = p.DoseNumber,
                        IsInjected = _context.InjectionLogs.Any(il => il.PrescriptionId == p.Id),
                        AvailableBatches = p.Vaccine.Batches
                            .Where(b => b.QuantityInStock > 0 && b.ExpiryDate > DateTime.Now)
                            .OrderBy(b => b.ExpiryDate)
                            .Select(b => new BatchDto
                            {
                                BatchId = b.Id,
                                BatchNumber = b.BatchNumber,
                                ExpiryDate = b.ExpiryDate,
                                QuantityInStock = b.QuantityInStock
                            }).ToList()
                    }).ToList()
                    : new List<PrescriptionDto>()
            })
            .FirstOrDefaultAsync();

        return visit;
    }


    public async Task<bool> ConfirmInjectionAsync(ConfirmInjectionRequest request, int nurseId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Kỹ thuật ATOMIC UPDATE: Đảm bảo chốt chặn Race Condition
            // Câu lệnh SQL sẽ chỉ chạy nếu QuantityInStock > 0.
            int rowsAffected = await _context.VaccineBatches
                .Where(b => b.Id == request.BatchId && b.QuantityInStock > 0)
                .ExecuteUpdateAsync(s => s.SetProperty(b => b.QuantityInStock, b => b.QuantityInStock - 1));

            if (rowsAffected == 0) return false; // Hết hàng hoặc sai ID

            // 2. Insert các log mới (Vẫn dùng Change Tracker cho Insert)
            var log = new InjectionLog
            {
                PrescriptionId = request.PrescriptionId,
                NurseId = nurseId,
                BatchId = request.BatchId,
                InjectionSite = request.InjectionSite,
                InjectionTime = DateTime.UtcNow
            };

            var monitoring = new PostInjectionMonitoring
            {
                InjectionLog = log,
                StartTime = DateTime.UtcNow,
                Status = "Monitoring"
            };

            _context.InjectionLogs.Add(log);
            _context.PostInjectionMonitorings.Add(monitoring);
            await _context.SaveChangesAsync();

            // 3. Tối ưu query đếm mũi tiêm (Single Query Metadata)
            // Gom tất cả metadata cần thiết vào 1 lần query duy nhất.
            var checkStatusData = await _context.Prescriptions
                .Where(p => p.Id == request.PrescriptionId)
                .Select(p => new
                {
                    p.ScreeningResultId,
                    VisitId = p.ScreeningResult.VisitId,
                    TotalInToa = _context.Prescriptions.Count(p2 => p2.ScreeningResultId == p.ScreeningResultId),
                    InjectedCount = _context.InjectionLogs.Count(il =>
                        _context.Prescriptions
                            .Where(p3 => p3.ScreeningResultId == p.ScreeningResultId)
                            .Select(p3 => p3.Id)
                            .Contains(il.PrescriptionId))
                })
                .FirstOrDefaultAsync();

            // 4. Update trạng thái Visit trực tiếp (Không load entity)
            if (checkStatusData != null && checkStatusData.InjectedCount >= checkStatusData.TotalInToa)
            {
                await _context.Visits
                    .Where(v => v.Id == checkStatusData.VisitId)
                    .ExecuteUpdateAsync(s => s.SetProperty(v => v.Status, VisitStatus.Monitoring));
            }

            await transaction.CommitAsync();
            return true;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    /// <summary>
    /// Lấy dữ liệu tổng hợp cho một đợt tiêm chủng theo ngày.
    /// Hàm này Join 5 table (có dùng join và left join)
    /// </summary>
    public async Task<List<VisitComplexDto>> InjectionReports(DateTime date)
    {
        var startDate = date.Date;
        var endDate = startDate.AddDays(1);

        return await _context.Visits
            .AsNoTracking()
            .Where(v => v.CheckInTime >= startDate && v.CheckInTime < endDate)
            .Select(v => new VisitComplexDto
            {
                // 1. INNER JOIN với Customer (Vì Visit bắt buộc phải có Customer)
                CustomerName = v.Customer.FullName,
                PID = v.Customer.PID,

                // 2. LEFT JOIN với Invoice (Một lượt khám có thể chưa có hóa đơn)
                InvoiceAmount = v.Invoice != null ? v.Invoice.TotalAmount : 0,
                PaymentStatus = v.Invoice != null ? v.Invoice.PaymentStatus : VNVC.Domain.Enums.PaymentStatus.Pending,

                // 3. LEFT JOIN với ScreeningResult & Order
                DoctorNote = v.ScreeningResult != null ? v.ScreeningResult.DoctorNote : "Chưa có kết quả khám sàng lọc",
                OrderNumber = v.Order != null ? v.Order.OrderNumber : "N/A",

                // 4. COMPLEX JOIN: Lấy thông tin tiêm (InjectionLog) - Nhiều bảng lồng nhau
                // Đây là dạng Left Join với tập hợp (Table InjectionLog)
                InjectionDetails = v.ScreeningResult != null
                    ? v.ScreeningResult.Prescriptions.Select(p => new InjectionDetailDto
                    {
                        VaccineName = p.Vaccine.Name,
                        // Ở đây dùng Subquery để lấy InjectionSite từ bảng InjectionLogs
                        InjectionSite = _context.InjectionLogs
                            .Where(il => il.PrescriptionId == p.Id)
                            .Select(il => il.InjectionSite)
                            .FirstOrDefault() ?? "Chưa tiêm"
                    }).ToList()
                    : new List<InjectionDetailDto>()
            })
            .ToListAsync();
    }
}
