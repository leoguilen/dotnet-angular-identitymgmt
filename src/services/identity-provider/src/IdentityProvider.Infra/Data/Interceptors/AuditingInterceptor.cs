using IdentityProvider.Domain;
using IdentityProvider.Infra.Data.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;

namespace IdentityProvider.Infra.Data.Interceptors;

internal sealed class AuditingInterceptor(
    IHttpContextAccessor httpContextAccessor,
    ILogger<AuditingInterceptor> logger)
    : ISaveChangesInterceptor
{
    public async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is AppDbContext dbContext && !dbContext.HasAuditLogEntries)
        {
            var auditLogs = CreateAuditLogs(eventData.Context!);
            await dbContext.AuditLogs.AddRangeAsync(auditLogs, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return result;
    }

    private IEnumerable<Audit> CreateAuditLogs(DbContext context)
    {
        context.ChangeTracker.DetectChanges();

        var entries = context.ChangeTracker.Entries().ToList();
        foreach (var entry in entries)
        {
            var auditEntry = new AuditEntry()
            {
                TableName = entry.Metadata.GetTableName(),
                RequestInfo = new Dictionary<string, object?>
                {
                    ["User"] = httpContextAccessor.HttpContext?.User?.Identity?.Name,
                    ["RemoteIpAddress"] = httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString(),
                    ["LocalIpAddress"] = httpContextAccessor.HttpContext?.Connection?.LocalIpAddress?.ToString(),
                    ["UserAgent"] = httpContextAccessor.HttpContext?.Request?.Headers.UserAgent.ToString(),
                    ["RequestId"] = httpContextAccessor.HttpContext?.TraceIdentifier,
                    ["RequestPath"] = httpContextAccessor.HttpContext?.Request?.Path.Value,
                    ["RequestMethod"] = httpContextAccessor.HttpContext?.Request?.Method,
                    ["RequestQueryString"] = httpContextAccessor.HttpContext?.Request?.QueryString.Value,
                },
            };

            foreach (var property in entry.Properties)
            {
                var propertyName = property.Metadata.Name;
                if (property.Metadata.IsPrimaryKey())
                {
                    auditEntry.KeyValues[propertyName] = property.CurrentValue!;
                    continue;
                }

                switch (entry.State)
                {
                    case EntityState.Added:
                        auditEntry.AuditType = "Create";
                        auditEntry.NewValues[property.Metadata.Name] = property.CurrentValue!;
                        break;

                    case EntityState.Deleted:
                        auditEntry.AuditType = "Delete";
                        auditEntry.OldValues[property.Metadata.Name] = property.OriginalValue!;
                        break;

                    case EntityState.Modified:
                        if (property.IsModified && property.CurrentValue?.ToString() != property.OriginalValue?.ToString())
                        {
                            auditEntry.ChangedColumns.Add(propertyName);
                            auditEntry.AuditType = "Update";
                            auditEntry.OldValues[property.Metadata.Name] = property.OriginalValue!;
                            auditEntry.NewValues[property.Metadata.Name] = property.CurrentValue!;
                        }
                        break;
                }
            }

            if (logger.IsEnabled(LogLevel.Debug))
            {
                logger.LogDebug("Audit entry: {AuditEntry}", auditEntry);
            }

            yield return auditEntry!.ToAudit();
        }
    }
}
