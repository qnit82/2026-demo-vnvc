namespace VNVC.Domain.Entities;

public class ScreeningResult
{
    public int Id { get; set; }
    public int VisitId { get; set; }
    public virtual Visit? Visit { get; set; }

    // Chỉ số sinh tồn (Vital Signs)
    public decimal? Temperature { get; set; } // Nhiệt độ
    public decimal? Weight { get; set; }      // Cân nặng
    public decimal? Height { get; set; }      // Chiều cao
    public int? HeartRate { get; set; }       // Nhịp tim
    public int? RespiratoryRate { get; set; } // Nhịp thở
    public string? BloodPressure { get; set; } // Huyết áp (vd: 120/80)
    
    // Khám lâm sàng
    public string? ClinicalAssessment { get; set; } // Đánh giá lâm sàng (Tim, Phổi...)
    
    // Kết luận của bác sĩ
    public bool IsEligible { get; set; }
    public string DoctorNote { get; set; } = string.Empty;
    public DateTime ExaminationTime { get; set; }

    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
