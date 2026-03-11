using VNVC.Domain.Enums;

namespace VNVC.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }
    public int VisitId { get; set; }
    public virtual Visit? Visit { get; set; }

    public decimal TotalAmount { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public DateTime? PaymentTime { get; set; }
}
