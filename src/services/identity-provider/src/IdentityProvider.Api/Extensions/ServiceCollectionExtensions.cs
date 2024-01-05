using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;

namespace IdentityProvider.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        return services
            .AddEndpointsApiExplorer()
            .AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Identity Provider API",
                    Version = "v1",
                    Description = "Identity Provider API for managing accounts and authentication.",
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme,
                            },
                        },
                        Array.Empty<string>()
                    },
                });
            });
    }

    public static IdentityBuilder AddIdentityApiEndpoints<TUser>(
        this IServiceCollection services,
        IConfiguration configuration)
        where TUser : class, new()
    {
        var section = configuration.GetRequiredSection("Identity");
        return services.AddIdentityApiEndpoints<TUser>(configure: section.Bind);
    }
}
