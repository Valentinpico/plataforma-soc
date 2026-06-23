import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { ConfirmModal } from "../../../shared/components/ConfirmModal";
import { useCatalog } from "../hooks/useCatalog";
import { useDatasetActions } from "../hooks/useDatasetActions";
import type { Dataset } from "../types/catalog";
import { DatasetFormModal } from "./DatasetFormModal";
import { DatasetTable } from "./DatasetTable";
import { GraphView } from "./GraphView";
import { ResourceList } from "./ResourceList";

export function CatalogView() {
  const { data, loading, error, reload } = useCatalog();
  const actions = useDatasetActions(reload);
  const [editing, setEditing] = useState<Dataset | null | undefined>(undefined); // undefined=cerrado, null=nuevo
  const [deleting, setDeleting] = useState<Dataset | null>(null);

  if (loading) return <p className="text-muted">Cargando catálogo…</p>;
  if (error) return <p className="text-error">Error: {error}</p>;
  if (!data) return null;

  const confirmDelete = async () => {
    if (deleting) await actions.remove(deleting.id);
    setDeleting(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-surface-2 p-4">
        <h2 className="mb-2 font-display text-lg text-token">Grafo de conocimiento</h2>
        <GraphView graph={data.graph} />
      </section>

      <div className="space-y-6">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg text-token">Datasets</h2>
            <Button onClick={() => setEditing(null)}>+ Nuevo</Button>
          </div>
          <DatasetTable datasets={data.datasets} onEdit={setEditing} onDelete={setDeleting} />
        </section>

        <ResourceList title="Modelos" items={data.models.map((m) => m.name)} />
        <ResourceList title="Documentos" items={data.documents.map((d) => d.title)} />
      </div>

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
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
