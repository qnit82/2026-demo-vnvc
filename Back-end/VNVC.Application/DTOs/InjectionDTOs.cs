namespace VNVC.Application.DTOs;

public class InjectionQueueDTO
{
    public int VisitId { get; set; }
    public string PID { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime DOB { get; set; }
    public string Gender { get; set; } = string.Empty;
    public DateTime ScreeningTime { get; set; }
    public string? DoctorNote { get; set; }
}

public class InjectionVisitDetailDTO
{
    public int VisitId { get; set; }
    public string PID { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime DOB { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string? MedicalHistory { get; set; }
    public string? DoctorNote { get; set; }
    
    public List<PrescribedVaccineDTO> PrescribedVaccines { get; set; } = new();
}

public class PrescribedVaccineDTO
{
    public int PrescriptionId { get; set; }
    public int VaccineId { get; set; }
    public string VaccineName { get; set; } = string.Empty;
    public int DoseNumber { get; set; }
    public bool IsInjected { get; set; }
    
    public List<VaccineBatchDTO> AvailableBatches { get; set; } = new();
}

public class ConfirmInjectionRequest
{
    public int PrescriptionId { get; set; }
    public int BatchId { get; set; }
    public string InjectionSite { get; set; } = string.Empty;
}

public class InjectionQueueResponse
{
    public List<InjectionQueueDTO> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
