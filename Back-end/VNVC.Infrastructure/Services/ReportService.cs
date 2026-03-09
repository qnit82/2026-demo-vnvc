using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VNVC.Application.DTOs;
using VNVC.Application.Interfaces;
using VNVC.Domain.Entities;
using VNVC.Domain.Enums;
using VNVC.Infrastructure.Persistence;

namespace VNVC.Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly VNVCDbContext _context;

    public ReportService(VNVCDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetTotalActiveCustomersAsync()
    {
        return await _context.Customers.CountAsync();
    }

    public async Task<ReportOverviewDTO> GetOverviewAsync(DateTime startDate, DateTime endDate)
    {
        var actualEndDate = endDate.Date.AddDays(1);

        var invoices = await _context.Invoices
            .Where(i => i.PaymentStatus == PaymentStatus.Paid && i.PaymentTime >= startDate && i.PaymentTime < actualEndDate)
            .ToListAsync();
        var totalRevenue = invoices.Sum(i => i.TotalAmount);

        var totalVisits = await _context.Visits
            .Where(v => v.CheckInTime >= startDate && v.CheckInTime < actualEndDate)
            .CountAsync();

        var totalInjections = await _context.InjectionLogs
            .Where(il => il.InjectionTime >= startDate && il.InjectionTime < actualEndDate)
            .CountAsync();

        var adverseReactions = await _context.PostInjectionMonitorings
            .Include(pim => pim.InjectionLog)
            .Where(pim => !pim.IsNormal && 
                          pim.InjectionLog != null && 
                          pim.InjectionLog.InjectionTime >= startDate && 
                          pim.InjectionLog.InjectionTime < actualEndDate)
            .CountAsync();
            
        var totalMonitored = await _context.PostInjectionMonitorings
            .Include(pim => pim.InjectionLog)
            .Where(pim => pim.InjectionLog != null && 
                          pim.InjectionLog.InjectionTime >= startDate && 
                          pim.InjectionLog.InjectionTime < actualEndDate)
            .CountAsync();
            
        var reactionRate = totalMonitored > 0 ? (decimal)adverseReactions / totalMonitored * 100 : 0;

        return new ReportOverviewDTO
        {
            TotalRevenue = totalRevenue,
            TotalVisits = totalVisits,
            TotalInjections = totalInjections,
            AdverseReactionRate = Math.Round(reactionRate, 2)
        };
    }

    public async Task<List<RevenueDataPoint>> GetRevenueChartAsync(DateTime startDate, DateTime endDate)
    {
        var actualEndDate = endDate.Date.AddDays(1);

        var invoices = await _context.Invoices
            .Where(i => i.PaymentStatus == PaymentStatus.Paid && i.PaymentTime >= startDate && i.PaymentTime < actualEndDate)
            .Select(i => new { Date = i.PaymentTime!.Value.Date, Amount = i.TotalAmount })
            .ToListAsync();

        var grouped = invoices
            .GroupBy(i => i.Date)
            .Select(g => new RevenueDataPoint
            {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Amount = g.Sum(x => x.Amount)
            })
            .OrderBy(x => x.Date)
            .ToList();
            
        return FillMissingDates(grouped, startDate, endDate);
    }

    public async Task<List<TopVaccineDTO>> GetTopVaccinesAsync(DateTime startDate, DateTime endDate, int limit = 5)
    {
        var actualEndDate = endDate.Date.AddDays(1);

        var injections = await _context.InjectionLogs
            .Include(il => il.Batch)
            .ThenInclude(b => b.Vaccine)
            .Where(il => il.InjectionTime >= startDate && il.InjectionTime < actualEndDate && il.Batch != null && il.Batch.Vaccine != null)
            .ToListAsync();
            
        return injections
            .GroupBy(il => il.Batch!.Vaccine!.Id)
            .Select(g => new TopVaccineDTO
            {
                VaccineId = g.Key,
                VaccineName = g.First().Batch!.Vaccine!.Name,
                UsageCount = g.Count()
            })
            .OrderByDescending(x => x.UsageCount)
            .Take(limit)
            .ToList();
    }

    public async Task<FunnelDataDTO> GetFunnelDataAsync(DateTime startDate, DateTime endDate)
    {
        var actualEndDate = endDate.Date.AddDays(1);

        var visits = await _context.Visits
            .Include(v => v.Invoice)
            .Where(v => v.CheckInTime >= startDate && v.CheckInTime < actualEndDate)
            .ToListAsync();

        int registered = visits.Count;
        int screened = visits.Count(v => v.Status >= VisitStatus.WaitPayment); // WaitPayment means screening is done
        int paid = visits.Count(v => v.Invoice != null && v.Invoice.PaymentStatus == PaymentStatus.Paid);
        
        // Count fully injected visits
        var visitIds = visits.Select(v => v.Id).ToList();
        var injectedVisitsCount = await _context.InjectionLogs
            .Include(il => il.Prescription)
            .ThenInclude(p => p.ScreeningResult)
            .Where(il => il.Prescription != null && il.Prescription.ScreeningResult != null && visitIds.Contains(il.Prescription.ScreeningResult.VisitId))
            .Select(il => il.Prescription!.ScreeningResult!.VisitId)
            .Distinct()
            .CountAsync();

        return new FunnelDataDTO
        {
            Registered = registered,
            Screened = screened,
            Paid = paid,
            Injected = injectedVisitsCount
        };
    }
    
    // Helper to ensure all dates in the range have a data point (even if 0)
    private List<RevenueDataPoint> FillMissingDates(List<RevenueDataPoint> data, DateTime startDate, DateTime endDate)
    {
        var result = new List<RevenueDataPoint>();
        var currentDate = startDate.Date;
        var end = endDate.Date;
        
        while (currentDate <= end)
        {
            var dateStr = currentDate.ToString("yyyy-MM-dd");
            var existingPoint = data.FirstOrDefault(d => d.Date == dateStr);
            
            if (existingPoint != null)
            {
                result.Add(existingPoint);
            }
            else
            {
                result.Add(new RevenueDataPoint { Date = dateStr, Amount = 0 });
            }
            
            currentDate = currentDate.AddDays(1);
        }
        
        return result;
    }
}
