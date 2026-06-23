using SocPlatform.Api.Domain.Entities;

namespace SocPlatform.Api.Infrastructure;

/// <summary>
/// Carga inicial con el material REAL del proyecto (carpeta data/).
/// Solo siembra si la base está vacía. Las métricas de los modelos quedan en null
/// a propósito: se completan con los valores reales de los informes firmados.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Sources.Any()) return; // ya sembrado

        // --- Fuentes ---
        var inamhi = new Source
        {
            Name = "INAMHI",
            Type = "institucion",
            Description = "Instituto Nacional de Meteorología e Hidrología del Ecuador",
        };
        var gee = new Source
        {
            Name = "Google Earth Engine",
            Type = "repositorio",
            Description = "Plataforma de datos geoespaciales satelitales (Copernicus/ESA)",
            Url = "https://earthengine.google.com",
        };
        var geoBoundaries = new Source
        {
            Name = "geoBoundaries",
            Type = "repositorio",
            Description = "Límites administrativos abiertos",
            Url = "https://www.geoboundaries.org",
        };
        db.Sources.AddRange(inamhi, gee, geoBoundaries);

        // --- Variables ambientales ---
        var soc = new EnvironmentalVariable { Name = "Carbono orgánico (CO_g)", Unit = "g/kg", Description = "Carbono orgánico del suelo" };
        var da = new EnvironmentalVariable { Name = "Densidad aparente (Da)", Unit = "g/cm³" };
        var prof = new EnvironmentalVariable { Name = "Profundidad", Unit = "cm" };
        var ndvi = new EnvironmentalVariable { Name = "NDVI", Description = "Índice de vegetación (Sentinel-2)" };
        var precip = new EnvironmentalVariable { Name = "Precipitación", Unit = "mm" };
        var temp = new EnvironmentalVariable { Name = "Temperatura", Unit = "°C" };
        var topo = new EnvironmentalVariable { Name = "Topografía", Description = "Elevación / pendiente" };
        db.Variables.AddRange(soc, da, prof, ndvi, precip, temp, topo);

        // --- Datasets ---
        var dsSoc = new Dataset
        {
            Name = "Base de datos SOC Ecuador 2021",
            Type = "campo",
            Description = "Mediciones de carbono orgánico del suelo por perfil",
            TemporalStart = new DateOnly(2021, 1, 1),
            TemporalEnd = new DateOnly(2021, 12, 31),
            Format = "CSV/XLSX",
            RecordCount = 12861,
            LocationPointer = "data/soc/soc-ecuador-2021.csv",
            Source = inamhi,
            Variables = [soc, da, prof],
        };
        var dsSentinel = new Dataset
        {
            Name = "Sentinel-1/2/3 — Ecuador",
            Type = "satelital",
            Description = "Imágenes satelitales multimodales (radar, óptico, térmico)",
            Format = "GEE asset",
            LocationPointer = "Google Earth Engine — colecciones Sentinel",
            Source = gee,
            Variables = [ndvi],
        };
        var dsClima = new Dataset
        {
            Name = "Variables climáticas y topográficas",
            Type = "climatico",
            Description = "Precipitación, temperatura y topografía para el modelado",
            Format = "GEE asset",
            Source = gee,
            Variables = [precip, temp, topo],
        };
        var dsGeo = new Dataset
        {
            Name = "Límites Ecuador ADM1 (provincias)",
            Type = "topografico",
            Description = "Geometría provincial para visualización (Fase 2)",
            Format = "GeoJSON/Shapefile",
            RecordCount = 24,
            LocationPointer = "data/geo/ecuador-adm1/geoBoundaries-ECU-ADM1.geojson",
            Source = geoBoundaries,
        };
        db.Datasets.AddRange(dsSoc, dsSentinel, dsClima, dsGeo);

        // --- Modelos (notebooks en data/modelos/notebooks) ---
        const string nb = "data/modelos/notebooks";
        var trainData = new List<Dataset> { dsSoc, dsSentinel, dsClima };

        var mGraphSageInd = new Model { Name = "GraphSAGE inductivo", Architecture = "GraphSAGE", Scheme = "inductivo", Framework = "PyTorch Geometric", CodePointer = $"{nb}/Anexo 1. Código de Python de implementación de GraphSAGE Esquema Inductivo.ipynb", Datasets = trainData };
        var mGraphSageTrans = new Model { Name = "GraphSAGE transductivo", Architecture = "GraphSAGE", Scheme = "transductivo", Framework = "PyTorch Geometric", CodePointer = $"{nb}/Anexo 2. Código de Python de implementación de GraphSAGE Esquema Transductivo.ipynb", Datasets = trainData };
        var mGatv2Ind = new Model { Name = "GATv2 inductivo", Architecture = "GATv2", Scheme = "inductivo", Framework = "PyTorch Geometric", CodePointer = $"{nb}/Anexo 3. Código de Python de implementación GATv2 Esquema Inductivo.ipynb", Datasets = trainData };
        var mGatv2Trans = new Model { Name = "GATv2 transductivo", Architecture = "GATv2", Scheme = "transductivo", Framework = "PyTorch Geometric", CodePointer = $"{nb}/Anexo 4. Código de Python de implementación de GATv2 Esquema Transductivo.ipynb", Datasets = trainData };
        var mGat = new Model { Name = "GAT (final)", Architecture = "GAT", Framework = "PyTorch Geometric", CodePointer = $"{nb}/GAT_FINAL.ipynb", Datasets = trainData };
        db.Models.AddRange(mGraphSageInd, mGraphSageTrans, mGatv2Ind, mGatv2Trans, mGat);

        // --- Resultados (métricas reales se completan desde los informes) ---
        db.Results.AddRange(
            new Result { Model = mGraphSageInd, Description = "Desempeño GraphSAGE inductivo — completar R²/MAE/MAPE del informe" },
            new Result { Model = mGatv2Trans, Description = "Desempeño GATv2 transductivo — completar R²/MAE/MAPE del informe" }
        );

        // --- Documentos (informes firmados + oficios) ---
        const string inf = "data/documentos/informes";
        const string ofi = "data/documentos/oficios-inamhi";
        db.Documents.AddRange(
            new Document { Title = "Informe de Recopilación de Datos — PIS-24-09", Type = "informe", FilePath = $"{inf}/1. Informe de Recopilación de Datos - PIS-24-09-signed.pdf" },
            new Document { Title = "Informe de Preprocesamiento de Datos — PIS-24-09", Type = "informe", FilePath = $"{inf}/1. Informe de Preprocesamiento de Datos- PIS-24-09-signed.pdf" },
            new Document { Title = "Informe de Selección y Diseño de Arquitecturas (GNN) — PIS-24-09", Type = "informe", FilePath = $"{inf}/Informe de Selección y Diseño de Arquitecturas de Redes Neuronales (énfasis  en GNN) - PIS-24-09-signed.pdf" },
            new Document { Title = "Implementación en Python de la Arquitectura Óptima (SOC)", Type = "informe", FilePath = $"{inf}/Implementación en Python de la Arquitectura Óptima de Red Neuronal Profunda para la Estimación y Predicción del SOC-signed.pdf" },
            new Document { Title = "Análisis de Mediciones del SOC (INAMHI)", Type = "informe", FilePath = $"{inf}/1. Informe de Análisis de las Mediciones del SOC de Ecuador Proporcionado por el INAHMI-signed (1).pdf" },
            new Document { Title = "Respuesta oficio INAMHI-DEI-2025-0043-O (datos SOC)", Type = "oficio", FilePath = $"{ofi}/Respuesta oficio Nro. INAMHI-DEI-2025-0043-O - Solicitud de información sobre  Carbono Orgánico del Suelo (SOC).pdf" }
        );

        await db.SaveChangesAsync();
    }
}
