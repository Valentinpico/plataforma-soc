# Fase 1 — Aplicativo web de gestión + Grafo de conocimiento

**Proyecto:** PIS-24-09 — Plataforma SOC (Carbono Orgánico del Suelo) — EPN
**Período oficial:** 28 may → 27 jun 2026
**Deadline real:** 25 jun 2026
**Estado de partida:** desde cero
**Pago asociado:** $1.212 contra entrega del informe

---

## 1. Objetivo de la fase

Construir el **cimiento** de la plataforma: un backend .NET con repositorio digital
para gestionar la información del proyecto (código, datos, documentación) y un
**grafo de conocimiento en base de datos** que relacione esa información.

El entregable formal es un **informe técnico**, pero documenta software real y
funcionando. Sin código operativo, el informe no cumple el contrato.

## 2. Alcance

### Sí entra (MVP del mes 1)
- Backend .NET con API REST para gestionar entidades del proyecto.
- Repositorio digital: registro y consulta de datasets, modelos, documentos,
  resultados, con control de versiones y trazabilidad.
- Base de datos relacional (PostgreSQL) con el modelo de datos del repositorio.
- Grafo de conocimiento (Neo4j) que conecta: datos geoespaciales, variables
  ambientales, modelos ML/GNN, resultados, documentación, fuentes.
- Carga inicial (seed) del grafo con la información ya existente del proyecto.
- Informe técnico documentando diseño, arquitectura e implementación.

### No entra (es de fases 2 y 3)
- Visualización geoespacial del SOC en mapa → Fase 2.
- Prueba interactiva de modelos → Fase 2.
- Sistema RAG → Fase 3.
- Reentrenar o reimplementar los GNN → ya hechos por el equipo (Python).

## 3. Stack

| Capa | Tecnología |
|------|-----------|
| Backend | .NET 9 (C#), ASP.NET Core Web API |
| ORM | Entity Framework Core |
| BD relacional | PostgreSQL |
| Grafo de conocimiento | Neo4j (driver oficial .NET) |
| Frontend mínimo | React + TS + Vite (solo lo necesario para demostrar gestión) |
| Control de versiones | Git (un solo repo) |
| Contenedores | Docker Compose (Postgres + Neo4j + API) |

## 4. Estructura del repositorio (monorepo)

```
soc-platform/
├─ backend/            # solución .NET (API, dominio, infraestructura)
├─ frontend/           # React + TS (Vite)
├─ db/
│  ├─ migrations/      # migraciones EF Core
│  └─ graph/           # scripts Cypher de carga del grafo
├─ docs/
│  ├─ informe-fase-1.md
│  └─ diagramas/       # arquitectura, modelo de datos, esquema del grafo
├─ ml/                 # referencias a modelos del equipo (NO reimplementar)
├─ docker-compose.yml
└─ README.md
```

## 5. Modelo del grafo de conocimiento (borrador)

Nodos: `Dataset`, `VariableAmbiental`, `Modelo`, `Resultado`, `Documento`, `Fuente`, `Region`.

Relaciones de ejemplo:
- `(Modelo)-[:ENTRENADO_CON]->(Dataset)`
- `(Dataset)-[:CONTIENE]->(VariableAmbiental)`
- `(Modelo)-[:PRODUCE]->(Resultado)`
- `(Resultado)-[:DOCUMENTADO_EN]->(Documento)`
- `(Dataset)-[:PROVIENE_DE]->(Fuente)`  (ej. INAMHI, Sentinel, GEE)
- `(Resultado)-[:UBICADO_EN]->(Region)`

## 6. Plan de los 7 días

| Día | Trabajo |
|-----|---------|
| 1 | Crear repo, `docker-compose` (Postgres + Neo4j), esqueleto .NET + React, README. |
| 2 | Modelo de datos relacional + migraciones EF Core. Entidades del repositorio. |
| 3 | API REST CRUD: datasets, modelos, documentos, resultados, fuentes. |
| 4 | Diseño del grafo en Neo4j. Driver .NET. Scripts Cypher de creación. |
| 5 | Carga (seed) del grafo con info real del proyecto + endpoints de consulta del grafo. |
| 6 | Frontend mínimo: listado/registro de recursos + vista del grafo. Capturas. |
| 7 | Redacción del informe, diagramas, revisión final, entrega. |

> Realista: 7 días desde cero es agresivo. Prioridad si falta tiempo:
> grafo + BD + informe **por encima** del frontend pulido. El frontend puede ser básico.

## 7. Estructura del informe técnico

1. Portada (formato EPN, PIS-24-09)
2. Resumen ejecutivo
3. Introducción y objetivo del producto
4. Arquitectura general de la plataforma (diagrama)
5. Repositorio digital
   - Modelo de datos
   - Control de versiones, acceso, trazabilidad
   - Buenas prácticas de gestión de información
6. Grafo de conocimiento
   - Justificación y diseño (nodos, relaciones)
   - Implementación en Neo4j
   - Capturas del grafo y consultas de ejemplo
7. Tecnologías utilizadas y decisiones técnicas
8. Validación operativa (qué funciona, cómo se probó)
9. Conclusiones y trabajo futuro (enganche con Fase 2)
10. Anexos: capturas, fragmentos de código, instrucciones de despliegue

## 8. Criterios de aceptación

- [ ] API .NET levanta y responde (CRUD del repositorio funcionando).
- [ ] Postgres con modelo de datos migrado.
- [ ] Neo4j con grafo cargado y consultable.
- [ ] Frontend mínimo demuestra gestión y muestra el grafo.
- [ ] `docker-compose up` levanta todo de un comando.
- [ ] Informe completo con diagramas y capturas reales.
- [ ] Repo con commits ordenados (control de versiones demostrable).
