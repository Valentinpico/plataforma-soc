using Microsoft.EntityFrameworkCore;
using Xunit;
using SocPlatform.Api.Application;
using SocPlatform.Api.Domain.Entities;
using SocPlatform.Api.Infrastructure;
using SocPlatform.Api.Shared;

namespace SocPlatform.Tests;

public class CatalogServiceTests
{
    private static AppDbContext NewDb() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    private static CatalogService NewService(AppDbContext db) => new(db, new FakeGraphService());

    private static DatasetInput Dataset(string name, int? sourceId = null) =>
        new(name, "campo", null, null, null, null, sourceId);

    // --- Dataset: validación ---

    [Fact]
    public async Task CreateDataset_sin_nombre_lanza_ValidationError()
    {
        var svc = NewService(NewDb());
        await Assert.ThrowsAsync<ValidationError>(() => svc.CreateDatasetAsync(Dataset("")));
    }

    [Fact]
    public async Task CreateDataset_con_fuente_inexistente_lanza_ValidationError()
    {
        var svc = NewService(NewDb());
        await Assert.ThrowsAsync<ValidationError>(() => svc.CreateDatasetAsync(Dataset("X", sourceId: 999)));
    }

    [Fact]
    public async Task CreateDataset_valido_persiste_y_reconstruye_grafo()
    {
        var db = NewDb();
        var graph = new FakeGraphService();
        var svc = new CatalogService(db, graph);

        var ds = await svc.CreateDatasetAsync(Dataset("Mi dataset"));

        Assert.True(ds.Id > 0);
        Assert.Single(await svc.GetDatasetsAsync());
        Assert.Equal(1, graph.RebuildCalls);
    }

    [Fact]
    public async Task UpdateDataset_inexistente_lanza_NotFoundError()
    {
        var svc = NewService(NewDb());
        await Assert.ThrowsAsync<NotFoundError>(() => svc.UpdateDatasetAsync(123, Dataset("X")));
    }

    [Fact]
    public async Task DeleteDataset_inexistente_lanza_NotFoundError()
    {
        var svc = NewService(NewDb());
        await Assert.ThrowsAsync<NotFoundError>(() => svc.DeleteDatasetAsync(123));
    }

    [Fact]
    public async Task CreateDataset_con_fuente_existente_funciona()
    {
        var db = NewDb();
        db.Sources.Add(new Source { Id = 1, Name = "INAMHI" });
        await db.SaveChangesAsync();
        var svc = NewService(db);

        var ds = await svc.CreateDatasetAsync(Dataset("Con fuente", sourceId: 1));

        Assert.Equal(1, ds.SourceId);
    }

    // --- Documento ---

    [Fact]
    public async Task CreateDocument_sin_titulo_lanza_ValidationError()
    {
        var svc = NewService(NewDb());
        var input = new DocumentInput("", "paper", null, null, null);
        await Assert.ThrowsAsync<ValidationError>(() => svc.CreateDocumentAsync(input, null, "/tmp"));
    }

    [Fact]
    public async Task CreateDocument_con_link_usa_link_como_filepath()
    {
        var svc = NewService(NewDb());
        var input = new DocumentInput("Paper", "paper", "Autor", null, "https://doi.org/x");

        var doc = await svc.CreateDocumentAsync(input, null, "/tmp");

        Assert.Equal("https://doi.org/x", doc.FilePath);
    }

    [Fact]
    public async Task DeleteDocument_inexistente_lanza_NotFoundError()
    {
        var svc = NewService(NewDb());
        await Assert.ThrowsAsync<NotFoundError>(() => svc.DeleteDocumentAsync(123));
    }
}
