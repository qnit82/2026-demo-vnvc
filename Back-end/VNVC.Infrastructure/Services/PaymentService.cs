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

        /**
        * Câu quey này thể hiện điểm sáng của LINQ Projection (Select)
        * Không cần .Include() mà vẫn lấy được dữ liệu từ table Customer
        * Ta dùng .Select(v => new { ... v.Customer.PID ... }), EF Core sẽ thực hiện một cơ chế gọi là Query Projection:
        * EF Core nhìn vào biểu thức v.Customer.PID =>  Nó biết giữa Visit và Customer có quan hệ (Foreign Key) dựa trên file Visit.cs và cấu hình DbContext.
        */
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
        return await _context.Visits
            .AsNoTracking()
            .Where(v => v.Id == visitId && v.Invoice != null)
            .Select(v => new InvoiceDetailDTO
            {
                VisitId = v.Id,
                PID = v.Customer.PID,
                FullName = v.Customer.FullName,
                Phone = v.Customer.Phone,
                TotalAmount = v.Invoice.TotalAmount,
                PaymentStatus = (int)v.Invoice.PaymentStatus,
                Items = v.Order != null ? v.Order.OrderDetails.Select(od => new InvoiceItemDTO
                {
                    VaccineName = od.Vaccine.Name,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice
                }).ToList() : new List<InvoiceItemDTO>()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ConfirmPaymentAsync(ConfirmPaymentRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Kiểm tra nhanh sự tồn tại và lấy metadata cần thiết
            var visitData = await _context.Visits
                .Where(v => v.Id == request.VisitId)
                .Select(v => new { 
                    HasInvoice = v.Invoice != null,
                    HasScreeningResult = v.ScreeningResult != null 
                })
                .FirstOrDefaultAsync();

            if (visitData == null || !visitData.HasInvoice) return false;

            // 2. Cập nhật Invoice trực tiếp
            await _context.Invoices
                .Where(i => i.VisitId == request.VisitId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(i => i.PaymentStatus, PaymentStatus.Paid)
                    .SetProperty(i => i.PaymentTime, DateTime.UtcNow));

            // 3. Cập nhật Order trực tiếp (nếu có)
            await _context.Orders
                .Where(o => o.VisitId == request.VisitId)
                .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, OrderStatus.Paid));

            // 4. Cập nhật trạng thái Visit (Chỉ chuyển sang WaitInjection nếu đã có kết quả khám)
            if (visitData.HasScreeningResult)
            {
                await _context.Visits
                    .Where(v => v.Id == request.VisitId)
                    .ExecuteUpdateAsync(s => s.SetProperty(v => v.Status, VisitStatus.WaitInjection));
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
