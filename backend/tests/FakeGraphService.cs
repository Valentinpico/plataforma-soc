using SocPlatform.Api.Infrastructure;

namespace SocPlatform.Tests;

/// <summary>Doble de prueba: no toca Neo4j.</summary>
public class FakeGraphService : IGraphService
{
    public int RebuildCalls { get; private set; }

    public Task RebuildAsync()
    {
        RebuildCalls++;
        return Task.CompletedTask;
    }

    public Task<GraphDto> GetGraphAsync() =>
        Task.FromResult(new GraphDto([], []));
}
