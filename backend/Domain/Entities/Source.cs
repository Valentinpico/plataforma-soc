namespace SocPlatform.Api.Domain.Entities;

/// <summary>Origen de datos o documentos (INAMHI, GEE, Copernicus, etc.).</summary>
public class Source
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Type { get; set; }        // institucion | satelite | repositorio
    public string? Description { get; set; }
    public string? Url { get; set; }

    public List<Dataset> Datasets { get; set; } = [];
}
