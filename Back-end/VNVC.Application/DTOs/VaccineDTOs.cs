using VNVC.Application.Responses;

namespace VNVC.Application.DTOs;

public class SearchVaccineRequest
{
    public string? SearchTerm { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class VaccineListItemDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string TargetAgeRange { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class VaccineInventoryDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int TotalStock { get; set; }
    public List<VaccineBatchDTO> Batches { get; set; } = new();
}

public class VaccineBatchDTO
{
    public int BatchId { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public int QuantityInStock { get; set; }
    public bool IsExpired => ExpiryDate < DateTime.Today;
    public bool IsOutofStock => QuantityInStock <= 0;
}

public class ImportBatchRequest
{
    public int VaccineId { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public int Quantity { get; set; }
}
