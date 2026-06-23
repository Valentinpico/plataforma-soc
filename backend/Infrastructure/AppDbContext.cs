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

    protected override void OnModelCreating(ModelBuilder b)
    {
        // Document.Models / Document.Datasets son navegaciones sin inverso:
        // forzar many-to-many (join table) en vez del uno-a-muchos que EF infiere.
        b.Entity<Document>().HasMany(d => d.Models).WithMany();
        b.Entity<Document>().HasMany(d => d.Datasets).WithMany();
    }
}
