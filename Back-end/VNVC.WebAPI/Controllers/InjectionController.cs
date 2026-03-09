using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using VNVC.Application.DTOs;

namespace VNVC.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InjectionController : ControllerBase
{
    private readonly IInjectionService _injectionService;

    public InjectionController(IInjectionService injectionService)
    {
        _injectionService = injectionService;
    }

    /// <summary>
    /// Lấy danh hàng đợi người đến tiêm
    /// </summary>
    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue([FromQuery] int status = 0, [FromQuery] DateTime? date = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 8, [FromQuery] string? searchTerm = null)
    {
        var filterDate = date ?? DateTime.Today;
        var result = await _injectionService.GetQueueAsync(status, filterDate, page, pageSize, searchTerm);
        return Ok(ApiBaseResponse<InjectionQueueResponse>.Ok(result));
    }

    /// <summary>
    /// Lấy chi tiết lượt tiêm
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetail(int id)
    {
        var result = await _injectionService.GetVisitDetailAsync(id);
        if (result == null) return NotFound(ApiBaseResponse<object>.Failure("Không tìm thấy lượt tiêm", "INJECTION_NOT_FOUND"));
        return Ok(ApiBaseResponse<InjectionVisitDetailDTO>.Ok(result));
    }

    /// <summary>
    /// Xác nhận tiêm xong cho khách hàng
    /// </summary>
    [HttpPost("confirm")]
    public async Task<IActionResult> Confirm([FromBody] ConfirmInjectionRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
        {
            return Unauthorized(ApiBaseResponse<object>.Failure("Không xác định được điều dưỡng", "NURSE_NOT_FOUND"));
        }

        var result = await _injectionService.ConfirmInjectionAsync(request, userId);
        if (result) return Ok(ApiBaseResponse<object>.Ok(null, "Xác nhận tiêm thành công"));
        return BadRequest(ApiBaseResponse<object>.Failure("Xác nhận tiêm thất bại (Có thể do hết tồn kho hoặc dữ liệu sai)", "INJECTION_CONFIRM_FAILED"));
    }
}
