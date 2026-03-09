using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using VNVC.Application.DTOs;

namespace VNVC.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VaccineController : ControllerBase
{
    private readonly IVaccineService _vaccineService;

    public VaccineController(IVaccineService vaccineService)
    {
        _vaccineService = vaccineService;
    }

    /// <summary>
    /// Lấy danh sách vắc xin có phân trang và tìm kiếm
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPaged([FromQuery] SearchVaccineRequest request)
    {
        var result = await _vaccineService.GetPagedVaccinesAsync(request);
        return Ok(ApiBaseResponse<PagedResult<VaccineListItemDTO>>.Ok(result));
    }
    
    /// <summary>
    /// Lấy danh sách tồn kho vắc xin hiện tại
    /// </summary>
    [HttpGet("inventory")]
    public async Task<IActionResult> GetInventory()
    {
        var result = await _vaccineService.GetInventoryAsync();
        return Ok(ApiBaseResponse<List<VaccineInventoryDTO>>.Ok(result));
    }

    /// <summary>
    /// Nhập kho một lô vắc xin mới
    /// </summary>
    [HttpPost("import")]
    public async Task<IActionResult> ImportBatch([FromBody] ImportBatchRequest request)
    {
        var success = await _vaccineService.ImportBatchAsync(request);
        if (!success) return BadRequest(ApiBaseResponse<string>.Failure("Nhập kho thất bại", "IMPORT_FAILED"));
        return Ok(ApiBaseResponse<string>.Ok("Success", "Nhập kho thành công"));
    }

    /// <summary>
    /// Nhập danh sách lô vắc xin từ file Excel
    /// </summary>
    [HttpPost("import-excel")]
    public async Task<IActionResult> ImportExcel(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiBaseResponse<string>.Failure("Vui lòng chọn file excel", "MISSING_FILE"));

        using var stream = file.OpenReadStream();
        var count = await _vaccineService.ImportBatchesFromExcelAsync(stream);
        
        return Ok(ApiBaseResponse<string>.Ok($"Đã nhập thành công {count} lô vắc xin", "Import thành công"));
    }
}
