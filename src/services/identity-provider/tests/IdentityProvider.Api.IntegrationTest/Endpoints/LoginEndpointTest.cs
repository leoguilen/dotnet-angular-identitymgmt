using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity.Data;
using Xunit.Abstractions;

namespace IdentityProvider.Api.IntegrationTest.Endpoints;

[Trait("IntegrationTest", "/api/accounts/login")]
public class LoginEndpointTest(
    CustomWebApplicationFactory factory,
    ITestOutputHelper outputHelper)
    : IntegrationTest(factory, outputHelper)
{
    [Fact(Skip = "Missing implementation")]
    public async Task ShouldReturnBadRequestWhenRequestIsInvalid()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "invalid-email",
            Password = "invalid-password"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/accounts/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact(Skip = "Missing implementation")]
    public async Task ShouldReturnUnauthorizedWhenCredentialsAreInvalid()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "test@email.com",
            Password = "invalid-password"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/accounts/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact(Skip = "Missing implementation")]
    public async Task ShouldReturnOkWhenCredentialsAreValid()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "test@email.com",
            Password = "valid-password"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/accounts/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadFromJsonAsync<AccessTokenResponse>();
        content.Should()
            .NotBeNull().And
            .Match<AccessTokenResponse>(x => !string.IsNullOrEmpty(x.AccessToken));
    }
}
