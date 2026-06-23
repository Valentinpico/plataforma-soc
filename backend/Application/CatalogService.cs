using Microsoft.EntityFrameworkCore;
using SocPlatform.Api.Domain.Entities;
using SocPlatform.Api.Infrastructure;
using SocPlatform.Api.Shared;

namespace SocPlatform.Api.Application;

/// <summary>Datos de entrada para crear/editar un Dataset (no exponemos la entidad directo).</summary>
public record DatasetInput(
    string Name,
    string? Type,
    string? Description,
    string? Format,
    string? LocationPointer,
    int? RecordCount,
    int? SourceId);

/// <summary>Datos de entrada para crear/editar un Documento.</summary>
public record DocumentInput(
    string Title,
    string? Type,
    string? Authors,
    string? Description,
    string? Link);

/// <summary>Catálogo del repositorio: lecturas + gestión. La lógica vive acá, no en los endpoints.</summary>
public class CatalogService(AppDbContext db, IGraphService graph)
{
    // --- Lecturas ---
    public Task<List<Source>> GetSourcesAsync() =>
        db.Sources.AsNoTracking().ToListAsync();

    public Task<List<Dataset>> GetDatasetsAsync() =>
        db.Datasets.AsNoTracking()
            .Include(d => d.Source)
            .Include(d => d.Variables)
            .ToListAsync();

    public async Task<Dataset> GetDatasetAsync(int id) =>
        await db.Datasets.AsNoTracking()
            .Include(d => d.Source)
            .Include(d => d.Variables)
            .FirstOrDefaultAsync(d => d.Id == id)
        ?? throw new NotFoundError($"Dataset {id} no existe.");

    public Task<List<Model>> GetModelsAsync() =>
        db.Models.AsNoTracking()
            .Include(m => m.Results)
            .Include(m => m.Datasets)
            .ToListAsync();

    public Task<List<EnvironmentalVariable>> GetVariablesAsync() =>
        db.Variables.AsNoTracking().ToListAsync();

    public Task<List<Document>> GetDocumentsAsync() =>
        db.Documents.AsNoTracking().ToListAsync();

    public Task<List<Result>> GetResultsAsync() =>
        db.Results.AsNoTracking().Include(r => r.Model).ToListAsync();

    // --- Gestión (Dataset) ---
    public async Task<Dataset> CreateDatasetAsync(DatasetInput input)
    {
        await ValidateAsync(input);
        var ds = new Dataset { Name = input.Name };
        Apply(ds, input);
        db.Datasets.Add(ds);
        await db.SaveChangesAsync();
        await graph.RebuildAsync();
        return ds;
    }

    public async Task<Dataset> UpdateDatasetAsync(int id, DatasetInput input)
    {
        var ds = await db.Datasets.FindAsync(id)
            ?? throw new NotFoundError($"Dataset {id} no existe.");
        await ValidateAsync(input);
        Apply(ds, input);
        await db.SaveChangesAsync();
        await graph.RebuildAsync();
        return ds;
    }

    public async Task DeleteDatasetAsync(int id)
    {
        var ds = await db.Datasets.FindAsync(id)
            ?? throw new NotFoundError($"Dataset {id} no existe.");
        db.Datasets.Remove(ds);
        await db.SaveChangesAsync();
        await graph.RebuildAsync();
    }

    // --- Gestión (Documento) ---
    public async Task<Document> CreateDocumentAsync(DocumentInput input, IFormFile? file, string contentRoot)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
            throw new ValidationError("El título del documento es obligatorio.");

        var doc = new Document { Title = input.Title };
        await ApplyDocAsync(doc, input, file, contentRoot);
        db.Documents.Add(doc);
        await db.SaveChangesAsync();
        await graph.RebuildAsync();
        return doc;
    }

    public async Task<Document> UpdateDocumentAsync(int id, DocumentInput input, IFormFile? file, string contentRoot)
    {
        var doc = await db.Documents.FindAsync(id)
            ?? throw new NotFoundError($"Documento {id} no existe.");
        if (string.IsNullOrWhiteSpace(input.Title))
            throw new ValidationError("El título del documento es obligatorio.");
        await ApplyDocAsync(doc, input, file, contentRoot);
        await db.SaveChangesAsync();
        await graph.RebuildAsync();
        return doc;
    }

    public async Task DeleteDocumentAsync(int id)
    {
        var doc = await db.Documents.FindAsync(id)
            ?? throw new NotFoundError($"Documento {id} no existe.");
        db.Documents.Remove(doc);
        await db.SaveChangesAsync();
        await graph.RebuildAsync();
    }

    private static async Task ApplyDocAsync(Document doc, DocumentInput input, IFormFile? file, string contentRoot)
    {
        doc.Title = input.Title;
        doc.Type = input.Type;
        doc.Authors = input.Authors;
        doc.Description = input.Description;

        if (file is { Length: > 0 })
        {
            var dir = Path.Combine(contentRoot, "data", "documentos", "uploads");
            Directory.CreateDirectory(dir);
            var safe = Path.GetFileName(file.FileName); // evita traversal
            await using var fs = File.Create(Path.Combine(dir, safe));
            await file.CopyToAsync(fs);
            doc.FilePath = $"data/documentos/uploads/{safe}";
        }
        else if (!string.IsNullOrWhiteSpace(input.Link))
        {
            doc.FilePath = input.Link;
        }
    }

    private async Task ValidateAsync(DatasetInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Name))
            throw new ValidationError("El nombre del dataset es obligatorio.");

        if (input.SourceId is int sid && !await db.Sources.AnyAsync(s => s.Id == sid))
            throw new ValidationError($"La fuente {sid} no existe.");
    }

    private static void Apply(Dataset ds, DatasetInput input)
    {
        ds.Name = input.Name;
        ds.Type = input.Type;
        ds.Description = input.Description;
        ds.Format = input.Format;
        ds.LocationPointer = input.LocationPointer;
        ds.RecordCount = input.RecordCount;
        ds.SourceId = input.SourceId;
    }
}
