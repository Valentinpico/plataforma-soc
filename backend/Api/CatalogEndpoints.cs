using SocPlatform.Api.Application;
using SocPlatform.Api.Infrastructure;

namespace SocPlatform.Api.Api;

public static class CatalogEndpoints
{
    public static void MapCatalog(this WebApplication app)
    {
        var g = app.MapGroup("/api");

        // Lecturas
        g.MapGet("/sources", (CatalogService s) => s.GetSourcesAsync());
        g.MapGet("/datasets", (CatalogService s) => s.GetDatasetsAsync());
        g.MapGet("/datasets/{id:int}", (int id, CatalogService s) => s.GetDatasetAsync(id));
        g.MapGet("/models", (CatalogService s) => s.GetModelsAsync());
        g.MapGet("/variables", (CatalogService s) => s.GetVariablesAsync());
        g.MapGet("/documents", (CatalogService s) => s.GetDocumentsAsync());
        g.MapGet("/results", (CatalogService s) => s.GetResultsAsync());
        g.MapGet("/graph", (IGraphService gs) => gs.GetGraphAsync());

        // Gestión de datasets
        g.MapPost("/datasets", async (DatasetInput input, CatalogService s) =>
        {
            var ds = await s.CreateDatasetAsync(input);
            return Results.Created($"/api/datasets/{ds.Id}", ds);
        });
        g.MapPut("/datasets/{id:int}", (int id, DatasetInput input, CatalogService s) =>
            s.UpdateDatasetAsync(id, input));
        g.MapDelete("/datasets/{id:int}", async (int id, CatalogService s) =>
        {
            await s.DeleteDatasetAsync(id);
            return Results.NoContent();
        });
    }
}
