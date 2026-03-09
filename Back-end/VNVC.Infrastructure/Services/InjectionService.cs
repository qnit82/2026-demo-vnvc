using Microsoft.EntityFrameworkCore;
using VNVC.Application.Interfaces;
using VNVC.Domain.Entities;
using VNVC.Domain.Enums;
using VNVC.Infrastructure.Persistence;
using VNVC.Application.DTOs;

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
            var prescription = await _context.Prescriptions
                .Include(p => p.ScreeningResult)
                    .ThenInclude(s => s.Visit)
                .FirstOrDefaultAsync(p => p.Id == request.PrescriptionId);

            if (prescription == null) return false;

            var batch = await _context.VaccineBatches.FindAsync(request.BatchId);
            if (batch == null || batch.QuantityInStock <= 0) return false;

            // 1. Tạo log tiêm
            var log = new InjectionLog
            {
                PrescriptionId = request.PrescriptionId,
                NurseId = nurseId,
                BatchId = request.BatchId,
                InjectionSite = request.InjectionSite,
                InjectionTime = DateTime.UtcNow
            };
            _context.InjectionLogs.Add(log);

            // 2. Trừ tồn kho
            batch.QuantityInStock -= 1;

            // 3. Tự động tạo bản ghi theo dõi (Monitoring)
            var monitoring = new PostInjectionMonitoring
            {
                InjectionLog = log,
                StartTime = DateTime.UtcNow,
                Status = "Monitoring",
                IsNormal = true
            };
            _context.PostInjectionMonitorings.Add(monitoring);

            // 4. Kiểm tra xem tất cả các mũi trong toa đã tiêm hết chưa để chuyển trạng thái Visit
            var allPrescriptions = await _context.Prescriptions
                .Where(p => p.ScreeningResultId == prescription.ScreeningResultId)
                .Select(p => p.Id)
                .ToListAsync();

            var injectedCount = await _context.InjectionLogs
                .CountAsync(il => allPrescriptions.Contains(il.PrescriptionId));

            // Nếu mũi hiện tại là mũi cuối cùng (hoặc duy nhất)
            if (injectedCount + 1 >= allPrescriptions.Count)
            {
                prescription.ScreeningResult.Visit.Status = VisitStatus.Monitoring;
            }

            await _context.SaveChangesAsync();
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
