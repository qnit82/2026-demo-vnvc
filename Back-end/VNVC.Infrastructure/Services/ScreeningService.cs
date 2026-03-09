using Microsoft.EntityFrameworkCore;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using VNVC.Domain.Entities;
using VNVC.Domain.Enums;
using VNVC.Infrastructure.Persistence;
using VNVC.Application.DTOs;

namespace VNVC.Infrastructure.Services;

public class ScreeningService : IScreeningService
{
    private readonly VNVCDbContext _context;

    public ScreeningService(VNVCDbContext context)
    {
        _context = context;
    }

    public async Task<ScreeningQueueResponse> GetQueueAsync(int status, DateTime date, int page, int pageSize, string? searchTerm = null)
    {
        var query = _context.Visits.AsNoTracking();

        // 1. Lọc theo ngày
        var startDate = date.Date;
        var endDate = startDate.AddDays(1);
        query = query.Where(v => v.CheckInTime >= startDate && v.CheckInTime < endDate);

        // 2. Lọc theo trạng thái
        if (status == 0) // Chờ khám
        {
            query = query.Where(v => v.Status == VisitStatus.WaitScreening);
        }
        else // Đã khám (Đã có kết quả khám sàng lọc)
        {
            // Bất kỳ trạng thái nào sau khám sàng lọc: Chờ thanh toán, Chờ tiêm, Đang theo dõi, Đã hoàn thành, v.v.
            query = query.Where(v => v.Status != VisitStatus.WaitScreening);
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
            .Select(v => new ScreeningVisitDTO
            {
                VisitId = v.Id,
                PID = v.Customer.PID,
                FullName = v.Customer.FullName,
                DOB = v.Customer.DOB,
                Gender = v.Customer.Gender,
                CheckInTime = v.CheckInTime,
                Status = v.Status.ToString()
            })
            .ToListAsync();

        return new ScreeningQueueResponse
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<VisitDetailDTO> GetVisitDetailAsync(int visitId)
    {
        var visit = await _context.Visits
            .AsNoTracking()
            .Include(v => v.Customer)
            .Include(v => v.ScreeningResult)
            .Include(v => v.Order)
                .ThenInclude(o => o.OrderDetails)
                    .ThenInclude(od => od.Vaccine)
            .FirstOrDefaultAsync(v => v.Id == visitId);

        if (visit == null) return null;

        var preSelectedVaccines = new List<PreSelectedVaccineDTO>();
        if (visit.Order != null)
        {
            preSelectedVaccines = visit.Order.OrderDetails
                .Select(od => new PreSelectedVaccineDTO
                {
                    VaccineId = od.VaccineId,
                    VaccineName = od.Vaccine.Name,
                    Price = od.UnitPrice
                })
                .ToList();
        }

        return new VisitDetailDTO
        {
            Id = visit.Id,
            CustomerId = visit.CustomerId,
            PID = visit.Customer.PID,
            FullName = visit.Customer.FullName,
            DOB = visit.Customer.DOB,
            Gender = visit.Customer.Gender,
            Phone = visit.Customer.Phone,
            Address = visit.Customer.Address,
            MedicalHistory = visit.Customer.MedicalHistory ?? "",
            // Mapping kết quả khám cũ (nếu có)
            Temperature = visit.ScreeningResult?.Temperature,
            Weight = visit.ScreeningResult?.Weight,
            Height = visit.ScreeningResult?.Height,
            HeartRate = visit.ScreeningResult?.HeartRate,
            RespiratoryRate = visit.ScreeningResult?.RespiratoryRate,
            BloodPressure = visit.ScreeningResult?.BloodPressure,
            ClinicalAssessment = visit.ScreeningResult?.ClinicalAssessment,
            IsEligible = visit.ScreeningResult?.IsEligible ?? true,
            DoctorNote = visit.ScreeningResult?.DoctorNote,
            HasScreeningResult = visit.ScreeningResult != null,
            PreSelectedVaccines = preSelectedVaccines
        };
    }

    public async Task<bool> SaveScreeningResultAsync(SaveScreeningRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var visit = await _context.Visits
                .Include(v => v.Order!)
                    .ThenInclude(o => o!.OrderDetails)
                .Include(v => v.Invoice!)
                .FirstOrDefaultAsync(v => v.Id == request.VisitId);

            if (visit == null) return false;

            // 1. Tạo hoặc Cập nhật kết quả khám sàng lọc (Upsert)
            var result = await _context.ScreeningResults.FirstOrDefaultAsync(s => s.VisitId == request.VisitId);
            if (result == null)
            {
                result = new ScreeningResult { VisitId = request.VisitId };
                _context.ScreeningResults.Add(result);
            }

            result.Temperature = request.Temperature;
            result.Weight = request.Weight;
            result.Height = request.Height;
            result.HeartRate = request.HeartRate;
            result.RespiratoryRate = request.RespiratoryRate;
            result.BloodPressure = request.BloodPressure;
            result.ClinicalAssessment = request.ClinicalAssessment;
            result.IsEligible = request.IsEligible;
            result.DoctorNote = request.DoctorNote;
            result.ExaminationTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // 2. Cập nhật trạng thái lượt khám
            if (request.IsEligible)
            {
                // Thêm chi tiết mới từ chỉ định của bác sĩ
                var selectedVaccines = await _context.Vaccines
                    .Where(v => request.VaccineIds.Contains(v.Id))
                    .ToListAsync();

                if (selectedVaccines.Any())
                {
                    // Nếu đã thanh toán rồi (Pre-paid), chuyển thẳng sang Chờ tiêm
                    if (visit.Invoice != null && visit.Invoice.PaymentStatus == PaymentStatus.Paid)
                    {
                        visit.Status = VisitStatus.WaitInjection;
                    }
                    else
                    {
                        visit.Status = VisitStatus.WaitPayment;
                    }

                    if (visit.Order == null)
                    {
                        visit.Order = new Order
                        {
                            VisitId = visit.Id,
                            OrderNumber = $"ORD{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}",
                            OrderDate = DateTime.UtcNow,
                            Status = OrderStatus.Confirmed
                        };
                        _context.Orders.Add(visit.Order);
                    }
                    else
                    {
                        // Xóa chi tiết cũ nếu có
                        _context.OrderDetails.RemoveRange(visit.Order.OrderDetails);
                        visit.Order.Status = OrderStatus.Confirmed;
                    }

                    foreach (var v in selectedVaccines)
                    {
                        _context.OrderDetails.Add(new OrderDetail
                        {
                            Order = visit.Order,
                            VaccineId = v.Id,
                            Quantity = 1,
                            UnitPrice = v.Price
                        });

                        // Tạo Prescription
                        _context.Prescriptions.Add(new Prescription
                        {
                            ScreeningResultId = result.Id,
                            VaccineId = v.Id,
                            DoseNumber = 1
                        });
                    }

                    // Cập nhật tổng tiền
                    visit.Order.TotalAmount = selectedVaccines.Sum(v => v.Price);

                    // Cập nhật Invoice
                    if (visit.Invoice != null)
                    {
                        visit.Invoice.TotalAmount = visit.Order.TotalAmount;
                        visit.Invoice.PaymentStatus = PaymentStatus.Pending;
                    }
                    else
                    {
                        _context.Invoices.Add(new Invoice
                        {
                            VisitId = visit.Id,
                            TotalAmount = visit.Order.TotalAmount,
                            PaymentStatus = PaymentStatus.Pending
                        });
                    }
                }
                else
                {
                    // Nếu đủ điều kiện nhưng không có vắc xin chỉ định? 
                    // Tùy nghiệp vụ, ở đây tạm để là Completed hoặc giữ nguyên WaitScreening
                    visit.Status = VisitStatus.Completed;
                }
            }
            else
            {
                // Nếu không đủ điều kiện tiêm
                visit.Status = VisitStatus.Completed; // Hoặc Cancelled tùy nghiệp vụ
                if (visit.Order != null) visit.Order.Status = OrderStatus.Cancelled;
                if (visit.Invoice != null) visit.Invoice.PaymentStatus = PaymentStatus.Cancelled;
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
