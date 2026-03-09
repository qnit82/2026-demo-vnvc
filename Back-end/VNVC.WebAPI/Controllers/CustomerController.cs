using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using VNVC.Application.DTOs;

namespace VNVC.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomerController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    /// <summary>
    /// Đăng ký người dùng mới và tạo đơn đặt hàng tiêm chủng
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateCustomerRequest request)
    {
        var result = await _customerService.RegisterCustomerAsync(request);
        
        return Ok(ApiBaseResponse<object>.Ok(result, "Đăng ký tiêm chủng và tạo đơn hàng thành công"));
    }

    /// <summary>
    /// Lấy danh sách khách hàng có phân trang và tìm kiếm
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPaged([FromQuery] SearchCustomerRequest request)
    {
        var result = await _customerService.GetPagedCustomersAsync(request);
        return Ok(ApiBaseResponse<PagedResult<CustomerListItemDTO>>.Ok(result));
    }
}
