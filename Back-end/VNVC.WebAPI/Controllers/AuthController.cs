using Microsoft.AspNetCore.Mvc;
using VNVC.Application.DTOs;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using Microsoft.AspNetCore.Authorization;

namespace VNVC.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Xử lý đăng nhập của người dùng và trả về JWT token
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        
        if (response == null)
            // Trả về ErrorCode để Frontend hiển thị đa ngôn ngữ (i18n)
            return Unauthorized(ApiBaseResponse<LoginResponse>.Failure("Tên đăng nhập hoặc mật khẩu không đúng", "INVALID_CREDENTIALS"));

        return Ok(ApiBaseResponse<LoginResponse>.Ok(response, "Đăng nhập thành công"));
    }

    /// <summary>
    /// API dùng để tạo tài khoản quản trị (admin) mới
    /// </summary>
    [HttpPost("register-admin")]
    public async Task<IActionResult> RegisterAdmin([FromBody] CreateUserRequest request)
    {
        if (request.KeyHash!="Dev@123#!")
        {
            //Hard code để tạo Account test bằng swagger cho an toàn
            return Ok(ApiBaseResponse<string>.Ok("Faile", "Faile !"));
        }

        var success = await _authService.CreateUserAsync(request);
        
        if (!success)
            return BadRequest(ApiBaseResponse<string>.Failure("Tên đăng nhập đã tồn tại", "USER_ALREADY_EXISTS"));

        return Ok(ApiBaseResponse<string>.Ok("Success", "Tạo tài khoản Admin thành công"));
    }
    
    /// <summary>
    /// Kiểm tra tính hợp lệ của token
    /// </summary>
    [Authorize]
    [HttpGet("verify")]
    public IActionResult Verify()
    {
        return Ok(ApiBaseResponse<string>.Ok("Authenticated", "Xác thực thành công"));
    }
}
