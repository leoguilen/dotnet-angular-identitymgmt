using IdentityProvider.Domain.Entities;

namespace IdentityProvider.Api.Contracts.Responses;

public readonly record struct UserResponse(
    Guid Id,
    string UserName,
    string Email,
    string? PhoneNumber)
{
    public static UserResponse FromUser(User user) => new(
        Guid.Parse(user.Id),
        user.UserName!,
        user.Email!,
        user.PhoneNumber);
}
