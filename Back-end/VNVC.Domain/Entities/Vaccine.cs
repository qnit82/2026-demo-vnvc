using System.ComponentModel.DataAnnotations;

namespace VNVC.Domain.Entities;

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
