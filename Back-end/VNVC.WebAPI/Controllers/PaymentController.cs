using Microsoft.AspNetCore.Mvc;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using VNVC.Application.DTOs;

namespace VNVC.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    /// <summary>
    /// Lấy danh sách hàng đợi thanh toán
    /// </summary>
    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue([FromQuery] DateTime? date, [FromQuery] int? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var response = await _paymentService.GetQueueAsync(date, status, page, pageSize);
        return Ok(ApiBaseResponse<PaymentQueueResponse>.Ok(response));
    }

    /// <summary>
    /// Lấy chi tiết hóa đơn dựa vào ID lượt khám
    /// </summary>
    [HttpGet("{visitId}")]
    public async Task<IActionResult> GetInvoiceDetail(int visitId)
    {
        var detail = await _paymentService.GetInvoiceDetailAsync(visitId);
        if (detail == null) return NotFound(ApiBaseResponse<string>.Failure("Không tìm thấy hóa đơn", "INVOICE_NOT_FOUND"));
        return Ok(ApiBaseResponse<InvoiceDetailDTO>.Ok(detail));
    }

    /// <summary>
    /// Xác nhận thanh toán thành công
    /// </summary>
    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
    {
        var success = await _paymentService.ConfirmPaymentAsync(request);
        if (!success) return BadRequest(ApiBaseResponse<string>.Failure("Xác nhận thanh toán thất bại", "PAYMENT_CONFIRM_FAILED"));
        return Ok(ApiBaseResponse<string>.Ok("Success", "Thanh toán thành công"));
    }
}
