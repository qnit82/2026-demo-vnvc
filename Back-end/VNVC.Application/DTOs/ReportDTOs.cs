namespace VNVC.Application.DTOs;

public class ReportOverviewDTO
{
    public decimal TotalRevenue { get; set; }
    public int TotalVisits { get; set; }
    public int TotalInjections { get; set; }
    public decimal AdverseReactionRate { get; set; } // Percentage
}

public class RevenueDataPoint
{
    public string Date { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

public class TopVaccineDTO
{
    public int VaccineId { get; set; }
    public string VaccineName { get; set; } = string.Empty;
    public int UsageCount { get; set; }
}

public class FunnelDataDTO
{
    public int Registered { get; set; }
    public int Screened { get; set; }
    public int Paid { get; set; }
    public int Injected { get; set; }
}
