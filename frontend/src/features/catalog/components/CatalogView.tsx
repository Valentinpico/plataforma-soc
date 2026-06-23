import { useState } from "react";
import { useAdmin } from "../../../shared/auth/AdminContext";
import { Button } from "../../../shared/components/Button";
import { ConfirmModal } from "../../../shared/components/ConfirmModal";
import { Tabs } from "../../../shared/components/Tabs";
import { useCatalog } from "../hooks/useCatalog";
import { useDatasetActions } from "../hooks/useDatasetActions";
import { useDocumentActions } from "../hooks/useDocumentActions";
import type { Dataset, DocumentItem, Model } from "../types/catalog";
import { DatasetFormModal } from "./DatasetFormModal";
import { DatasetTable } from "./DatasetTable";
import { DocumentDetailModal } from "./DocumentDetailModal";
import { DocumentFormModal } from "./DocumentFormModal";
import { DocumentList } from "./DocumentList";
import { GraphView } from "./GraphView";
import { MetricsTable } from "./MetricsTable";
import { ModelDetailModal } from "./ModelDetailModal";
import { ModelList } from "./ModelList";
import { ResourceList } from "./ResourceList";

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

  const [tab, setTab] = useState("grafo");
  const [editing, setEditing] = useState<Dataset | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Dataset | null>(null);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [viewingModel, setViewingModel] = useState<Model | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null | undefined>(undefined);
  const [deletingDoc, setDeletingDoc] = useState<DocumentItem | null>(null);

  if (loading) return <p className="text-muted">Cargando catálogo…</p>;
  if (error) return <p className="text-error">Error: {error}</p>;
  if (!data) return null;

  const confirmDeleteDataset = async () => {
    if (deleting) await datasetActions.remove(deleting.id);
    setDeleting(null);
  };
  const confirmDeleteDoc = async () => {
    if (deletingDoc) await documentActions.remove(deletingDoc.id);
    setDeletingDoc(null);
  };

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
            <DatasetTable
              datasets={data.datasets}
              canEdit={isAdmin}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          </section>
          <div className="grid gap-8 sm:grid-cols-2">
            <ResourceList
              title="Variables ambientales"
              items={data.variables.map((v) => (v.unit ? `${v.name} (${v.unit})` : v.name))}
            />
            <ResourceList
              title="Fuentes"
              items={data.sources.map((s) => (s.type ? `${s.name} · ${s.type}` : s.name))}
            />
          </div>
        </div>
      )}

      {tab === "modelos" && (
        <div className="space-y-8">
          <section>
            <h2 className="mb-2 font-display text-lg text-token">
              Modelos <span className="text-muted">({data.models.length})</span>
            </h2>
            <ModelList models={data.models} onSelect={setViewingModel} />
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
      <DatasetFormModal
        open={editing !== undefined}
        dataset={editing ?? null}
        sources={data.sources}
        onClose={() => setEditing(undefined)}
        onChanged={reload}
      />
      <ConfirmModal
        open={deleting !== null}
        title="Borrar dataset"
        message={`¿Borrar "${deleting?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDeleteDataset}
        onClose={() => setDeleting(null)}
      />

      <ModelDetailModal model={viewingModel} onClose={() => setViewingModel(null)} />

      <DocumentDetailModal
        doc={viewingDoc}
        onClose={() => setViewingDoc(null)}
        onEdit={isAdmin ? (d) => { setViewingDoc(null); setEditingDoc(d); } : undefined}
        onDelete={isAdmin ? (d) => { setViewingDoc(null); setDeletingDoc(d); } : undefined}
      />
      <DocumentFormModal
        open={editingDoc !== undefined}
        doc={editingDoc ?? null}
        onClose={() => setEditingDoc(undefined)}
        onChanged={reload}
      />
      <ConfirmModal
        open={deletingDoc !== null}
        title="Borrar documento"
        message={`¿Borrar "${deletingDoc?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDeleteDoc}
        onClose={() => setDeletingDoc(null)}
      />
    </div>
  );
}
