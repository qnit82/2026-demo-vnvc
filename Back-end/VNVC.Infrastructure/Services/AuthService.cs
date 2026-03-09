using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VNVC.Application.DTOs;
using VNVC.Application.Interfaces;
using VNVC.Domain.Entities;
using VNVC.Infrastructure.Persistence;
using VNVC.Application.DTOs;

namespace VNVC.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly VNVCDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(VNVCDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // Sử dụng LinQ để tìm User (Đúng yêu cầu VNVC)
        var user = await _context.Users
            .AsNoTracking() // Tối ưu hóa performance cho Read-only
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        // Sử dụng BCrypt để kiểm tra password
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", user.FullName)
            }),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiryInMinutes"]!)),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new LoginResponse
        {
            Token = tokenHandler.WriteToken(token),
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role
        };
    }

    public async Task<bool> CreateUserAsync(CreateUserRequest request)
    {
        // Kiểm tra user tồn tại chưa
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return false;

        // Mã hóa mật khẩu bằng BCrypt
        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName,
            Role = request.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return true;
    }
}
