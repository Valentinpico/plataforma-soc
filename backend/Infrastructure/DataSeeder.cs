using SocPlatform.Api.Domain.Entities;

namespace SocPlatform.Api.Infrastructure;

/// <summary>
/// Carga inicial con el material REAL del proyecto (carpeta data/).
/// Solo siembra si la base está vacía.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Sources.Any()) return; // ya sembrado

        // --- Fuentes ---
        var inamhi = new Source { Name = "INAMHI", Type = "institucion", Description = "Instituto Nacional de Meteorología e Hidrología del Ecuador" };
        var magap = new Source { Name = "MAGAP", Type = "institucion", Description = "Ministerio de Agricultura y Ganadería del Ecuador" };
        var gee = new Source { Name = "Google Earth Engine", Type = "repositorio", Description = "Acceso a datos satelitales (Copernicus/ESA, CHIRPS, ERA5)", Url = "https://earthengine.google.com" };
        var geoBoundaries = new Source { Name = "geoBoundaries", Type = "repositorio", Description = "Límites administrativos abiertos", Url = "https://www.geoboundaries.org" };
        db.Sources.AddRange(inamhi, magap, gee, geoBoundaries);

        // --- Variables ambientales ---
        var soc = new EnvironmentalVariable { Name = "Carbono orgánico (CO_g)", Unit = "g/kg", Description = "SOC, muestras 0–30 cm" };
        var da = new EnvironmentalVariable { Name = "Densidad aparente (Da)", Unit = "g/cm³" };
        var backscatter = new EnvironmentalVariable { Name = "Backscatter (Sentinel-1)", Description = "Proxy de humedad y rugosidad del suelo" };
        var ndvi = new EnvironmentalVariable { Name = "NDVI", Description = "Índice de vegetación (Sentinel-2)" };
        var savi = new EnvironmentalVariable { Name = "SAVI", Description = "Índice de vegetación ajustado al suelo (Sentinel-2)" };
        var bsi = new EnvironmentalVariable { Name = "BSI", Description = "Índice de suelo desnudo / exposición mineral (Sentinel-2)" };
        var precip = new EnvironmentalVariable { Name = "Precipitación media", Unit = "mm", Description = "CHIRPS, 2021" };
        var temp = new EnvironmentalVariable { Name = "Temperatura media", Unit = "°C", Description = "ERA5, 2021" };
        var elev = new EnvironmentalVariable { Name = "Elevación", Unit = "m", Description = "Copernicus DEM" };
        var slope = new EnvironmentalVariable { Name = "Pendiente", Unit = "°", Description = "Derivada del DEM (vector morfológico)" };
        db.Variables.AddRange(soc, da, backscatter, ndvi, savi, bsi, precip, temp, elev, slope);

        // --- Datasets ---
        var dsSoc = new Dataset
        {
            Name = "Mediciones SOC — MAGAP/INAMHI (0–30 cm)",
            Type = "campo",
            Description = "Mediciones de carbono orgánico del suelo por perfil; análisis enfocado en 0–30 cm",
            TemporalStart = new DateOnly(2021, 1, 1),
            TemporalEnd = new DateOnly(2021, 12, 31),
            Format = "CSV/XLSX",
            RecordCount = 12861,
            LocationPointer = "data/soc/soc-ecuador-2021.csv",
            Source = inamhi,
            Variables = [soc, da],
        };
        var dsS1 = new Dataset
        {
            Name = "Sentinel-1 (radar)",
            Type = "satelital",
            Description = "Backscatter como proxy de humedad y rugosidad del suelo; grilla 30×30 m",
            Format = "GEE asset (raster)",
            LocationPointer = "GEE — COPERNICUS/S1_GRD",
            Source = gee,
            Variables = [backscatter],
        };
        var dsS2 = new Dataset
        {
            Name = "Sentinel-2 (óptico)",
            Type = "satelital",
            Description = "Índices de vegetación y suelo (NDVI, SAVI, BSI); grilla 30×30 m",
            Format = "GEE asset (raster)",
            LocationPointer = "GEE — COPERNICUS/S2_SR",
            Source = gee,
            Variables = [ndvi, savi, bsi],
        };
        var dsClima = new Dataset
        {
            Name = "Clima — CHIRPS/ERA5",
            Type = "climatico",
            Description = "Precipitación total y temperatura media, 2021",
            Format = "GEE asset (raster)",
            LocationPointer = "GEE — UCSB-CHG/CHIRPS, ECMWF/ERA5",
            Source = gee,
            Variables = [precip, temp],
        };
        var dsDem = new Dataset
        {
            Name = "Topografía — Copernicus DEM",
            Type = "topografico",
            Description = "Elevación y vectores morfológicos (pendiente); grilla 30×30 m",
            Format = "GEE asset (raster)",
            LocationPointer = "GEE — COPERNICUS/DEM/GLO30",
            Source = gee,
            Variables = [elev, slope],
        };
        var dsVarRaster = new Dataset
        {
            Name = "Variables ambientales 2021 (raster)",
            Type = "raster",
            Description = "Índices ambientales calculados (Sentinel) + temperatura y precipitación media, 2021, Ecuador continental, grilla 30×30 m",
            TemporalStart = new DateOnly(2021, 1, 1),
            TemporalEnd = new DateOnly(2021, 12, 31),
            Format = "raster (GeoTIFF)",
            Source = gee,
            Variables = [ndvi, savi, bsi, precip, temp, elev, slope, backscatter],
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
        db.Datasets.AddRange(dsSoc, dsS1, dsS2, dsClima, dsDem, dsVarRaster, dsGeo);

        // --- Modelos (notebooks en data/modelos/notebooks) ---
        const string nb = "data/modelos/notebooks";
        var trainData = new List<Dataset> { dsSoc, dsS1, dsS2, dsClima, dsDem };

        var mGraphSageInd = new Model { Name = "GraphSAGE inductivo", Architecture = "GraphSAGE", Scheme = "inductivo", Framework = "PyTorch Geometric", CodePointer = $"{nb}/Anexo 1. Código de Python de implementación de GraphSAGE Esquema Inductivo.ipynb", Datasets = trainData };
        var mGraphSageTrans = new Model { Name = "GraphSAGE transductivo", Architecture = "GraphSAGE", Scheme = "transductivo", Framework = "PyTorch Geometric", CodePointer = $"{nb}/Anexo 2. Código de Python de implementación de GraphSAGE Esquema Transductivo.ipynb", Datasets = trainData };
        var mGatv2Ind = new Model { Name = "GATv2 inductivo", Architecture = "GATv2", Scheme = "inductivo", Framework = "PyTorch Geometric", CodePointer = $"{nb}/Anexo 3. Código de Python de implementación GATv2 Esquema Inductivo.ipynb", Datasets = trainData };
        var mGatv2Trans = new Model { Name = "GATv2 transductivo", Architecture = "GATv2", Scheme = "transductivo", Framework = "PyTorch Geometric", CodePointer = $"{nb}/Anexo 4. Código de Python de implementación de GATv2 Esquema Transductivo.ipynb", Datasets = trainData };
        var mGat = new Model { Name = "GAT (final)", Architecture = "GAT", Framework = "PyTorch Geometric", CodePointer = $"{nb}/GAT_FINAL.ipynb", Datasets = trainData };
        db.Models.AddRange(mGraphSageInd, mGraphSageTrans, mGatv2Ind, mGatv2Trans, mGat);

        // --- Resultados: métricas reales en prueba (Informe de Capacidad de los Modelos,
        //     Tablas 4-9). RMSE y R² por modelo y región. ---
        Result r(Model m, string scope, double rmse, double r2) =>
            new() { Model = m, Scope = scope, Rmse = rmse, R2 = r2, Description = $"{scope} · R²={r2:0.000}" };

        db.Results.AddRange(
            r(mGraphSageInd, "Ecuador", 19.6029, 0.3767),
            r(mGraphSageInd, "Sierra", 21.3436, 0.4549),
            r(mGraphSageInd, "Costa", 16.0083, 0.1076),
            r(mGraphSageTrans, "Ecuador", 18.4261, 0.4491),
            r(mGraphSageTrans, "Sierra", 21.5183, 0.4455),
            r(mGraphSageTrans, "Costa", 16.0143, 0.1071),
            r(mGatv2Ind, "Ecuador", 19.8563, 0.3614),
            r(mGatv2Ind, "Sierra", 21.4521, 0.4481),
            r(mGatv2Ind, "Costa", 13.2470, 0.4474),
            r(mGatv2Trans, "Ecuador", 18.1801, 0.4649),
            r(mGatv2Trans, "Sierra", 21.6099, 0.4390),
            r(mGatv2Trans, "Costa", 13.2201, 0.4496)
        );

        // --- Documentos (informes firmados + oficios) con relación DOCUMENTA ---
        const string inf = "data/documentos/informes";
        const string ofi = "data/documentos/oficios-inamhi";
        var allModels = new List<Model> { mGraphSageInd, mGraphSageTrans, mGatv2Ind, mGatv2Trans, mGat };
        var allCovariates = new List<Dataset> { dsSoc, dsS1, dsS2, dsClima, dsDem };

        db.Documents.AddRange(
            new Document { Title = "Informe de Recopilación de Datos — PIS-24-09", Type = "informe", FilePath = $"{inf}/1. Informe de Recopilación de Datos - PIS-24-09-signed.pdf", Datasets = allCovariates },
            new Document { Title = "Informe de Preprocesamiento de Datos — PIS-24-09", Type = "informe", FilePath = $"{inf}/1. Informe de Preprocesamiento de Datos- PIS-24-09-signed.pdf", Datasets = [dsSoc] },
            new Document { Title = "Informe de Selección y Diseño de Arquitecturas (GNN) — PIS-24-09", Type = "informe", FilePath = $"{inf}/Informe de Selección y Diseño de Arquitecturas de Redes Neuronales (énfasis  en GNN) - PIS-24-09-signed.pdf", Models = allModels },
            new Document { Title = "Implementación en Python de la Arquitectura Óptima (SOC)", Type = "informe", FilePath = $"{inf}/Implementación en Python de la Arquitectura Óptima de Red Neuronal Profunda para la Estimación y Predicción del SOC-signed.pdf", Models = allModels },
            new Document { Title = "Análisis de Mediciones del SOC (INAMHI)", Type = "informe", FilePath = $"{inf}/1. Informe de Análisis de las Mediciones del SOC de Ecuador Proporcionado por el INAHMI-signed (1).pdf", Datasets = [dsSoc] },
            new Document { Title = "Respuesta oficio INAMHI-DEI-2025-0043-O (datos SOC)", Type = "oficio", FilePath = $"{ofi}/Respuesta oficio Nro. INAMHI-DEI-2025-0043-O - Solicitud de información sobre  Carbono Orgánico del Suelo (SOC).pdf", Datasets = [dsSoc] },

            // Publicaciones científicas (referencia por DOI; no se almacena el PDF).
            new Document
            {
                Title = "Graph neural networks for soil organic carbon estimation (MLWA 2026)",
                Type = "paper",
                Authors = "Flores, M.; Soliz, M.; Mollineda, R. A.",
                PublishedOn = new DateOnly(2026, 1, 1),
                FilePath = "data/documentos/papers/gnn-soc-mlwa-2026.pdf",
                Description = "Publicación del proyecto: estimación del SOC con GNN y dependencias espaciales multimodales",
                Models = allModels,
                Datasets = allCovariates,
            },
            new Document
            {
                Title = "Integrating spatial dependence into functional clustering of NDVI in the Ecuadorian Andes (2023)",
                Type = "paper",
                Authors = "Chuquin, J.; Maigua, A.; Flores, M.; Mateu, J.; Torres, S.; Zapata-Ríos, X.",
                PublishedOn = new DateOnly(2023, 1, 1),
                FilePath = "https://doi.org/10.1002/qre.3268",
                Description = "Literatura relacionada: dependencia espacial y NDVI",
                Datasets = [dsS2],
            },
            // Papers Open Access descargados (PDF local en data/documentos/papers).
            new Document
            {
                Title = "NDVI of Ecuadorian Tussock Grasses (2023)",
                Type = "paper",
                Authors = "Villarreal-Veloz, J.; Zapata-Ríos, X.; Uvidia-Zambrano, K.; Borja-Escobar, C.",
                PublishedOn = new DateOnly(2023, 1, 1),
                FilePath = "data/documentos/papers/ndvi-tussock-grasses-2023.pdf",
                Description = "Descripción espacio-temporal del NDVI y variables hidrometeorológicas",
                Datasets = [dsS2],
            },
            new Document
            {
                Title = "Radar + multispectral monitoring of Andean wetlands (2025)",
                Type = "paper",
                Authors = "Huaraca, L.; Bourrel, L.; Zapata-Ríos, X.; et al.",
                PublishedOn = new DateOnly(2025, 1, 1),
                FilePath = "data/documentos/papers/radar-multispectral-wetlands-2025.pdf",
                Description = "Literatura relacionada: teledetección radar + multiespectral",
                Datasets = [dsS1, dsS2],
            }
        );

        await db.SaveChangesAsync();
    }
}
