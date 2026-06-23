using Microsoft.EntityFrameworkCore;
using SocPlatform.Api.Domain.Entities;

namespace SocPlatform.Api.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Source> Sources => Set<Source>();
    public DbSet<Dataset> Datasets => Set<Dataset>();
    public DbSet<EnvironmentalVariable> Variables => Set<EnvironmentalVariable>();
    public DbSet<Model> Models => Set<Model>();
    public DbSet<Result> Results => Set<Result>();
    public DbSet<Document> Documents => Set<Document>();

    // Relaciones N..N (Dataset-Variable, Dataset-Model) las infiere EF Core.
}
