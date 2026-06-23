namespace SocPlatform.Api.Domain.Entities;

/// <summary>Variable ambiental usada en los datasets (precipitación, NDVI, temperatura...).</summary>
public class EnvironmentalVariable
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Unit { get; set; }
    public string? Description { get; set; }

    public List<Dataset> Datasets { get; set; } = [];
}
