namespace VNVC.Application.DTOs;
public class VisitDetailDto
{
    public int VisitId { get; set; }
    public string PID { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime DOB { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string? MedicalHistory { get; set; }
    public string? DoctorNote { get; set; }
    public List<PrescriptionDto> PrescribedVaccines { get; set; } = new List<PrescriptionDto>();
}

public class PrescriptionDto
{
    public int PrescriptionId { get; set; }
    public int VaccineId { get; set; }
    public string VaccineName { get; set; } = string.Empty;
    public int DoseNumber { get; set; }
    public bool IsInjected { get; set; }
    public List<BatchDto> AvailableBatches { get; set; } = new List<BatchDto>();
}

public class BatchDto
{
    public int BatchId { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public int QuantityInStock { get; set; }
}