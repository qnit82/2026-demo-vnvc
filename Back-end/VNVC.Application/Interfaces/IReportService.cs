using VNVC.Application.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace VNVC.Application.Interfaces;

public interface IReportService
{
    Task<ReportOverviewDTO> GetOverviewAsync(DateTime startDate, DateTime endDate);
    Task<List<RevenueDataPoint>> GetRevenueChartAsync(DateTime startDate, DateTime endDate);
    Task<List<TopVaccineDTO>> GetTopVaccinesAsync(DateTime startDate, DateTime endDate, int limit = 5);
    Task<FunnelDataDTO> GetFunnelDataAsync(DateTime startDate, DateTime endDate);
}
