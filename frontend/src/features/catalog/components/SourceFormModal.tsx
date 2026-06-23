import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Modal } from "../../../shared/components/Modal";
import { catalogApi } from "../api/catalogApi";
import { useEntityActions } from "../hooks/useEntityActions";
import type { Source, SourceInput } from "../types/catalog";

const api = {
  create: catalogApi.createSource,
  update: catalogApi.updateSource,
  remove: catalogApi.deleteSource,
};

interface Props {
  open: boolean;
  onClose: () => void;
  source: Source | null;
  onChanged: () => Promise<void>;
}

export function SourceFormModal({ open, onClose, source, onChanged }: Props) {
  const { saving, error, create, update } = useEntityActions<SourceInput>(api, onChanged);
  const [form, setForm] = useState<SourceInput>({ name: "" });

  const key = source?.id ?? "new";
  const [lastKey, setLastKey] = useState<string | number>();
  if (key !== lastKey) {
    setLastKey(key);
    setForm(source ? { name: source.name, type: source.type, description: source.description, url: source.url } : { name: "" });
  }

  const set = (patch: Partial<SourceInput>) => setForm((f) => ({ ...f, ...patch }));
  const submit = async () => {
    const ok = source ? await update(source.id, form) : await create(form);
    if (ok) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={source ? "Editar fuente" : "Nueva fuente"}>
      <div className="space-y-3">
        <Input label="Nombre" value={form.name} onChange={(e) => set({ name: e.target.value })} />
        <Input label="Tipo" value={form.type ?? ""} onChange={(e) => set({ type: e.target.value || undefined })} />
        <Input label="Descripción" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value || undefined })} />
        <Input label="URL" value={form.url ?? ""} onChange={(e) => set({ url: e.target.value || undefined })} />
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
        </div>
      </div>
    </Modal>
  );
}
