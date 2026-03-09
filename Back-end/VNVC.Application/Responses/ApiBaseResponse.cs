namespace VNVC.Application.Responses;

/// <summary>
/// Cấu trúc chuẩn trả về của API cho tất cả các endpoint.
/// Khi thất bại, sử dụng ErrorCode (định dạng snake_UPPER_CASE) để frontend biên dịch đa ngôn ngữ (i18n).
/// Ví dụ: "CUSTOMER_NOT_FOUND" → frontend dùng i18n map qua t('CUSTOMER_NOT_FOUND')
/// </summary>
public class ApiBaseResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Mã lỗi thân thiện để hỗ trợ đa ngôn ngữ (i18n) trên frontend.
    /// Chỉ có giá trị khi thất bại. Quy ước: SCREAMING_SNAKE_CASE.
    /// </summary>
    public string? ErrorCode { get; set; }

    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
    public DateTime ResponseTime { get; set; } = DateTime.UtcNow;

    public static ApiBaseResponse<T> Ok(T data, string message = "Success")
    {
        return new ApiBaseResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiBaseResponse<T> Failure(string message, string? errorCode = null, List<string>? errors = null)
    {
        return new ApiBaseResponse<T>
        {
            Success = false,
            Message = message,
            ErrorCode = errorCode,
            Errors = errors
        };
    }
}
