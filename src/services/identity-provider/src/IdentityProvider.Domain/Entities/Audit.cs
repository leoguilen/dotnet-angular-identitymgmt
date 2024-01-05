namespace IdentityProvider.Domain;

public class Audit
{
    public int Id { get; init; }

    public required string Type { get; init; }

    public required string TableName { get; init; }

    public required DateTime DateTime { get; init; }

    public required string OldValues { get; init; }

    public required string NewValues { get; init; }

    public required string AffectedColumns { get; init; }

    public required string PrimaryKey { get; init; }

    public string? RequestInfo { get; init; }
}
