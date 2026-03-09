using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using VNVC.Application.DTOs;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;

namespace VNVC.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>
    /// Lấy dữ liệu tổng quan cho báo cáo (Overview)
    /// </summary>
    [HttpGet("overview")]
    public async Task<ActionResult<ApiBaseResponse<ReportOverviewDTO>>> GetOverview(
        [FromQuery] DateTime? startDate, 
        [FromQuery] DateTime? endDate)
    {
        var end = endDate ?? DateTime.Today;
        var start = startDate ?? end.AddDays(-6);

        var overview = await _reportService.GetOverviewAsync(start, end);
        return Ok(ApiBaseResponse<ReportOverviewDTO>.Ok(overview));
    }

    /// <summary>
    /// Lấy dữ liệu biểu đồ doanh thu theo thời gian
    /// </summary>
    [HttpGet("revenue-chart")]
    public async Task<ActionResult<ApiBaseResponse<object>>> GetRevenueChart(
        [FromQuery] DateTime? startDate, 
        [FromQuery] DateTime? endDate)
    {
        var end = endDate ?? DateTime.Today;
        var start = startDate ?? end.AddDays(-6); 

        var chartData = await _reportService.GetRevenueChartAsync(start, end);
        return Ok(ApiBaseResponse<object>.Ok(chartData));
    }

    /// <summary>
    /// Lấy danh sách Top Vắc xin được tiêm nhiều nhất
    /// </summary>
    [HttpGet("top-vaccines")]
    public async Task<ActionResult<ApiBaseResponse<object>>> GetTopVaccines(
        [FromQuery] DateTime? startDate, 
        [FromQuery] DateTime? endDate,
        [FromQuery] int limit = 5)
    {
        var end = endDate ?? DateTime.Today;
        var start = startDate ?? end.AddDays(-30);

        var topVaccines = await _reportService.GetTopVaccinesAsync(start, end, limit);
        return Ok(ApiBaseResponse<object>.Ok(topVaccines));
    }

    /// <summary>
    /// Lấy dữ liệu phễu chuyển đổi (Khám -> Tiêm -> Thanh toán)
    /// </summary>
    [HttpGet("funnel")]
    public async Task<ActionResult<ApiBaseResponse<object>>> GetFunnelData(
        [FromQuery] DateTime? startDate, 
        [FromQuery] DateTime? endDate)
    {
        var end = endDate ?? DateTime.Today;
        var start = startDate ?? end.AddDays(-6); 

        var funnel = await _reportService.GetFunnelDataAsync(start, end);
        return Ok(ApiBaseResponse<object>.Ok(funnel));
    }
}
