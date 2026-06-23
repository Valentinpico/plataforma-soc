# Plataforma SOC — PIS-24-09

Plataforma web para la **gestión y visualización del Carbono Orgánico del Suelo (SOC)**
en Ecuador, basada en datos geoespaciales multimodales y modelos de aprendizaje
automático (Redes Neuronales de Grafos). Proyecto PIS-24-09 — Escuela Politécnica
Nacional (EPN).

Este repositorio corresponde al **Producto 1**: aplicativo web para la gestión de
información (repositorio digital) con generación de un **grafo de conocimiento**
soportado en base de datos.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | .NET 9 (C#), ASP.NET Core, Entity Framework Core |
| Base de datos relacional | PostgreSQL + PostGIS |
| Grafo de conocimiento | Neo4j |
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Pruebas | xUnit (backend) · Vitest + Testing Library (frontend) |
| Orquestación | Docker Compose |

## Estructura

```
epn/
├── backend/      → API .NET 9 (Controller → Service → Repository) + tests/
├── frontend/     → React + TS (arquitectura por features)
├── data/         → material real del proyecto (SOC, geo, modelos, documentos)
├── docs/         → informes y diagramas
├── plan/         → plan de fases
└── docker-compose.yml
```

## Requisitos

- Docker + Docker Compose. Nada más se instala en el host.

## Cómo correr

```bash
cp env.example .env        # opcional: ajustar credenciales
docker compose up --build
```

Servicios:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend (API) | http://localhost:8080 |
| Neo4j Browser | http://localhost:7474 |
| PostgreSQL | localhost:5433 |

## Funcionalidades

- **Repositorio digital**: catálogo de fuentes, datasets, variables ambientales,
  modelos, resultados y documentos (metadata + punteros).
- **Grafo de conocimiento** (Neo4j): relaciona todos los activos del proyecto;
  interactivo (arrastrar, zoom, resaltado, leyenda).
- **Gestión completa (CRUD)** de todas las entidades + carga de documentos (PDF).
- **Métricas** de desempeño de los modelos (RMSE, R²) por región.
- **Modo lectura por defecto** + **modo administración** protegido por contraseña.
- Modo claro/oscuro.

## Modo administración

La edición está protegida. En la barra superior, **“Administrar”** → ingresar la
contraseña (`ADMIN_PASSWORD`, por defecto `soc-admin-2026`). Sin ella, la plataforma
queda en solo lectura. Las mutaciones se validan del lado del servidor.

## Pruebas

```bash
# Backend (xUnit + EF InMemory)
docker compose run --rm backend dotnet test tests/SocPlatform.Tests.csproj

# Frontend (Vitest)
docker compose run --rm frontend npm test
```

El proyecto sigue **TDD**: toda lógica de negocio nueva lleva test.

## Fases del proyecto

1. **Producto 1** — Aplicativo web de gestión + grafo de conocimiento (este repo).
2. **Producto 2** — Visualización geoespacial del SOC + prueba de modelos.
3. **Producto 3** — Sistema de consulta inteligente (RAG).

## Documentación

- `docs/informes/` — informe mensual y técnico del Producto 1.
- `docs/diagramas/modelo-datos.md` — modelo de datos y esquema del grafo.
