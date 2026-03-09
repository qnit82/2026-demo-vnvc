namespace VNVC.Application.DTOs;

public class ScreeningVisitDTO
{
    public int VisitId { get; set; }
    public string PID { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime DOB { get; set; }
    public string Gender { get; set; } = string.Empty;
    public DateTime CheckInTime { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class VisitDetailDTO
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string PID { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime DOB { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string MedicalHistory { get; set; } = string.Empty;
    
    // Kết quả khám sàng lọc (nếu đã có)
    public decimal? Temperature { get; set; }
    public decimal? Weight { get; set; }
    public decimal? Height { get; set; }
    public int? HeartRate { get; set; }
    public int? RespiratoryRate { get; set; }
    public string? BloodPressure { get; set; }
    public string? ClinicalAssessment { get; set; }
    public bool IsEligible { get; set; }
    public string? DoctorNote { get; set; }
    public bool HasScreeningResult { get; set; }

    public List<PreSelectedVaccineDTO> PreSelectedVaccines { get; set; } = new();
}

public class PreSelectedVaccineDTO
{
    public int VaccineId { get; set; }
    public string VaccineName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class SaveScreeningRequest
{
    public int VisitId { get; set; }
    public decimal? Temperature { get; set; }
    public decimal? Weight { get; set; }
    public decimal? Height { get; set; }
    public int? HeartRate { get; set; }
    public int? RespiratoryRate { get; set; }
    public string? BloodPressure { get; set; }
    public string? ClinicalAssessment { get; set; }
    public bool IsEligible { get; set; }
    public string DoctorNote { get; set; } = string.Empty;
    public List<int> VaccineIds { get; set; } = new();
}

public class ScreeningQueueResponse
{
    public List<ScreeningVisitDTO> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
