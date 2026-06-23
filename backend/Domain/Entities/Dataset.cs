namespace SocPlatform.Api.Domain.Entities;

/// <summary>Conjunto de datos catalogado. Guarda metadata + puntero, no los bytes.</summary>
public class Dataset
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Type { get; set; }            // satelital | climatico | topografico | campo
    public string? Description { get; set; }
    public DateOnly? TemporalStart { get; set; }
    public DateOnly? TemporalEnd { get; set; }
    public string? LocationPointer { get; set; }  // GEE asset id, URL o ruta
    public string? Format { get; set; }
    public int? RecordCount { get; set; }

    public int? SourceId { get; set; }
    public Source? Source { get; set; }

    public List<EnvironmentalVariable> Variables { get; set; } = [];
    public List<Model> Models { get; set; } = [];   // modelos entrenados con este dataset
}
