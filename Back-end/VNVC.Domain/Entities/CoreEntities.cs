using System.ComponentModel.DataAnnotations;
using VNVC.Domain.Enums;

namespace VNVC.Domain.Entities;

public class Customer
{
    public int Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string PID { get; set; } = string.Empty; // Mã định danh duy nhất

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    public DateTime DOB { get; set; }
    
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;

    // Các trường bổ sung theo phân tích BA
    [MaxLength(12)]
    public string? IdentityCard { get; set; } // CCCD/CMND

    [MaxLength(100)]
    public string? GuardianName { get; set; } // Tên người giám hộ

    [MaxLength(15)]
    public string? GuardianPhone { get; set; } // SĐT người giám hộ

    [MaxLength(50)]
    public string? GuardianRelation { get; set; } // Mối quan hệ (Cha, Mẹ,...)

    public string? MedicalHistory { get; set; } // Tiền sử y tế (dị ứng, bệnh lý)

    public int? ParentId { get; set; }
    public virtual Customer? Parent { get; set; }
    public virtual ICollection<Customer> Children { get; set; } = new List<Customer>();

    public virtual ICollection<Visit> Visits { get; set; } = new List<Visit>();
}

public class Vaccine
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public string TargetAgeRange { get; set; } = string.Empty;
    public string Contraindications { get; set; } = string.Empty;
    public decimal Price { get; set; }

    public virtual ICollection<VaccineBatch> Batches { get; set; } = new List<VaccineBatch>();
}

public class VaccineBatch
{
    public int Id { get; set; }
    public int VaccineId { get; set; }
    public virtual Vaccine? Vaccine { get; set; }

    [Required]
    [MaxLength(50)]
    public string BatchNumber { get; set; } = string.Empty;

    public DateTime ExpiryDate { get; set; }
    public int QuantityInStock { get; set; }
}

public class Visit
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public virtual Customer? Customer { get; set; }

    public DateTime CheckInTime { get; set; }
    public VisitStatus Status { get; set; }

    public virtual ScreeningResult? ScreeningResult { get; set; }
    public virtual Order? Order { get; set; } // Lượt đăng ký tạo ra 1 Order
    public virtual Invoice? Invoice { get; set; }
}

public class InjectionLog
{
    public int Id { get; set; }
    public int PrescriptionId { get; set; }
    public virtual Prescription? Prescription { get; set; }

    public int? NurseId { get; set; }
    public virtual User? Nurse { get; set; }

    public int BatchId { get; set; }
    public virtual VaccineBatch? Batch { get; set; }

    public string InjectionSite { get; set; } = string.Empty; // Vị trí tiêm (Bắp tay trái,...)
    public DateTime InjectionTime { get; set; }
    
    public virtual PostInjectionMonitoring? Monitoring { get; set; }
}

public class PostInjectionMonitoring
{
    public int Id { get; set; }
    public int InjectionLogId { get; set; }
    public virtual InjectionLog? InjectionLog { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    
    [MaxLength(500)]
    public string? ReactionNote { get; set; } // Phản ứng sau tiêm
    public bool IsNormal { get; set; } = true;

    [MaxLength(50)]
    public string Status { get; set; } = "Monitoring"; // Normal, Warning, Finished
}

public class Order
{
    public int Id { get; set; }
    public int VisitId { get; set; }
    public virtual Visit? Visit { get; set; }

    [Required]
    [MaxLength(20)]
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}

public class OrderDetail
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public virtual Order? Order { get; set; }

    public int VaccineId { get; set; }
    public virtual Vaccine? Vaccine { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal => Quantity * UnitPrice;
}

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

public class Prescription
{
    public int Id { get; set; }
    public int ScreeningResultId { get; set; }
    public virtual ScreeningResult? ScreeningResult { get; set; }

    public int VaccineId { get; set; }
    public virtual Vaccine? Vaccine { get; set; }

    public int DoseNumber { get; set; }
}

public class Invoice
{
    public int Id { get; set; }
    public int VisitId { get; set; }
    public virtual Visit? Visit { get; set; }

    public decimal TotalAmount { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public DateTime? PaymentTime { get; set; }
}
