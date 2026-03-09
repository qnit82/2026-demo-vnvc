using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using VNVC.Application.DTOs;

namespace VNVC.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ScreeningController : ControllerBase
{
    private readonly IScreeningService _screeningService;

    public ScreeningController(IScreeningService screeningService)
    {
        _screeningService = screeningService;
    }

    /// <summary>
    /// Lấy danh sách hàng đợi khám sàng lọc
    /// </summary>
    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue([FromQuery] int status = 0, [FromQuery] DateTime? date = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 8, [FromQuery] string? searchTerm = null)
    {
        var filterDate = date ?? DateTime.Today;
        var result = await _screeningService.GetQueueAsync(status, filterDate, page, pageSize, searchTerm);
        return Ok(ApiBaseResponse<ScreeningQueueResponse>.Ok(result));
    }

    /// <summary>
    /// Lấy chi tiết thông tin khám sàng lọc theo ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetail(int id)
    {
        var result = await _screeningService.GetVisitDetailAsync(id);
        if (result == null) return NotFound(ApiBaseResponse<object>.Failure("Không tìm thấy lượt khám", "VISIT_NOT_FOUND"));
        return Ok(ApiBaseResponse<VisitDetailDTO>.Ok(result));
    }

    /// <summary>
    /// Lưu kết quả khám sàng lọc
    /// </summary>
    [HttpPost("save")]
    public async Task<IActionResult> Save([FromBody] SaveScreeningRequest request)
    {
        var result = await _screeningService.SaveScreeningResultAsync(request);
        if (result) return Ok(ApiBaseResponse<object>.Ok(null, "Lưu kết quả khám sàng lọc thành công"));
        return BadRequest(ApiBaseResponse<object>.Failure("Không thể lưu kết quả. Vui lòng kiểm tra lại thông tin hoặc dữ liệu liên quan.", "SAVE_SCREENING_FAILED"));
    }
}
