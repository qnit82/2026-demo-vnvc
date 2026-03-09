namespace VNVC.Domain.Enums;

public enum VisitStatus
{
    WaitScreening = 0,    // Chờ khám sàng lọc
    Screening = 1,        // Đang khám sàng lọc
    WaitPayment = 2,      // Chờ thanh toán
    WaitInjection = 3,    // Chờ tiêm
    Monitoring = 4,       // Đang theo dõi sau tiêm
    Completed = 5,        // Hoàn thành
    Cancelled = 6         // Đã hủy
}

public enum PaymentStatus
{
    Pending = 0,//Đang chờ
    Paid = 1,//Đã thanh toán
    Cancelled = 2//Đã hủy
}

public enum OrderStatus
{
    Pending = 0,//Đang chờ
    Confirmed = 1,//Đã xác nhận
    Paid = 2,//Đã thanh toán
    Cancelled = 3//Đã hủy
}
