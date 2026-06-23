# Implementación de un Aplicativo Web para la Gestión de Información y Generación de un Grafo de Conocimiento — SOC

**Estimación del Carbono Orgánico del Suelo mediante Redes Neuronales de Grafos utilizando Datos Multimodales Geoespaciales**

> Informe técnico detallado — Producto 1 (PIS-24-09). Plantilla lista para completar
> y exportar a PDF. Los campos `[COMPLETAR: ...]` y `[INSERTAR CAPTURA: ...]` son lo
> único pendiente.

| | |
|---|---|
| **Director del proyecto** | David Andrés Donoso Vargas |
| **Profesional contratado** | Valentin Pico — Ingeniero de Software |
| **Fecha de entrega** | [COMPLETAR: fecha] |

---

## Tabla de contenido

1. Introducción
2. Objetivos
3. Metodología e implementación
4. Conclusiones
5. Bibliografía
6. Anexos

---

## 1. Introducción

El presente informe describe el diseño e implementación de un aplicativo web para la
gestión de la información del Proyecto PIS-24-09, orientado a la estimación del Carbono
Orgánico del Suelo (SOC) en Ecuador. La iniciativa corresponde a la fase de
consolidación tecnológica del proyecto, en la cual los datos, modelos y resultados
generados en etapas previas —basadas en Redes Neuronales de Grafos (GNN) y datos
geoespaciales multimodales— requieren ser organizados, relacionados y puestos a
disposición de manera trazable y reproducible.

Para ello se desarrolló una plataforma web compuesta por un **repositorio digital** que
integra código, datos y documentación, y un **grafo de conocimiento soportado en base
de datos** que estructura y relaciona la información técnica del proyecto: datasets
geoespaciales, variables ambientales, modelos de aprendizaje automático, resultados de
desempeño, documentación técnica y fuentes de información.

A diferencia de un repositorio de archivos convencional, la plataforma modela
explícitamente las relaciones entre estos activos, lo que permite recorrer y consultar
la trazabilidad metodológica del proyecto (qué modelo se entrenó con qué datos, qué
documento describe qué resultado, de qué fuente proviene cada dataset) y sienta la base
para las fases posteriores de visualización (Fase 2) y de consulta inteligente basada
en RAG (Fase 3).

## 2. Objetivos

### Objetivo general

Diseñar e implementar un aplicativo web para la gestión de la información del proyecto
PIS-24-09, que integre un repositorio digital y un grafo de conocimiento soportado en
base de datos, garantizando la organización, trazabilidad y reproducibilidad de los
datos, modelos, resultados y documentación relacionados con la estimación del SOC en
Ecuador.

### Objetivos específicos

- Diseñar un modelo de datos que represente los activos del proyecto (fuentes,
  datasets, variables ambientales, modelos, resultados y documentos) y sus relaciones.
- Implementar un repositorio digital que integre código, datos y documentación, bajo
  criterios de organización, control de versiones, acceso y buenas prácticas de gestión
  de información.
- Generar un grafo de conocimiento soportado en base de datos que estructure y relacione
  la información técnica del proyecto.
- Desarrollar una interfaz web que permita consultar y gestionar la información
  catalogada y explorar el grafo de conocimiento.
- Establecer una infraestructura reproducible que sirva de base para las fases de
  visualización del SOC y de consulta inteligente (RAG).

## 3. Metodología e implementación

### 3.1 Arquitectura general

La plataforma se implementó como un monorepo único que integra backend, frontend, bases
de datos y documentación, ejecutado íntegramente en contenedores mediante Docker
Compose. Se adoptó una arquitectura por capas en el backend (Controlador → Servicio →
Repositorio/Acceso a datos) y una arquitectura por features en el frontend.

| Capa | Tecnología |
|------|-----------|
| Backend | .NET 9 (C#), ASP.NET Core |
| ORM | Entity Framework Core |
| Base de datos relacional | PostgreSQL + PostGIS |
| Grafo de conocimiento | Neo4j |
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Orquestación | Docker Compose |

### 3.2 Modelo de datos del repositorio

El repositorio se modeló mediante seis entidades relacionales: `Fuente`, `Dataset`,
`VariableAmbiental`, `Modelo`, `Resultado` y `Documento`, con relaciones uno-a-muchos y
muchos-a-muchos (por ejemplo, un modelo se entrena con varios datasets; un dataset
contiene varias variables; un documento documenta varios modelos o datasets). El detalle
del esquema se encuentra en `docs/diagramas/modelo-datos.md`.

La plataforma cataloga la metadata y los punteros de los datos, no los archivos pesados:
las imágenes satelitales residen en Google Earth Engine y se referencian mediante sus
identificadores de colección, mientras que los datos livianos (mediciones, resultados)
se almacenan directamente.

### 3.3 Información catalogada

Se pobló el repositorio con la información real del proyecto:

- **Fuentes (4):** INAMHI, MAGAP, Google Earth Engine, geoBoundaries.
- **Datasets (7):** mediciones SOC MAGAP/INAMHI (12 861 perfiles, enfoque 0–30 cm);
  Sentinel-1 (radar); Sentinel-2 (óptico: NDVI, SAVI, BSI); clima CHIRPS/ERA5
  (precipitación y temperatura media 2021); topografía Copernicus DEM (elevación,
  pendiente); variables ambientales 2021 en raster a 30×30 m; límites provinciales del
  Ecuador.
- **Variables ambientales (10):** carbono orgánico, densidad aparente, backscatter,
  NDVI, SAVI, BSI, precipitación media, temperatura media, elevación, pendiente.
- **Modelos (5):** GraphSAGE y GATv2 en esquemas inductivo y transductivo, y GAT.
- **Resultados (12):** métricas en prueba (RMSE y R²) por modelo y región
  (Ecuador, Sierra, Costa).
- **Documentos (6):** informes técnicos firmados y oficio INAMHI.

### 3.4 Grafo de conocimiento

El grafo se implementó en Neo4j y se genera por proyección del modelo relacional. Las
relaciones modeladas son:

```
(:Dataset)-[:PROVIENE_DE]->(:Fuente)
(:Dataset)-[:CONTIENE]->(:VariableAmbiental)
(:Modelo)-[:ENTRENADO_CON]->(:Dataset)
(:Modelo)-[:PRODUCE]->(:Resultado)
(:Documento)-[:DOCUMENTA]->(:Modelo | :Dataset)
```

El grafo resultante contiene 44 nodos y 72 relaciones, e integra de forma navegable la
totalidad de los activos del proyecto y su trazabilidad.

### 3.5 Repositorio digital y buenas prácticas

- **Código:** versionado en Git con commits atómicos siguiendo Conventional Commits.
- **Datos:** organizados por tipo en `data/` (SOC, geo, modelos, documentos).
- **Documentación:** plan de fases, modelo de datos y convenciones en `docs/`.
- **Acceso y organización:** estructura de monorepo con convenciones explícitas
  (`CLAUDE.md`) y separación por capas/features.

### 3.6 Interfaz web de gestión

Se desarrolló una interfaz con sistema de diseño propio (tokens semánticos, modo
claro/oscuro), compuesta por una página de inicio con la presentación del proyecto y el
equipo, y una página de catálogo que permite consultar y gestionar los activos (alta,
edición y baja de datasets), visualizar las métricas de desempeño y explorar el grafo de
conocimiento.

### 3.7 Validación operativa

El entorno completo se levanta con un único comando (`docker compose up`) y expone una
API REST verificada (endpoints de catálogo y de grafo) y una interfaz funcional. Se
comprobaron las operaciones de consulta y gestión, la generación del grafo y la
correspondencia entre el modelo relacional y el grafo de conocimiento.

## 4. Conclusiones

- La implementación de un repositorio digital y un grafo de conocimiento permite
  centralizar, organizar y **relacionar de forma trazable** los activos heterogéneos del
  proyecto (datos geoespaciales, variables, modelos, resultados y documentación),
  facilitando su consulta y reutilización.
- La arquitectura por capas y la ejecución en contenedores garantizan
  **reproducibilidad, escalabilidad y mantenibilidad**, y constituyen una base sólida
  para las fases posteriores del proyecto.
- El grafo de conocimiento, al modelar explícitamente las relaciones entre datos,
  modelos, resultados y documentación, aporta **trazabilidad metodológica** y se
  proyecta como insumo directo para el sistema de recuperación de información (RAG)
  previsto en la Fase 3.
- La catalogación de la información real del proyecto (incluidas las métricas de
  desempeño de los modelos GNN) demuestra la utilidad práctica de la plataforma como
  herramienta de gestión y transferencia del conocimiento generado.
- [COMPLETAR: conclusión adicional propia, si corresponde]

## 5. Bibliografía

- Instituto Nacional de Meteorología e Hidrología (INAMHI). (2021). *Base de datos de
  mediciones de Carbono Orgánico del Suelo del Ecuador continental*, proporcionada a
  través del Ministerio de Agricultura y Ganadería (MAGAP).
- Soliz Villafuerte, M. X., & Donoso Vargas, D. A. (2026). *Informe de Implementación en
  Python de la Arquitectura Óptima de Red Neuronal Profunda para la Estimación y
  Predicción del SOC* (Producto 2 del Proyecto PIS-24-09). Escuela Politécnica Nacional.
- Soliz Villafuerte, M. X., & Donoso Vargas, D. A. (2026). *Informe sobre la Capacidad
  de los Modelos para Capturar la Dinámica de los Niveles de Carbono Orgánico en los
  Suelos de Ecuador* (Proyecto PIS-24-09). Escuela Politécnica Nacional.
- [COMPLETAR: otras referencias]

## 6. Anexos

### Anexo 1 — Capturas de la plataforma

- [INSERTAR CAPTURA: página de inicio (presentación y equipo)]
- [INSERTAR CAPTURA: catálogo — grafo de conocimiento]
- [INSERTAR CAPTURA: catálogo — tabla de datasets y gestión]
- [INSERTAR CAPTURA: catálogo — tabla de métricas]
- [INSERTAR CAPTURA: modo oscuro]
- [INSERTAR CAPTURA: grafo en Neo4j Browser (`MATCH (n) RETURN n`)]
- [INSERTAR CAPTURA: tablas del repositorio en PostgreSQL]

### Anexo 2 — Métricas de desempeño catalogadas (RMSE y R² en prueba)

| Modelo | Esquema | Región | RMSE | R² |
|--------|---------|--------|------|-----|
| GATv2 | transductivo | Ecuador | 18.18 | 0.465 |
| GraphSAGE | transductivo | Ecuador | 18.43 | 0.449 |
| GATv2 | inductivo | Ecuador | 19.86 | 0.361 |
| GraphSAGE | inductivo | Ecuador | 19.60 | 0.377 |
| GraphSAGE | inductivo | Sierra | 21.34 | 0.455 |
| GATv2 | inductivo | Sierra | 21.45 | 0.448 |
| GraphSAGE | transductivo | Sierra | 21.52 | 0.446 |
| GATv2 | transductivo | Sierra | 21.61 | 0.439 |
| GATv2 | transductivo | Costa | 13.22 | 0.450 |
| GATv2 | inductivo | Costa | 13.25 | 0.447 |
| GraphSAGE | inductivo | Costa | 16.01 | 0.108 |
| GraphSAGE | transductivo | Costa | 16.01 | 0.107 |

Fuente: *Informe sobre la Capacidad de los Modelos* (Tablas 4–9).
