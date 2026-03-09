using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VNVC.Application.Responses;
using VNVC.Domain.Enums;
using VNVC.Infrastructure.Persistence;

namespace VNVC.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UtilController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly VNVCDbContext _context;
    public UtilController(IHttpClientFactory httpClientFactory, VNVCDbContext context)
    {
        _httpClientFactory = httpClientFactory;
        _context = context;
    }

    /// <summary>
    /// Lấy toàn bộ danh sách xã/phường/thị trấn từ API bên ngoài
    /// </summary>
    [HttpGet("commune")]
    public async Task<IActionResult> GetCommunes()
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync("https://production.cas.so/address-kit/2026-03-07/communes");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                // Vì API gốc trả về object { requestId, communes: [...] }
                // Trả về trực tiếp nội dung JSON
                return Content(content, "application/json");
            }

            return BadRequest(ApiBaseResponse<string>.Failure("Không thể lấy dữ liệu địa chính từ server gốc", "COMMUNE_FETCH_FAILED"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiBaseResponse<string>.Failure("Lỗi server: " + ex.Message, "SERVER_ERROR"));
        }
    }

    /// <summary>
    /// Lấy các thống kê tổng quan dùng hiển thị trên Dashboard
    /// </summary>
    [HttpGet("dashboard-stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var waitScreening = await _context.Visits.CountAsync(v => v.Status == VisitStatus.WaitScreening);
        var waitInjection = await _context.Visits.CountAsync(v => v.Status == VisitStatus.WaitInjection);
        var waitPayment = await _context.Visits.CountAsync(v => v.Status == VisitStatus.WaitPayment);
        var lowStock = await _context.VaccineBatches.CountAsync(b => b.QuantityInStock < 20);
        var completedToday = await _context.Visits.CountAsync(v => v.Status == VisitStatus.Completed && v.CheckInTime.Date == DateTime.UtcNow.Date);

        return Ok(ApiBaseResponse<object>.Ok(new
        {
            WaitScreening = waitScreening,
            WaitInjection = waitInjection,
            WaitPayment = waitPayment,
            LowStock = lowStock,
            CompletedToday = completedToday
        }));
    }

    /// <summary>
    /// Lấy danh sách các thông báo cần chú ý dùng cho luồng vận hành ở Frontend
    /// </summary>
    [HttpGet("business-alerts")]
    public async Task<IActionResult> GetBusinessAlerts()
    {
        // Thực tế: Lấy các lô sắp hết hạn (< 30 ngày) và các loại vắc xin sắp hết hàng (< 20 liều)
        var lowStockVaccines = await _context.VaccineBatches
            .Where(b => b.QuantityInStock < 20 && b.QuantityInStock > 0)
            .Select(b => new { b.Vaccine.Name, b.BatchNumber, b.QuantityInStock, Type = "LowStock" })
            .Take(3)
            .ToListAsync();

        var expiringBatches = await _context.VaccineBatches
            .Where(b => b.ExpiryDate > DateTime.UtcNow && b.ExpiryDate < DateTime.UtcNow.AddDays(30))
            .Select(b => new { b.Vaccine.Name, b.BatchNumber, b.ExpiryDate, Type = "Expiring" })
            .Take(3)
            .ToListAsync();

        var alerts = new List<object>();
        foreach (var item in lowStockVaccines)
        {
            alerts.Add(new { msg = $"Vắc xin {item.Name} (Lô {item.BatchNumber}) sắp hết hàng: {item.QuantityInStock} liều.", type = "Warning", time = "Vừa xong" });
        }
        foreach (var item in expiringBatches)
        {
            alerts.Add(new { msg = $"Lô {item.BatchNumber} ({item.Name}) sắp hết hạn vào ngày {item.ExpiryDate:dd/MM/yyyy}.", type = "Critical", time = "Hôm nay" });
        }

        // Nếu rỗng thì thêm 1 mẫu
        if (alerts.Count == 0)
        {
            alerts.Add(new { msg = "Hệ thống vận hành bình thường. Không có cảnh báo tồn kho.", type = "Success", time = "Hiện tại" });
        }

        return Ok(ApiBaseResponse<List<object>>.Ok(alerts));
    }
}
