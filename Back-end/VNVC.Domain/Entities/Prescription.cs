namespace VNVC.Domain.Entities;

public class Prescription
{
    public int Id { get; set; }
    public int ScreeningResultId { get; set; }
    public virtual ScreeningResult? ScreeningResult { get; set; }

    public int VaccineId { get; set; }
    public virtual Vaccine? Vaccine { get; set; }

    public int DoseNumber { get; set; }
}
