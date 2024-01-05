using IdentityProvider.Domain.Entities;
using IdentityProvider.Infra.Configurations;
using IdentityProvider.Infra.Data.Context;
using IdentityProvider.Infra.Data.Interceptors;
using IdentityProvider.Infra.Notifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.FeatureManagement;

namespace IdentityProvider.Infra.Extensions;

public static class ServiceCollectionExtensions
{
    private static readonly bool _isDevelopment =
        Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") is "Development";

    public static IServiceCollection AddInfra(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<SmtpOptions>(options =>
            configuration.GetRequiredSection(SmtpOptions.SectionName).Bind(options));
        services.AddTransient<IEmailSender<User>, EmailNotificationSender>();

        services.AddScoped<AuditingInterceptor>();
        services.AddDbContext<AppDbContext>((sp, options) =>
        {
            options.UseSqlServer(
                connectionString: configuration.GetConnectionString("Default"),
                sqlServerOptionsAction: sqlOptions =>
                {
                    sqlOptions.MigrationsAssembly(
                        assemblyName: typeof(AppDbContext).Assembly.FullName);
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 15,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null);
                });
            options.AddInterceptors(sp.GetRequiredService<AuditingInterceptor>());
            options.EnableDetailedErrors(detailedErrorsEnabled: _isDevelopment);
            options.EnableSensitiveDataLogging(sensitiveDataLoggingEnabled: _isDevelopment);
        });

        return services;
    }
}
