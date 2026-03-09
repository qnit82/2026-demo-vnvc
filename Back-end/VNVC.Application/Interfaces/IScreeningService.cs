using VNVC.Application.Responses;
using VNVC.Application.DTOs;

namespace VNVC.Application.Interfaces;

public interface IScreeningService
{
    Task<ScreeningQueueResponse> GetQueueAsync(int status, DateTime date, int page, int pageSize, string? searchTerm = null);
    Task<VisitDetailDTO> GetVisitDetailAsync(int visitId);
    Task<bool> SaveScreeningResultAsync(SaveScreeningRequest request);
}
