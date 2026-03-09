using VNVC.Application.DTOs;

namespace VNVC.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentQueueResponse> GetQueueAsync(DateTime? date, int? status, int page, int pageSize);
    Task<InvoiceDetailDTO?> GetInvoiceDetailAsync(int visitId);
    Task<bool> ConfirmPaymentAsync(ConfirmPaymentRequest request);
}
