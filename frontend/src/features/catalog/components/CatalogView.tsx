import { useState } from "react";
import { useAdmin } from "../../../shared/auth/AdminContext";
import { Button } from "../../../shared/components/Button";
import { ConfirmModal } from "../../../shared/components/ConfirmModal";
import { Tabs } from "../../../shared/components/Tabs";
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

const TABS = [
  { id: "grafo", label: "Grafo" },
  { id: "datos", label: "Datos" },
  { id: "modelos", label: "Modelos" },
  { id: "documentos", label: "Documentos" },
];

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

  const [tab, setTab] = useState("grafo");
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
    <div className="space-y-6">
      {!isAdmin && (
        <p className="rounded-md bg-surface-2 px-3 py-2 text-sm text-muted">
          Modo lectura. Usá <span className="text-token">“Administrar”</span> (arriba) para
          habilitar la edición.
        </p>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "grafo" && (
        <section className="rounded-xl border border-border bg-surface-2 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg text-token">Grafo de conocimiento</h2>
            <span className="text-xs text-muted">Pasá el mouse para ver · arrastrá / zoom</span>
          </div>
          <GraphView graph={data.graph} />
        </section>
      )}

      {tab === "datos" && (
        <div className="space-y-8">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg text-token">Datasets</h2>
              {isAdmin && <Button onClick={() => setEditing(null)}>+ Nuevo</Button>}
            </div>
            <DatasetTable datasets={data.datasets} canEdit={isAdmin} onEdit={setEditing} onDelete={setDeleting} />
          </section>

          <div className="grid gap-8 sm:grid-cols-2">
            <section>
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
              />
            </section>
            <section>
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
              />
            </section>
          </div>
        </div>
      )}

      {tab === "modelos" && (
        <div className="space-y-8">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg text-token">
                Modelos <span className="text-muted">({data.models.length})</span>
              </h2>
              {isAdmin && <Button onClick={() => setEditingModel(null)}>+ Nuevo</Button>}
            </div>
            <ModelList
              models={data.models}
              onSelect={setViewingModel}
              canEdit={isAdmin}
              onEdit={setEditingModel}
              onDelete={setDeletingModel}
            />
          </section>
          <section>
            <h2 className="mb-3 font-display text-lg text-token">Resultados — métricas en prueba</h2>
            <MetricsTable results={data.results} />
          </section>
        </div>
      )}

      {tab === "documentos" && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg text-token">
              Documentos <span className="text-muted">({data.documents.length})</span>
            </h2>
            {isAdmin && <Button onClick={() => setEditingDoc(null)}>+ Subir</Button>}
          </div>
          <DocumentList documents={data.documents} onSelect={setViewingDoc} />
        </section>
      )}

      {/* Modales (siempre montados) */}
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
