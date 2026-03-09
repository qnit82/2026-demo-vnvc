using Microsoft.EntityFrameworkCore;
using VNVC.Infrastructure.Persistence;
using VNVC.Domain.Enums;
using VNVC.Application.Interfaces;
using VNVC.Application.DTOs;

namespace VNVC.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly VNVCDbContext _context;

    public PaymentService(VNVCDbContext context)
    {
        _context = context;
    }

    public async Task<PaymentQueueResponse> GetQueueAsync(DateTime? date, int? status, int page, int pageSize)
    {
        var queryDate = date?.Date ?? DateTime.Today;
        var nextDate = queryDate.AddDays(1);
        
        // Sử dụng khoảng thời gian thay vì .Date để an toàn hơn với múi giờ và các loại DB
        var query = _context.Visits
            .AsNoTracking()
            .Include(v => v.Customer)
            .Include(v => v.Invoice)
            .Where(v => v.CheckInTime >= queryDate && v.CheckInTime < nextDate);

        // Lọc theo trạng thái thanh toán
        if (status.HasValue)
        {
            // Tab 0: Chờ thanh toán, Tab 1: Đã thanh toán
            query = query.Where(v => v.Invoice != null && (int)v.Invoice.PaymentStatus == status.Value);
        }
        else
        {
            // Mặc định (nếu không truyền status từ FE)
            query = query.Where(v => v.Status == VisitStatus.WaitPayment || v.Status == VisitStatus.WaitInjection);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(v => v.CheckInTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new PaymentQueueDTO
            {
                VisitId = v.Id,
                PID = v.Customer != null ? v.Customer.PID : "N/A",
                FullName = v.Customer != null ? v.Customer.FullName : "N/A",
                DOB = v.Customer != null ? v.Customer.DOB : DateTime.MinValue,
                Gender = v.Customer != null ? v.Customer.Gender : "N/A",
                TotalAmount = v.Invoice != null ? v.Invoice.TotalAmount : 0,
                RequestTime = v.CheckInTime,
                PaymentStatus = v.Invoice != null ? (int)v.Invoice.PaymentStatus : 0
            })
            .ToListAsync();

        return new PaymentQueueResponse
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<InvoiceDetailDTO?> GetInvoiceDetailAsync(int visitId)
    {
        var visit = await _context.Visits
            .AsNoTracking()
            .Include(v => v.Customer)
            .Include(v => v.Invoice)
            .Include(v => v.Order)
                .ThenInclude(o => o.OrderDetails)
                    .ThenInclude(od => od.Vaccine)
            .FirstOrDefaultAsync(v => v.Id == visitId);

        if (visit == null || visit.Invoice == null) return null;

        return new InvoiceDetailDTO
        {
            VisitId = visit.Id,
            PID = visit.Customer.PID,
            FullName = visit.Customer.FullName,
            Phone = visit.Customer.Phone,
            TotalAmount = visit.Invoice.TotalAmount,
            PaymentStatus = (int)visit.Invoice.PaymentStatus,
            Items = visit.Order?.OrderDetails.Select(od => new InvoiceItemDTO
            {
                VaccineName = od.Vaccine.Name,
                Quantity = od.Quantity,
                UnitPrice = od.UnitPrice
            }).ToList() ?? new List<InvoiceItemDTO>()
        };
    }

    public async Task<bool> ConfirmPaymentAsync(ConfirmPaymentRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var visit = await _context.Visits
                .Include(v => v.Invoice)
                .Include(v => v.Order)
                .Include(v => v.ScreeningResult)
                .FirstOrDefaultAsync(v => v.Id == request.VisitId);

            if (visit == null || visit.Invoice == null) return false;

            // 1. Cập nhật Invoice
            visit.Invoice.PaymentStatus = PaymentStatus.Paid;
            visit.Invoice.PaymentTime = DateTime.UtcNow;

            // 2. Cập nhật Order (nếu có)
            if (visit.Order != null)
            {
                visit.Order.Status = OrderStatus.Paid;
            }

            // 3. Cập nhật trạng thái Visit sang Chờ tiêm (CHỈ KHI ĐÃ KHÁM SÀNG LỌC)
            // Nếu chưa khám sàng lọc, vẫn để trạng thái cũ (thường là WaitScreening)
            if (visit.ScreeningResult != null)
            {
                visit.Status = VisitStatus.WaitInjection;
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
