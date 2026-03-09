namespace VNVC.Application.DTOs;

public class CreateCustomerRequest
{
    public string FullName { get; set; } = string.Empty;
    public DateTime DOB { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? IdentityCard { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }
    public string? GuardianRelation { get; set; }
    public string? MedicalHistory { get; set; }
    public int? ParentId { get; set; }
    public List<int>? VaccineIds { get; set; } // Vắc xin mong muốn
}

public class CreateVisitRequest
{
    public int CustomerId { get; set; }
}

public class SearchCustomerRequest
{
    public string? SearchTerm { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class CustomerListItemDTO
{
    public int Id { get; set; }
    public string PID { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime DOB { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? IdentityCard { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }
    public string? GuardianRelation { get; set; }
    public string? MedicalHistory { get; set; }
}
