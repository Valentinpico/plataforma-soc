using Microsoft.EntityFrameworkCore;
using Neo4j.Driver;

namespace SocPlatform.Api.Infrastructure;

public record GraphNode(string Id, string Label, string Caption);
public record GraphEdge(string Source, string Target, string Type);
public record GraphDto(List<GraphNode> Nodes, List<GraphEdge> Edges);

public interface IGraphService
{
    /// <summary>Reconstruye el grafo Neo4j proyectando lo que hay en Postgres.</summary>
    Task RebuildAsync();
    /// <summary>Devuelve el grafo (nodos + aristas) para visualizar en el frontend.</summary>
    Task<GraphDto> GetGraphAsync();
}

public class Neo4jGraphService(IDriver driver, IServiceScopeFactory scopeFactory) : IGraphService
{
    public async Task RebuildAsync()
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var sources = await db.Sources.AsNoTracking().ToListAsync();
        var vars = await db.Variables.AsNoTracking().ToListAsync();
        var datasets = await db.Datasets.AsNoTracking()
            .Include(d => d.Variables).ToListAsync();
        var models = await db.Models.AsNoTracking()
            .Include(m => m.Datasets).Include(m => m.Results).ToListAsync();
        var docs = await db.Documents.AsNoTracking()
            .Include(d => d.Models).Include(d => d.Datasets).ToListAsync();

        await using var session = driver.AsyncSession();
        await session.ExecuteWriteAsync(async tx =>
        {
            await tx.RunAsync("MATCH (n) DETACH DELETE n");

            foreach (var s in sources)
                await tx.RunAsync("CREATE (:Fuente {id:$id, name:$name, type:$type})",
                    new { id = s.Id, name = s.Name, type = s.Type ?? "" });
            foreach (var v in vars)
                await tx.RunAsync("CREATE (:VariableAmbiental {id:$id, name:$name})",
                    new { id = v.Id, name = v.Name });
            foreach (var d in datasets)
                await tx.RunAsync("CREATE (:Dataset {id:$id, name:$name, type:$type})",
                    new { id = d.Id, name = d.Name, type = d.Type ?? "" });
            foreach (var m in models)
                await tx.RunAsync("CREATE (:Modelo {id:$id, name:$name, arch:$arch})",
                    new { id = m.Id, name = m.Name, arch = m.Architecture ?? "" });
            foreach (var r in models.SelectMany(m => m.Results))
                await tx.RunAsync("CREATE (:Resultado {id:$id, name:$name})",
                    new { id = r.Id, name = r.Description ?? $"Resultado {r.Id}" });
            foreach (var doc in docs)
                await tx.RunAsync("CREATE (:Documento {id:$id, name:$name, type:$type})",
                    new { id = doc.Id, name = doc.Title, type = doc.Type ?? "" });

            foreach (var d in datasets)
            {
                if (d.SourceId is int sid)
                    await tx.RunAsync(
                        "MATCH (a:Dataset {id:$d}),(b:Fuente {id:$s}) CREATE (a)-[:PROVIENE_DE]->(b)",
                        new { d = d.Id, s = sid });
                foreach (var v in d.Variables)
                    await tx.RunAsync(
                        "MATCH (a:Dataset {id:$d}),(b:VariableAmbiental {id:$v}) CREATE (a)-[:CONTIENE]->(b)",
                        new { d = d.Id, v = v.Id });
            }
            foreach (var m in models)
            {
                foreach (var d in m.Datasets)
                    await tx.RunAsync(
                        "MATCH (a:Modelo {id:$m}),(b:Dataset {id:$d}) CREATE (a)-[:ENTRENADO_CON]->(b)",
                        new { m = m.Id, d = d.Id });
                foreach (var r in m.Results)
                    await tx.RunAsync(
                        "MATCH (a:Modelo {id:$m}),(b:Resultado {id:$r}) CREATE (a)-[:PRODUCE]->(b)",
                        new { m = m.Id, r = r.Id });
            }
            foreach (var doc in docs)
            {
                foreach (var m in doc.Models)
                    await tx.RunAsync(
                        "MATCH (a:Documento {id:$d}),(b:Modelo {id:$m}) CREATE (a)-[:DOCUMENTA]->(b)",
                        new { d = doc.Id, m = m.Id });
                foreach (var ds in doc.Datasets)
                    await tx.RunAsync(
                        "MATCH (a:Documento {id:$d}),(b:Dataset {id:$ds}) CREATE (a)-[:DOCUMENTA]->(b)",
                        new { d = doc.Id, ds = ds.Id });
            }
        });
    }

    public async Task<GraphDto> GetGraphAsync()
    {
        await using var session = driver.AsyncSession();

        var nodeCursor = await session.RunAsync(
            "MATCH (n) RETURN elementId(n) AS id, labels(n)[0] AS label, " +
            "coalesce(n.name, n.title, '') AS caption");
        var nodeRecords = await nodeCursor.ToListAsync();
        var nodes = nodeRecords.Select(r => new GraphNode(
            r["id"].As<string>(), r["label"].As<string>(), r["caption"].As<string>())).ToList();

        var edgeCursor = await session.RunAsync(
            "MATCH (a)-[r]->(b) RETURN elementId(a) AS s, elementId(b) AS t, type(r) AS type");
        var edgeRecords = await edgeCursor.ToListAsync();
        var edges = edgeRecords.Select(r => new GraphEdge(
            r["s"].As<string>(), r["t"].As<string>(), r["type"].As<string>())).ToList();

        return new GraphDto(nodes, edges);
    }
}
