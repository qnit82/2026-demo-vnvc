using System.ComponentModel.DataAnnotations;

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
