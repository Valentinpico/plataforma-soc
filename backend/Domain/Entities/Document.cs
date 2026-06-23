namespace SocPlatform.Api.Domain.Entities;

/// <summary>Documento del proyecto (informe, paper, oficio, metodología).</summary>
public class Document
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Type { get; set; }   // informe | paper | oficio | metodologia
    public string? Description { get; set; }
    public string? FilePath { get; set; }
    public string? Authors { get; set; }
    public DateOnly? PublishedOn { get; set; }
}
