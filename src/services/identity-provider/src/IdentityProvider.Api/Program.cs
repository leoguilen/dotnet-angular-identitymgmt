using IdentityProvider.Api.Extensions;
using IdentityProvider.Api.Handlers;
using IdentityProvider.Domain.Entities;
using IdentityProvider.Infra.Data.Context;
using IdentityProvider.Infra.Extensions;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.FeatureManagement;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwagger();
}

builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options =>
{
    var corsPolicy = builder.Configuration
        .GetRequiredSection(nameof(CorsPolicy))
        .Get<CorsPolicy>();

    options.AddDefaultPolicy(corsPolicy!);
});
builder.Services.AddHealthChecks();
builder.Services.AddFeatureManagement(builder.Configuration);

builder.Services.AddInfra(builder.Configuration);
builder.Services
    .AddIdentityApiEndpoints<User>(builder.Configuration)
    .AddEntityFrameworkStores<AppDbContext>()
    .AddApiEndpoints()
    .AddDefaultTokenProviders();

var app = builder.Build();

app.UseWhen(
    predicate: _ => app.Environment.IsDevelopment(),
    configuration: appBuilder =>
    {
        appBuilder.UseSwagger();
        appBuilder.UseSwaggerUI();
    });

app.UseExceptionHandler();
app.UseCors();
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapHealthChecks("/health");

var accountApiGroup = app
    .MapGroup("/api/accounts")
    .RequireCors()
    .WithTags("Accounts");
accountApiGroup.MapIdentityApi();

await using var scope = app.Services.CreateAsyncScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
await db.Database.MigrateAsync().ConfigureAwait(false);

await app.RunAsync().ConfigureAwait(false);

public partial class Program;