using System.ComponentModel.DataAnnotations;
using VNVC.Domain.Enums;

namespace VNVC.Domain.Entities;

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
