using Microsoft.EntityFrameworkCore;
using VNVC.Application.Interfaces;
using VNVC.Application.Responses;
using VNVC.Infrastructure.Persistence;
using VNVC.Application.DTOs;
using MiniExcelLibs;

namespace VNVC.Infrastructure.Services;

public class VaccineService : IVaccineService
{
    private readonly VNVCDbContext _context;

    public VaccineService(VNVCDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<VaccineListItemDTO>> GetPagedVaccinesAsync(SearchVaccineRequest request)
    {
        var query = _context.Vaccines.AsNoTracking();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(v => 
                v.Name.ToLower().Contains(term) ||
                v.Description.ToLower().Contains(term) ||
                v.TargetAgeRange.ToLower().Contains(term)
            );
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .OrderBy(v => v.Name)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(v => new VaccineListItemDTO
            {
                Id = v.Id,
                Name = v.Name,
                Description = v.Description,
                TargetAgeRange = v.TargetAgeRange,
                Price = v.Price
            })
            .ToListAsync();

        return new PagedResult<VaccineListItemDTO>
        {
            Items = items,
            TotalItems = totalItems,
            PageNumber = request.Page,
            PageSize = request.PageSize
        };
    }
    public async Task<List<VaccineInventoryDTO>> GetInventoryAsync()
    {
        return await _context.Vaccines
            .AsNoTracking()
            .Include(v => v.Batches)
            .OrderBy(v => v.Name)
            .Select(v => new VaccineInventoryDTO
            {
                Id = v.Id,
                Name = v.Name,
                Price = v.Price,
                TotalStock = v.Batches.Sum(b => b.QuantityInStock),
                Batches = v.Batches
                    .OrderBy(b => b.ExpiryDate)
                    .Select(b => new VaccineBatchDTO
                    {
                        BatchId = b.Id,
                        BatchNumber = b.BatchNumber,
                        ExpiryDate = b.ExpiryDate,
                        QuantityInStock = b.QuantityInStock
                    }).ToList()
            })
            .ToListAsync();
    }

    public async Task<bool> ImportBatchAsync(ImportBatchRequest request)
    {
        var vaccine = await _context.Vaccines.FindAsync(request.VaccineId);
        if (vaccine == null) return false;

        var existingBatch = await _context.VaccineBatches
            .FirstOrDefaultAsync(b => b.VaccineId == request.VaccineId && b.BatchNumber == request.BatchNumber);

        if (existingBatch != null)
        {
            existingBatch.QuantityInStock += request.Quantity;
            existingBatch.ExpiryDate = request.ExpiryDate;
        }
        else
        {
            _context.VaccineBatches.Add(new VNVC.Domain.Entities.VaccineBatch
            {
                VaccineId = request.VaccineId,
                BatchNumber = request.BatchNumber,
                ExpiryDate = request.ExpiryDate,
                QuantityInStock = request.Quantity
            });
        }

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<int> ImportBatchesFromExcelAsync(Stream excelStream)
    {
        var rows = excelStream.Query(useHeaderRow: true).ToList();
        int importedCount = 0;

        foreach (var row in rows)
        {
            // Dự kiến các cột: VaccineName, BatchNumber, ExpiryDate, Quantity
            string vaccineName = row.VaccineName?.ToString();
            string batchNumber = row.BatchNumber?.ToString();
            string expiryDateStr = row.ExpiryDate?.ToString();
            string quantityStr = row.Quantity?.ToString();

            if (string.IsNullOrEmpty(vaccineName) || string.IsNullOrEmpty(batchNumber)) continue;

            var vaccine = await _context.Vaccines.FirstOrDefaultAsync(v => v.Name.ToLower() == vaccineName.ToLower());
            if (vaccine == null) continue;

            if (!DateTime.TryParse(expiryDateStr, out DateTime expiryDate)) continue;
            if (!int.TryParse(quantityStr, out int quantity)) continue;

            var existingBatch = await _context.VaccineBatches
                .FirstOrDefaultAsync(b => b.VaccineId == vaccine.Id && b.BatchNumber == batchNumber);

            if (existingBatch != null)
            {
                existingBatch.QuantityInStock += quantity;
                existingBatch.ExpiryDate = expiryDate;
            }
            else
            {
                _context.VaccineBatches.Add(new VNVC.Domain.Entities.VaccineBatch
                {
                    VaccineId = vaccine.Id,
                    BatchNumber = batchNumber,
                    ExpiryDate = expiryDate,
                    QuantityInStock = quantity
                });
            }
            importedCount++;
        }

        await _context.SaveChangesAsync();
        return importedCount;
    }
}
