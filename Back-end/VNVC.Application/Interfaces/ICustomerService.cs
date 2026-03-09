using VNVC.Application.Responses;
using VNVC.Application.DTOs;

namespace VNVC.Application.Interfaces;

public interface ICustomerService
{
    Task<object> RegisterCustomerAsync(CreateCustomerRequest request);
    Task<int> CreateVisitAsync(CreateVisitRequest request);
    Task<PagedResult<CustomerListItemDTO>> GetPagedCustomersAsync(SearchCustomerRequest request);
}
