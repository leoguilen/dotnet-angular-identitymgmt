using System.Text.Json;

namespace IdentityProvider.Domain;

public record AuditEntry
{
    public string? TableName { get; set; }

    public string? AuditType { get; set; }

    public Dictionary<string, object> KeyValues { get; } = [];

    public Dictionary<string, object> OldValues { get; } = [];

    public Dictionary<string, object> NewValues { get; } = [];

    public List<string> ChangedColumns { get; } = [];

    public Dictionary<string, object?> RequestInfo { get; set; } = [];

    public Audit ToAudit() => new()
    {
        Type = AuditType!,
        TableName = TableName!,
        DateTime = DateTime.Now,
        PrimaryKey = JsonSerializer.Serialize(KeyValues),
        OldValues = OldValues.Count == 0 ? string.Empty : JsonSerializer.Serialize(OldValues),
        NewValues = NewValues.Count == 0 ? string.Empty : JsonSerializer.Serialize(NewValues),
        AffectedColumns = ChangedColumns.Count == 0 ? string.Empty : JsonSerializer.Serialize(ChangedColumns),
        RequestInfo = RequestInfo.Count == 0 ? string.Empty : JsonSerializer.Serialize(RequestInfo),
    };
}
