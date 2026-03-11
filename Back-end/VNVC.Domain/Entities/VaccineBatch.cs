using System.ComponentModel.DataAnnotations;

namespace VNVC.Domain.Entities;

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
