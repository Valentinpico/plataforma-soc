# Modelo de datos — Fase 1

Repositorio digital (catálogo) en **PostgreSQL** + grafo de conocimiento en **Neo4j**.

Principio: la plataforma **cataloga y relaciona**. Los datos pesados (Sentinel, etc.)
viven en su fuente (GEE, INAMHI); acá guardamos metadata + punteros.

## Entidades relacionales (Postgres = fuente de verdad)

```
Source (Fuente)
  id, name, type, description, url
  └─ 1..N Dataset

Dataset
  id, name, type, description, temporalStart, temporalEnd,
  locationPointer, format, recordCount, sourceId(FK)
  ├─ N..N EnvironmentalVariable
  └─ N..N Model  (relación "entrenado con")

EnvironmentalVariable (Variable ambiental)
  id, name, unit, description

Model (Modelo)
  id, name, architecture, scheme, framework, codePointer, description
  ├─ N..N Dataset
  └─ 1..N Result

Result (Resultado)
  id, modelId(FK), r2, mae, mape, description

Document (Documento)
  id, title, type, description, filePath, authors, publishedOn
```

Tablas join inferidas por EF Core: `DatasetEnvironmentalVariable`, `DatasetModel`.

### Valores de catálogo (texto libre con convención)

- `Source.type`: `institucion` | `satelite` | `repositorio`
- `Dataset.type`: `satelital` | `climatico` | `topografico` | `campo`
- `Model.architecture`: `GraphSAGE` | `GAT` | `GATv2`
- `Model.scheme`: `inductivo` | `transductivo`
- `Document.type`: `informe` | `paper` | `oficio` | `metodologia`

## Grafo de conocimiento (Neo4j = vista de relaciones)

Nodos espejo de las entidades + relaciones para traversal y visualización:

```
(:Dataset)-[:PROVIENE_DE]->(:Fuente)
(:Dataset)-[:CONTIENE]->(:VariableAmbiental)
(:Modelo)-[:ENTRENADO_CON]->(:Dataset)
(:Modelo)-[:PRODUCE]->(:Resultado)
(:Documento)-[:DOCUMENTA]->(:Modelo | :Dataset | :Resultado)
```

Postgres se proyecta a Neo4j en el seed/sync. Cada DB hace lo suyo:
relacional para consultas estructuradas, grafo para recorrer y graficar relaciones.

## Mapeo a los datos reales que ya tenemos

| Fuente real | Entra como |
|-------------|-----------|
| Base SOC 2021 (CSV/xlsx, 12.861 perfiles) | `Dataset` (campo) + `Fuente` INAMHI |
| Notebooks GraphSAGE / GAT / GATv2 | `Model` (×N, con scheme) |
| Métricas R²/MAE/MAPE de los informes | `Result` por modelo |
| Informes firmados PIS-24-09 | `Document` (informe) |
| Oficios INAMHI | `Fuente` + `Document` (oficio) |
| geoBoundaries Ecuador | `Dataset` (topografico) — geometría se usa en Fase 2 |

## Decisiones de diseño

- **6 entidades**, no más. `Region`/geometría llega en Fase 2 (PostGIS).
- **EnsureCreated** crea las tablas al arrancar (dev). Sin migraciones aún.
  Ceiling: sin historial de esquema. Upgrade a EF Migrations antes de entrega
  final si se quiere trazabilidad.
- Categorías como `string` con convención, no enums — flexibilidad sobre rigidez.
