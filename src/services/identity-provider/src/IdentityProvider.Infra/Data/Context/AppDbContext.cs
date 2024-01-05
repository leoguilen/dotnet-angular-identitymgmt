using IdentityProvider.Domain;
using IdentityProvider.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IdentityProvider.Infra.Data.Context;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Audit> AuditLogs { get; init; }

    public bool HasAuditLogEntries => ChangeTracker.Entries().Any(x => x.Entity is Audit);
}
