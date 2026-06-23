using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
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

// Sirve los documentos locales (data/documentos/...) en /files/documentos/...
var dataDir = Path.Combine(app.Environment.ContentRootPath, "data");
if (Directory.Exists(dataDir))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(dataDir),
        RequestPath = "/files",
    });
}

// Gate de administración: toda mutación (POST/PUT/DELETE) bajo /api requiere la
// contraseña de admin en el header X-Admin-Password. Lectura queda libre.
var adminPassword = cfg["Admin:Password"] ?? "soc-admin-2026";
app.Use(async (ctx, next) =>
{
    var method = ctx.Request.Method;
    var isMutation = method is "POST" or "PUT" or "DELETE" or "PATCH";
    var path = ctx.Request.Path.Value ?? "";
    var isGuarded = isMutation && path.StartsWith("/api") && path != "/api/admin/verify";

    if (isGuarded && ctx.Request.Headers["X-Admin-Password"] != adminPassword)
    {
        ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await ctx.Response.WriteAsJsonAsync(new { error = "Se requiere contraseña de administrador." });
        return;
    }
    await next();
});

app.MapGet("/", () => "SOC Platform API — PIS-24-09");
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapPost("/api/admin/verify", (AdminLogin body) =>
    body.Password == adminPassword ? Results.Ok(new { ok = true }) : Results.Unauthorized());
app.MapCatalog();

app.Run();

record AdminLogin(string Password);
