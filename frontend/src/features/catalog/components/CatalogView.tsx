import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../../shared/auth/AdminContext";
import { Button } from "../../../shared/components/Button";
import { ConfirmModal } from "../../../shared/components/ConfirmModal";
import { catalogApi } from "../api/catalogApi";
import { useCatalog } from "../hooks/useCatalog";
import { useDatasetActions } from "../hooks/useDatasetActions";
import { useDocumentActions } from "../hooks/useDocumentActions";
import { useEntityActions } from "../hooks/useEntityActions";
import type { Dataset, DocumentItem, EnvironmentalVariable, Model, Source } from "../types/catalog";
import { DatasetFormModal } from "./DatasetFormModal";
import { DatasetTable } from "./DatasetTable";
import { DocumentDetailModal } from "./DocumentDetailModal";
import { DocumentFormModal } from "./DocumentFormModal";
import { DocumentList } from "./DocumentList";
import { GraphView } from "./GraphView";
import { ManagedList } from "./ManagedList";
import { MetricsTable } from "./MetricsTable";
import { ModelDetailModal } from "./ModelDetailModal";
import { ModelFormModal } from "./ModelFormModal";
import { ModelList } from "./ModelList";
import { SourceFormModal } from "./SourceFormModal";
import { VariableFormModal } from "./VariableFormModal";

const CATEGORY_CHIPS = ["Uso de suelo", "Datos geoespaciales", "IA y aprendizaje automático", "Ambiental"];

// Investigadores que participaron en el proyecto SOC (PIS-24-09). slug → perfil.
const SOC_TEAM: { slug: string | null; name: string; role: string }[] = [
  { slug: "david-donoso", name: "David Andrés Donoso Vargas", role: "Director del proyecto" },
  { slug: "miguel-flores", name: "Miguel Alfonso Flores Sánchez", role: "Codirector" },
  { slug: "mateo-soliz", name: "Mateo Xavier Soliz Villafuerte", role: "Investigador — modelos GNN" },
  //{ slug: null, name: "Valentin Pico", role: "Ingeniero de software — desarrollo de la plataforma" },
];

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5 border-b border-border pb-3">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
      <h2 className="font-display text-xl text-token">{title}</h2>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <p className="nums font-display text-3xl text-accent">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

export function CatalogView() {
  const { isAdmin } = useAdmin();
  const { data, loading, error, reload } = useCatalog();
  const datasetActions = useDatasetActions(reload);
  const documentActions = useDocumentActions(reload);
  const sourceActions = useEntityActions(
    { create: catalogApi.createSource, update: catalogApi.updateSource, remove: catalogApi.deleteSource },
    reload
  );
  const variableActions = useEntityActions(
    { create: catalogApi.createVariable, update: catalogApi.updateVariable, remove: catalogApi.deleteVariable },
    reload
  );
  const modelActions = useEntityActions(
    { create: catalogApi.createModel, update: catalogApi.updateModel, remove: catalogApi.deleteModel },
    reload
  );

  const [editing, setEditing] = useState<Dataset | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Dataset | null>(null);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [viewingModel, setViewingModel] = useState<Model | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null | undefined>(undefined);
  const [deletingDoc, setDeletingDoc] = useState<DocumentItem | null>(null);
  const [editingSource, setEditingSource] = useState<Source | null | undefined>(undefined);
  const [deletingSource, setDeletingSource] = useState<Source | null>(null);
  const [editingVar, setEditingVar] = useState<EnvironmentalVariable | null | undefined>(undefined);
  const [deletingVar, setDeletingVar] = useState<EnvironmentalVariable | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null | undefined>(undefined);
  const [deletingModel, setDeletingModel] = useState<Model | null>(null);

  if (loading) return <p className="text-muted">Cargando catálogo…</p>;
  if (error) return <p className="text-error">Error: {error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-12 py-2">
      {/* Back link */}
      <Link
        to="/"
        className="inline-block rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-token hover:shadow-md"
      >
        ← Volver al grupo META
      </Link>

      {/* Project header panel */}
      <div className="rounded-2xl bg-brand-bg p-7 text-on-brand">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest opacity-70">
          Proyecto PIS-24-09 · En curso
        </p>
        <h1 className="font-display text-2xl leading-snug sm:text-3xl">
          Estimación del Carbono Orgánico del Suelo mediante Redes Neuronales de Grafos
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-80">
          Plataforma para gestionar, visualizar y consultar el carbono orgánico del suelo (SOC) en
          Ecuador. Combina datos geoespaciales multimodales con modelos GNN — GraphSAGE y GAT — para
          estimar la distribución espacial del SOC a nivel nacional.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-on-brand/20 px-3 py-0.5 text-xs opacity-80"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Equipo del proyecto */}
      <section>
        <SectionHeader eyebrow="Equipo" title="Investigadores del proyecto" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOC_TEAM.map((m) =>
            m.slug ? (
              <Link
                key={m.name}
                to={`/equipo/${m.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-token">{m.name}</p>
                  <p className="text-xs text-accent">{m.role}</p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm text-muted transition group-hover:border-transparent group-hover:bg-accent group-hover:text-on-accent">
                  →
                </span>
              </Link>
            ) : (
              <div key={m.name} className="rounded-xl border border-border bg-surface-2 p-4">
                <p className="font-medium text-token">{m.name}</p>
                <p className="text-xs text-muted">{m.role}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Overview stats */}
      <section>
        <SectionHeader eyebrow="Resumen" title="Visión general del proyecto" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard value={data.datasets.length} label="Datasets" />
          <StatCard value={data.variables.length} label="Variables ambientales" />
          <StatCard value={data.sources.length} label="Fuentes" />
          <StatCard value={data.models.length} label="Modelos" />
          <StatCard value={data.documents.length} label="Documentos" />
        </div>
      </section>

      {/* Knowledge graph */}
      <section>
        <SectionHeader eyebrow="Estructura" title="Grafo de conocimiento" />
        <p className="mb-4 text-sm text-muted">
          Relaciones entre fuentes, datasets, variables ambientales, modelos, resultados y documentos
          del proyecto.
        </p>
        <div className="rounded-2xl border border-border bg-surface-2 p-4">
          <p className="mb-2 text-right text-xs text-muted">
            Pasá el mouse para ver etiquetas · arrastrá / zoom
          </p>
          <GraphView graph={data.graph} />
        </div>
      </section>

      {/* Datos */}
      <section>
        <SectionHeader eyebrow="Datos" title="Datasets, variables y fuentes" />
        <p className="mb-5 text-sm text-muted">
          Datos de entrenamiento y validación agrupados por dataset, con las variables ambientales
          medidas y las fuentes de origen.
        </p>

        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-base text-token">Datasets</h3>
          {isAdmin && <Button onClick={() => setEditing(null)}>+ Nuevo</Button>}
        </div>
        <DatasetTable
          datasets={data.datasets}
          canEdit={isAdmin}
          onEdit={setEditing}
          onDelete={setDeleting}
        />

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base text-token">Variables ambientales</h3>
              {isAdmin && <Button onClick={() => setEditingVar(null)}>+ Nueva</Button>}
            </div>
            <ManagedList
              items={data.variables}
              label={(v) => (v.unit ? `${v.name} (${v.unit})` : v.name)}
              canEdit={isAdmin}
              onEdit={setEditingVar}
              onDelete={setDeletingVar}
              display="badges"
              badgeTone="accent"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base text-token">Fuentes</h3>
              {isAdmin && <Button onClick={() => setEditingSource(null)}>+ Nueva</Button>}
            </div>
            <ManagedList
              items={data.sources}
              label={(s) => (s.type ? `${s.name} · ${s.type}` : s.name)}
              canEdit={isAdmin}
              onEdit={setEditingSource}
              onDelete={setDeletingSource}
              display="badges"
            />
          </div>
        </div>
      </section>

      {/* Modelos y resultados */}
      <section>
        <SectionHeader eyebrow="Modelos" title="Modelos y resultados" />
        <p className="mb-5 text-sm text-muted">
          Modelos GNN entrenados para la estimación del SOC. Hacé clic en un modelo para ver su detalle.
        </p>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-base text-token">
            Modelos <span className="text-muted">({data.models.length})</span>
          </h3>
          {isAdmin && <Button onClick={() => setEditingModel(null)}>+ Nuevo</Button>}
        </div>
        <ModelList
          models={data.models}
          onSelect={setViewingModel}
          canEdit={isAdmin}
          onEdit={setEditingModel}
          onDelete={setDeletingModel}
        />
        <div className="mt-8">
          <h3 className="mb-3 font-display text-base text-token">Resultados — métricas en prueba</h3>
          <MetricsTable results={data.results} />
        </div>
      </section>

      {/* Documentos */}
      <section>
        <SectionHeader eyebrow="Documentación" title="Documentos del proyecto" />
        <p className="mb-4 text-sm text-muted">
          Informes técnicos, papers académicos y documentos oficiales asociados al proyecto.
        </p>
        {isAdmin && (
          <div className="mb-3 flex justify-end">
            <Button onClick={() => setEditingDoc(null)}>+ Subir</Button>
          </div>
        )}
        <DocumentList documents={data.documents} onSelect={setViewingDoc} />
      </section>

      {/* Modales */}
      <DatasetFormModal open={editing !== undefined} dataset={editing ?? null} sources={data.sources} onClose={() => setEditing(undefined)} onChanged={reload} />
      <ConfirmModal open={deleting !== null} title="Borrar dataset" message={`¿Borrar "${deleting?.name}"?`} onConfirm={async () => { if (deleting) await datasetActions.remove(deleting.id); setDeleting(null); }} onClose={() => setDeleting(null)} />

      <SourceFormModal open={editingSource !== undefined} source={editingSource ?? null} onClose={() => setEditingSource(undefined)} onChanged={reload} />
      <ConfirmModal open={deletingSource !== null} title="Borrar fuente" message={`¿Borrar "${deletingSource?.name}"?`} onConfirm={async () => { if (deletingSource) await sourceActions.remove(deletingSource.id); setDeletingSource(null); }} onClose={() => setDeletingSource(null)} />

      <VariableFormModal open={editingVar !== undefined} variable={editingVar ?? null} onClose={() => setEditingVar(undefined)} onChanged={reload} />
      <ConfirmModal open={deletingVar !== null} title="Borrar variable" message={`¿Borrar "${deletingVar?.name}"?`} onConfirm={async () => { if (deletingVar) await variableActions.remove(deletingVar.id); setDeletingVar(null); }} onClose={() => setDeletingVar(null)} />

      <ModelDetailModal model={viewingModel} onClose={() => setViewingModel(null)} />
      <ModelFormModal open={editingModel !== undefined} model={editingModel ?? null} onClose={() => setEditingModel(undefined)} onChanged={reload} />
      <ConfirmModal open={deletingModel !== null} title="Borrar modelo" message={`¿Borrar "${deletingModel?.name}"?`} onConfirm={async () => { if (deletingModel) await modelActions.remove(deletingModel.id); setDeletingModel(null); }} onClose={() => setDeletingModel(null)} />

      <DocumentDetailModal doc={viewingDoc} onClose={() => setViewingDoc(null)} onEdit={isAdmin ? (d) => { setViewingDoc(null); setEditingDoc(d); } : undefined} onDelete={isAdmin ? (d) => { setViewingDoc(null); setDeletingDoc(d); } : undefined} />
      <DocumentFormModal open={editingDoc !== undefined} doc={editingDoc ?? null} onClose={() => setEditingDoc(undefined)} onChanged={reload} />
      <ConfirmModal open={deletingDoc !== null} title="Borrar documento" message={`¿Borrar "${deletingDoc?.title}"?`} onConfirm={async () => { if (deletingDoc) await documentActions.remove(deletingDoc.id); setDeletingDoc(null); }} onClose={() => setDeletingDoc(null)} />
    </div>
  );
}
