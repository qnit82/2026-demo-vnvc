using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
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

    public async Task<InjectionVisitDetailDTO?> GetVisitDetailAsync(int visitId)
    {
        var visit = await _context.Visits
            .AsNoTracking()
            .Include(v => v.Customer)
            .Include(v => v.ScreeningResult)
                .ThenInclude(s => s.Prescriptions)
                    .ThenInclude(p => p.Vaccine)
                        .ThenInclude(v => v.Batches)
            .FirstOrDefaultAsync(v => v.Id == visitId);

        if (visit == null) return null;
        
        // Robust fallback: Nếu Include không tải được (do mapping hoặc dữ liệu cũ), thử tải trực tiếp
        if (visit.ScreeningResult == null)
        {
            visit.ScreeningResult = await _context.ScreeningResults
                .Include(s => s.Prescriptions)
                    .ThenInclude(p => p.Vaccine)
                        .ThenInclude(v => v.Batches)
                .FirstOrDefaultAsync(s => s.VisitId == visitId);
        }

        // Nếu thực sự không có kết quả khám sàng lọc (lỗi quy trình)
        if (visit.ScreeningResult == null)
        {
            return new InjectionVisitDetailDTO
            {
                VisitId = visit.Id,
                PID = visit.Customer!.PID,
                FullName = visit.Customer!.FullName,
                DOB = visit.Customer!.DOB,
                Gender = visit.Customer!.Gender,
                MedicalHistory = visit.Customer!.MedicalHistory,
                DoctorNote = "Chưa có kết quả khám sàng lọc (Vui lòng kiểm tra lại quy trình)",
                PrescribedVaccines = new List<PrescribedVaccineDTO>()
            };
        }

        var prescribedVaccines = new List<PrescribedVaccineDTO>();
        
        foreach (var p in visit.ScreeningResult.Prescriptions)
        {
            // Kiểm tra xem mũi này đã tiêm chưa
            var isInjected = await _context.InjectionLogs.AnyAsync(il => il.PrescriptionId == p.Id);

            var availableBatches = p.Vaccine.Batches
                .Where(b => b.QuantityInStock > 0 && b.ExpiryDate > DateTime.Now)
                .OrderBy(b => b.ExpiryDate) // FEFO: Hạn dùng gần nhất dùng trước
                .Select(b => new VaccineBatchDTO
                {
                    BatchId = b.Id,
                    BatchNumber = b.BatchNumber,
                    ExpiryDate = b.ExpiryDate,
                    QuantityInStock = b.QuantityInStock
                })
                .ToList();

            prescribedVaccines.Add(new PrescribedVaccineDTO
            {
                PrescriptionId = p.Id,
                VaccineId = p.VaccineId,
                VaccineName = p.Vaccine.Name,
                DoseNumber = p.DoseNumber,
                IsInjected = isInjected,
                AvailableBatches = availableBatches
            });
        }

        return new InjectionVisitDetailDTO
        {
            VisitId = visit.Id,
            PID = visit.Customer.PID,
            FullName = visit.Customer.FullName,
            DOB = visit.Customer.DOB,
            Gender = visit.Customer.Gender,
            MedicalHistory = visit.Customer.MedicalHistory,
            DoctorNote = visit.ScreeningResult.DoctorNote,
            PrescribedVaccines = prescribedVaccines
        };
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
                .Select(p => new {
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

}
