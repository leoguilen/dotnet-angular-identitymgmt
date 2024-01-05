namespace IdentityProvider.Infra.Configurations;

internal record SmtpOptions
{
    internal const string SectionName = "Smtp";

    public required string From { get; init; }

    public required string Host { get; init; }

    public required int Port { get; init; }

    public required bool UseCredentials { get; init; } = false;

    public required string UserName { get; init; }

    public required string Password { get; init; }
}
