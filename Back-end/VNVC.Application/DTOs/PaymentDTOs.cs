namespace VNVC.Application.DTOs;

public class PaymentQueueResponse
{
    public List<PaymentQueueDTO> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

public class PaymentQueueDTO
{
    public int VisitId { get; set; }
    public string PID { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime DOB { get; set; }
    public string Gender { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime RequestTime { get; set; }
    public int PaymentStatus { get; set; }
}

public class InvoiceDetailDTO
{
    public int VisitId { get; set; }
    public string PID { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int PaymentStatus { get; set; } // 0: Pending, 1: Paid, 2: Cancelled
    
    public List<InvoiceItemDTO> Items { get; set; } = new();
}

public class InvoiceItemDTO
{
    public string VaccineName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal => Quantity * UnitPrice;
}

public class ConfirmPaymentRequest
{
    public int VisitId { get; set; }
    public string PaymentMethod { get; set; } = "Cash"; // Cash, Transfer
}
