namespace SocPlatform.Api.Domain.Entities;

/// <summary>Resultado de evaluación de un modelo (métricas de desempeño en prueba).</summary>
public class Result
{
    public int Id { get; set; }

    public int ModelId { get; set; }
    public Model? Model { get; set; }

    public string? Scope { get; set; }   // Ecuador | Sierra | Costa
    public double? Rmse { get; set; }
    public double? R2 { get; set; }
    public double? Mae { get; set; }
    public double? Mape { get; set; }
    public string? Description { get; set; }
}
