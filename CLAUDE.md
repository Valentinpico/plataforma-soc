# Plataforma SOC (PIS-24-09) — Guía para Agentes

Plataforma web para gestión y visualización del Carbono Orgánico del Suelo (SOC) en
Ecuador. Proyecto PIS-24-09 (EPN). Backend .NET, frontend React+TS, en **un solo repo**.

Plan de fases en `plan/`. Stack y contexto: ver `plan/fase-1-aplicativo-web-grafo.md`.

---

## Estructura del repo (monorepo)

```
epn/
├── backend/      → solución .NET 9 (un solo repo, no separado)
├── frontend/     → React + TS + Vite
├── db/           → migraciones EF Core + scripts Cypher del grafo
├── docs/         → informes técnicos + diagramas
├── plan/         → plan de las 3 fases
├── docker-compose.yml
└── CLAUDE.md
```

**Es UN solo repo git** en la raíz `epn/`. Todo (backend + frontend) en el mismo
remote. No separar en dos repos.

---

## Engram (memoria)

Proyecto de engram: **`epn`**. Guardá/buscá siempre con `project: "epn"` explícito.

---

## Frontend — Estructura de features

```
src/features/{name}/
├── CONVENTIONS.md   ← reglas específicas del feature (si las hay)
├── components/      ← componentes React (pequeños, < 100 líneas)
│   └── {sub}/       ← subcarpeta si hay grupo de componentes relacionados
├── hooks/           ← custom hooks + Zustand stores
├── api/             ← fetchers / endpoints
├── types/           ← tipos del feature
└── utils/           ← helpers puros
```

Importar SIEMPRE directo al archivo, nunca barrel (`index.ts`).
Estado global → Zustand store en `hooks/{feature}Store.ts`.

### Reglas frontend obligatorias

**Zustand — selectores individuales, nunca el store completo:**

```ts
// ❌ MAL — re-render en cualquier cambio del store
const { users, loading } = useAdminStore();

// ✅ BIEN — re-render solo cuando cambia ese valor
const users = useAdminStore((s) => s.users);
const loading = useAdminStore((s) => s.usersLoading);
```

Aplica también a Providers (authContext, etc.) — selectores individuales.

**Try/catch — solo en hooks de acciones, nunca en componentes:**

```ts
// ❌ MAL — try/catch en componente
const handleSubmit = async () => {
  try { await store.createUser(data); } catch (err) { toast.error(...); }
};

// ✅ BIEN — hook de acciones maneja error, retorna boolean
const { createUser } = useUserActions();
const handleSubmit = async () => {
  const ok = await createUser(form); // hook hace toast internamente
  if (ok) onClose();
};
```

Patrón: `use{Feature}Actions.ts` en `hooks/`. Retornan `Promise<boolean>` o
`Promise<T | null>` — nunca lanzan.

**Streaming — suscribir en el componente que renderiza, no en el padre:**

```ts
// ✅ BIEN — solo el componente que muestra el stream re-renderiza
// En MessageList (no en el padre):
const streamingContent = useChatStore((s) => s.streamingContent);
```

**Negar ifs — early return, no else:**

```tsx
if (loading) return <Spinner />;
return <Content />;
```

**Componentes pequeños — < 100 líneas, un propósito:**
- Componente > 100 líneas → dividirlo.
- 3+ piezas de UI relacionadas → subcarpeta propia.
- Orquestador (estado + layout) → delega UI a componentes hijos.

**Reutilización — usá SIEMPRE `src/shared/components/`:**
- `<button>`/`<input>`/`<select>` crudos PROHIBIDOS para UI estándar. Usá los
  componentes compartidos (`Button`, `IconButton`, `Input`, `Select`, `Modal`,
  `ConfirmModal`, `Badge`, `useToast`, etc.).
- Si algo se puede reutilizar, se reutiliza. ¿Falta una variante? Agregala a
  `shared/` y reusala — nunca la hardcodees en la feature.
- Excepción: markup no estándar (filas `role="menuitem"`, tabs, disparador avatar).

---

## Frontend — Design System

- **NUNCA** colores hardcodeados (`bg-white`, `text-blue-600`, `#FDECEA`,
  `text-red-500`, etc.).
- **SIEMPRE** tokens semánticos CSS. Para `style` inline usar `var(--error)`,
  `var(--success-bg)`, etc.

| Token CSS | Clase utilitaria | Uso |
|-----------|-----------------|-----|
| `--success` / `--success-bg` | `text-success` / `bg-success-bg` | Éxito, activo |
| `--warning` / `--warning-bg` | `text-warning` / `bg-warning-bg` | Advertencia |
| `--error` / `--error-bg` | `text-error` / `bg-error-bg` | Error, peligro, eliminar |
| `--accent` / `--accent-muted` | `text-accent` / `bg-accent-muted` | Acción primaria, info |

- Dark mode via `data-dark="true"` en `<html>` — verificar ambos modos.
- Definir los tokens en CSS al inicio del proyecto; el resto del frontend los consume.

---

## Backend (.NET) — Arquitectura por capas

**Regla cardinal: nada de SQL/EF ni lógica de negocio en los controllers.**

```
Controller  → valida request, llama al service, retorna response
Service     → lógica de negocio, errores de dominio
Repository  → acceso a datos (EF Core / Neo4j driver)
```

```csharp
// ❌ MAL — query EF en el controller
[HttpGet("stats")]
public async Task<IActionResult> GetStats() {
    var total = await _db.Datasets.CountAsync();
    return Ok(total);
}

// ✅ BIEN — controller delega al service
[HttpGet("stats")]
public async Task<IActionResult> GetStats() =>
    Ok(await _statsService.GetStatsAsync());
```

### Reutilizar lo compartido

Antes de crear utilidades nuevas en backend, revisar `backend/.../Shared/`:
- Logging estructurado (un solo logger, no crear nuevos).
- Excepciones de dominio: una base `AppException` + `NotFoundError`,
  `ConflictError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`.
  No crear excepciones custom sin heredar de la base.
- Manejo global de errores (middleware/filter) que mapea excepciones de dominio
  a respuestas HTTP.

No duplicar utilidades que ya existen en `Shared/`.

---

## Docker

- **Todo corre dentro de contenedores**, no a pelo en el host: API, scripts,
  reindex, jobs de embeddings (RAG fase 3). Usar:
  ```bash
  docker compose run --rm backend dotnet run --project scripts/<X>
  ```
  Motivo: procesos de embeddings/ML sin tope inflan memoria; Docker capa la VM.
  Excepción: unit tests rápidos y mockeados pueden correr en el host.

- **NUNCA ejecutar builds automáticamente** (`docker compose build` /
  `docker build` / `dotnet publish` pesado). Cuando un cambio requiera rebuild
  (nuevo paquete NuGet, cambio en `Dockerfile`), **avisar al usuario** con el
  comando exacto y esperar que lo corra él. Los builds son lentos; el usuario
  controla cuándo corren.

---

## Git

- **Un solo repo** en la raíz `epn/`. Backend y frontend van al mismo remote.
- Conventional commits. Sin atribución de IA en los commits.
- No commitear ni pushear salvo que el usuario lo pida.
