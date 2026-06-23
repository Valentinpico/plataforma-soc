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

        // Gestión de documentos (con carga de archivo multipart)
        g.MapPost("/documents", async (HttpRequest req, CatalogService s, IWebHostEnvironment env) =>
        {
            var (input, file) = ReadDocumentForm(await req.ReadFormAsync());
            var doc = await s.CreateDocumentAsync(input, file, env.ContentRootPath);
            return Results.Created($"/api/documents/{doc.Id}", doc);
        }).DisableAntiforgery();
        g.MapPut("/documents/{id:int}", async (int id, HttpRequest req, CatalogService s, IWebHostEnvironment env) =>
        {
            var (input, file) = ReadDocumentForm(await req.ReadFormAsync());
            return await s.UpdateDocumentAsync(id, input, file, env.ContentRootPath);
        }).DisableAntiforgery();
        g.MapDelete("/documents/{id:int}", async (int id, CatalogService s) =>
        {
            await s.DeleteDocumentAsync(id);
            return Results.NoContent();
        });
    }

    private static (DocumentInput, IFormFile?) ReadDocumentForm(IFormCollection form)
    {
        var input = new DocumentInput(
            form["title"].ToString(),
            NullIfEmpty(form["type"]),
            NullIfEmpty(form["authors"]),
            NullIfEmpty(form["description"]),
            NullIfEmpty(form["link"]));
        return (input, form.Files.GetFile("file"));
    }

    private static string? NullIfEmpty(string? s) => string.IsNullOrWhiteSpace(s) ? null : s;
}
