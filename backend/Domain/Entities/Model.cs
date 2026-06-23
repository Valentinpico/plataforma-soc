namespace SocPlatform.Api.Domain.Entities;

/// <summary>Modelo de ML/GNN del proyecto (GraphSAGE, GAT, GATv2).</summary>
public class Model
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Architecture { get; set; }   // GraphSAGE | GAT | GATv2
    public string? Scheme { get; set; }          // inductivo | transductivo
    public string? Framework { get; set; }       // PyTorch Geometric, etc.
    public string? CodePointer { get; set; }     // ruta al notebook
    public string? Description { get; set; }

    public List<Dataset> Datasets { get; set; } = [];
    public List<Result> Results { get; set; } = [];
}
