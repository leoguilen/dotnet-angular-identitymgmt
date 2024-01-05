using System.Net.Mime;
using IdentityProvider.Api.Contracts.Responses;
using IdentityProvider.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace IdentityProvider.Api.Extensions;

public static class EndpointRouteBuilder
{
    public static IEndpointRouteBuilder MapIdentityApi(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapIdentityApi<User>();

        endpoints
            .MapGet("/me", async (HttpContext context, UserManager<User> userManager) =>
            {
                var user = await userManager.GetUserAsync(context.User).ConfigureAwait(false);
                return user is null
                    ? Results.Unauthorized()
                    : Results.Ok(UserResponse.FromUser(user));
            })
            .Produces<UserResponse>(contentType: MediaTypeNames.Application.Json)
            .ProducesProblem(statusCode: StatusCodes.Status401Unauthorized, contentType: MediaTypeNames.Application.Json)
            .RequireAuthorization();

        endpoints
            .MapPost("/logout", async (HttpContext context, SignInManager<User> signInManager) =>
            {
                await signInManager.SignOutAsync().ConfigureAwait(false);
                return Results.Ok();
            })
            .ProducesProblem(statusCode: StatusCodes.Status401Unauthorized, contentType: MediaTypeNames.Application.Json)
            .RequireAuthorization();

        return endpoints;
    }
}