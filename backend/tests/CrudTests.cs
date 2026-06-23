using Microsoft.EntityFrameworkCore;
using Xunit;
using SocPlatform.Api.Application;
using SocPlatform.Api.Infrastructure;
using SocPlatform.Api.Shared;

namespace SocPlatform.Tests;

// TDD: CRUD de fuentes, variables y modelos.
public class CrudTests
{
    private static AppDbContext NewDb() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    private static CatalogService NewSvc(AppDbContext db) => new(db, new FakeGraphService());

    // --- Source ---
    [Fact]
    public async Task CreateSource_sin_nombre_lanza_ValidationError()
    {
        var s = NewSvc(NewDb());
        await Assert.ThrowsAsync<ValidationError>(() => s.CreateSourceAsync(new SourceInput("", null, null, null)));
    }

    [Fact]
    public async Task CreateSource_valido_persiste()
    {
        var s = NewSvc(NewDb());
        var r = await s.CreateSourceAsync(new SourceInput("INAMHI", "institucion", null, null));
        Assert.True(r.Id > 0);
    }

    [Fact]
    public async Task UpdateSource_inexistente_lanza_NotFoundError()
    {
        var s = NewSvc(NewDb());
        await Assert.ThrowsAsync<NotFoundError>(() => s.UpdateSourceAsync(99, new SourceInput("X", null, null, null)));
    }

    [Fact]
    public async Task DeleteSource_inexistente_lanza_NotFoundError()
    {
        var s = NewSvc(NewDb());
        await Assert.ThrowsAsync<NotFoundError>(() => s.DeleteSourceAsync(99));
    }

    // --- Variable ---
    [Fact]
    public async Task CreateVariable_sin_nombre_lanza_ValidationError()
    {
        var s = NewSvc(NewDb());
        await Assert.ThrowsAsync<ValidationError>(() => s.CreateVariableAsync(new VariableInput("", null, null)));
    }

    [Fact]
    public async Task CreateVariable_valido_persiste()
    {
        var s = NewSvc(NewDb());
        var r = await s.CreateVariableAsync(new VariableInput("NDVI", null, "Índice de vegetación"));
        Assert.True(r.Id > 0);
    }

    [Fact]
    public async Task DeleteVariable_inexistente_lanza_NotFoundError()
    {
        var s = NewSvc(NewDb());
        await Assert.ThrowsAsync<NotFoundError>(() => s.DeleteVariableAsync(99));
    }

    // --- Model ---
    [Fact]
    public async Task CreateModel_sin_nombre_lanza_ValidationError()
    {
        var s = NewSvc(NewDb());
        await Assert.ThrowsAsync<ValidationError>(() => s.CreateModelAsync(new ModelInput("", null, null, null, null, null)));
    }

    [Fact]
    public async Task CreateModel_valido_persiste()
    {
        var s = NewSvc(NewDb());
        var r = await s.CreateModelAsync(new ModelInput("GATv2", "GATv2", "transductivo", "PyTorch Geometric", null, null));
        Assert.True(r.Id > 0);
        Assert.Equal("transductivo", r.Scheme);
    }

    [Fact]
    public async Task UpdateModel_inexistente_lanza_NotFoundError()
    {
        var s = NewSvc(NewDb());
        await Assert.ThrowsAsync<NotFoundError>(() => s.UpdateModelAsync(99, new ModelInput("X", null, null, null, null, null)));
    }

    [Fact]
    public async Task DeleteModel_inexistente_lanza_NotFoundError()
    {
        var s = NewSvc(NewDb());
        await Assert.ThrowsAsync<NotFoundError>(() => s.DeleteModelAsync(99));
    }
}
