using VNVC.Application.Responses;
using VNVC.Application.DTOs;

namespace VNVC.Application.Interfaces;

public interface IVaccineService
{
    Task<PagedResult<VaccineListItemDTO>> GetPagedVaccinesAsync(SearchVaccineRequest request);
    Task<List<VaccineInventoryDTO>> GetInventoryAsync();
    Task<bool> ImportBatchAsync(ImportBatchRequest request);
    Task<int> ImportBatchesFromExcelAsync(Stream excelStream);
}
