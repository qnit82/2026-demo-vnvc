using VNVC.Domain.Enums;

namespace VNVC.Domain.Entities;

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
