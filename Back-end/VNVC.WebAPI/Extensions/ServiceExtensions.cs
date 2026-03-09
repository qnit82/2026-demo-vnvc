using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VNVC.Application.Interfaces;
using VNVC.Infrastructure.Persistence;
using VNVC.Infrastructure.Services;

namespace VNVC.WebAPI.Extensions;

/// <summary>
/// Các phương thức mở rộng cho IServiceCollection để tổ chức và đăng ký Service ứng dụng một cách gọn gàng.
/// Theo mô hình "Clean Startup" để giữ cho file Program.cs tối giản nhất.
/// </summary>
public static class ServiceExtensions
{
    /// <summary>
    /// Đăng ký Entity Framework DbContext với SQL Server.
    /// </summary>
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<VNVCDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

        return services;
    }

    /// <summary>
    /// Đăng ký tất cả các business services cấp ứng dụng (Scoped lifetime).
    /// Thêm các Service mới tại đây khi ứng dụng phát triển thêm.
    /// </summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IVaccineService, VaccineService>();
        services.AddScoped<IScreeningService, ScreeningService>();
        services.AddScoped<IInjectionService, InjectionService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IReportService, ReportService>();

        // HttpClient để gọi các API bên ngoài (ví dụ: tra cứu tỉnh/thành, phường/xã)
        services.AddHttpClient();

        return services;
    }

    /// <summary>
    /// Cấu hình JWT Bearer authentication sử dụng các thiết lập từ appsettings.json.
    /// </summary>
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var jwtSettings = config.GetSection("Jwt");
        var keyString = jwtSettings["Key"];
        
        if (string.IsNullOrEmpty(keyString))
        {
            throw new InvalidOperationException("JWT Key chưa được cấu hình trong appsettings.json.");
        }

        var key = Encoding.ASCII.GetBytes(keyString);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        return services;
    }

    /// <summary>
    /// Cấu hình các chính sách CORS. Tách biệt các origin cho môi trường dev và production.
    /// Thông tin Origin được quản lý trong appsettings.json để linh hoạt khi deploy.
    /// </summary>
    public static IServiceCollection AddCorsPolicies(this IServiceCollection services, IConfiguration config)
    {
        var allowedOrigins = config.GetSection("AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:5173" };

        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        return services;
    }
}
