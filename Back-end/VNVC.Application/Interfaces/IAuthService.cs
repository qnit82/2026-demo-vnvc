using VNVC.Application.DTOs;

namespace VNVC.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<bool> CreateUserAsync(CreateUserRequest request);
}
