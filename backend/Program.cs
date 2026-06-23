using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Neo4j.Driver;
using SocPlatform.Api.Api;
using SocPlatform.Api.Application;
using SocPlatform.Api.Infrastructure;
using SocPlatform.Api.Shared;

var builder = WebApplication.CreateBuilder(args);
var cfg = builder.Configuration;

// CORS para el frontend de desarrollo (Vite en :5173)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Evita ciclos al serializar entidades con navegación (Dataset <-> Source, etc.)
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(cfg.GetConnectionString("Postgres")));

builder.Services.AddSingleton<IDriver>(_ =>
    GraphDatabase.Driver(cfg["Neo4j:Uri"],
        AuthTokens.Basic(cfg["Neo4j:User"], cfg["Neo4j:Password"])));

builder.Services.AddScoped<CatalogService>();
builder.Services.AddScoped<IGraphService, Neo4jGraphService>();

builder.Services.AddExceptionHandler<AppExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();

// ponytail: EnsureCreated crea las tablas del modelo al arrancar (dev).
// Ceiling: sin historial de migraciones. Upgrade a EF Migrations
// (dotnet ef migrations add) antes de la entrega final si se quiere
// trazabilidad de esquema.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    await DataSeeder.SeedAsync(db);

    var graph = scope.ServiceProvider.GetRequiredService<IGraphService>();
    await graph.RebuildAsync();
}

app.UseCors();

app.MapGet("/", () => "SOC Platform API — PIS-24-09");
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapCatalog();

app.Run();
