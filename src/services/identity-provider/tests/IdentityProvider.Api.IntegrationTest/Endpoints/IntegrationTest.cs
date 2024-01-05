using Xunit.Abstractions;

namespace IdentityProvider.Api.IntegrationTest.Endpoints;

public abstract class IntegrationTest(
    CustomWebApplicationFactory factory,
    ITestOutputHelper outputHelper)
    : IClassFixture<CustomWebApplicationFactory>
{
    protected HttpClient Client => factory.Server.CreateClient();

    protected ITestOutputHelper Logger => outputHelper;
}
