using VNVC.Application.DTOs;

namespace VNVC.Application.Interfaces;

public interface IInjectionService
{
    Task<InjectionQueueResponse> GetQueueAsync(int status, DateTime date, int page, int pageSize, string? searchTerm = null);
    Task<InjectionVisitDetailDTO?> GetVisitDetailAsync(int visitId);
    Task<bool> ConfirmInjectionAsync(ConfirmInjectionRequest request, int nurseId);
}
