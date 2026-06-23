import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Select } from "../../../shared/components/Select";
import { Modal } from "../../../shared/components/Modal";
import { useDatasetActions } from "../hooks/useDatasetActions";
import type { Dataset, DatasetInput, Source } from "../types/catalog";

interface Props {
  open: boolean;
  onClose: () => void;
  dataset: Dataset | null; // null = crear
  sources: Source[];
  onChanged: () => Promise<void>;
}

const TYPES = ["campo", "satelital", "climatico", "topografico"];

export function DatasetFormModal({ open, onClose, dataset, sources, onChanged }: Props) {
  const { saving, error, create, update } = useDatasetActions(onChanged);
  const [form, setForm] = useState<DatasetInput>({ name: "" });

  // Sincroniza el form cuando cambia el dataset a editar.
  const key = dataset?.id ?? "new";
  const [lastKey, setLastKey] = useState<string | number>();
  if (key !== lastKey) {
    setLastKey(key);
    setForm(
      dataset
        ? { name: dataset.name, type: dataset.type, description: dataset.description, sourceId: dataset.sourceId }
        : { name: "" }
    );
  }

  const set = (patch: Partial<DatasetInput>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async () => {
    const ok = dataset ? await update(dataset.id, form) : await create(form);
    if (ok) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={dataset ? "Editar dataset" : "Nuevo dataset"}>
      <div className="space-y-3">
        <Input label="Nombre" value={form.name} onChange={(e) => set({ name: e.target.value })} />
        <Select label="Tipo" value={form.type ?? ""} onChange={(e) => set({ type: e.target.value || undefined })}>
          <option value="">—</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        <Input label="Descripción" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value || undefined })} />
        <Select
          label="Fuente"
          value={form.sourceId ?? ""}
          onChange={(e) => set({ sourceId: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">—</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
        </div>
      </div>
    </Modal>
  );
}
