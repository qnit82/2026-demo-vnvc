namespace VNVC.Domain.Entities;

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
