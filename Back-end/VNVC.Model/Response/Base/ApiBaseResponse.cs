namespace VNVC.Models.Response.Base
{
    public class ApiBaseResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public string MessageCode { get; set; } = string.Empty;
        public long Id { get; set; }
    }

    public class ApiBaseResponse<T> : ApiBaseResponse
    {
        public T? Data { get; set; }
        public ApiBaseResponse()
        {
        }

        public ApiBaseResponse(bool status, string message, long id = 0, string messageCode = "")
        {
            Status = status;
            Message = message;
            Id = id;
            MessageCode = messageCode;
        }

        public void Success(T data, string message = "")
        {
            Status = true;
            Data = data;
            Message = message;
        }

        public void Fail(string message)
        {
            Status = false;
            Message = message;
        }

        public void Fail(T data, string message)
        {
            Status = false;
            Message = message;
            Data = data;
        }
    }
}
