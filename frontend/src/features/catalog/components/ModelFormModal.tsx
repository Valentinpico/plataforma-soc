import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Select } from "../../../shared/components/Select";
import { Modal } from "../../../shared/components/Modal";
import { catalogApi } from "../api/catalogApi";
import { useEntityActions } from "../hooks/useEntityActions";
import type { Model, ModelInput } from "../types/catalog";

const api = {
  create: catalogApi.createModel,
  update: catalogApi.updateModel,
  remove: catalogApi.deleteModel,
};

const SCHEMES = ["inductivo", "transductivo"];

interface Props {
  open: boolean;
  onClose: () => void;
  model: Model | null;
  onChanged: () => Promise<void>;
}

export function ModelFormModal({ open, onClose, model, onChanged }: Props) {
  const { saving, error, create, update } = useEntityActions<ModelInput>(api, onChanged);
  const [form, setForm] = useState<ModelInput>({ name: "" });

  const key = model?.id ?? "new";
  const [lastKey, setLastKey] = useState<string | number>();
  if (key !== lastKey) {
    setLastKey(key);
    setForm(
      model
        ? {
            name: model.name,
            architecture: model.architecture,
            scheme: model.scheme,
            framework: model.framework,
            codePointer: model.codePointer,
            description: model.description,
          }
        : { name: "" }
    );
  }

  const set = (patch: Partial<ModelInput>) => setForm((f) => ({ ...f, ...patch }));
  const submit = async () => {
    const ok = model ? await update(model.id, form) : await create(form);
    if (ok) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={model ? "Editar modelo" : "Nuevo modelo"}>
      <div className="space-y-3">
        <Input label="Nombre" value={form.name} onChange={(e) => set({ name: e.target.value })} />
        <Input label="Arquitectura" value={form.architecture ?? ""} onChange={(e) => set({ architecture: e.target.value || undefined })} />
        <Select label="Esquema" value={form.scheme ?? ""} onChange={(e) => set({ scheme: e.target.value || undefined })}>
          <option value="">—</option>
          {SCHEMES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Input label="Framework" value={form.framework ?? ""} onChange={(e) => set({ framework: e.target.value || undefined })} />
        <Input label="Notebook / código" value={form.codePointer ?? ""} onChange={(e) => set({ codePointer: e.target.value || undefined })} />
        <Input label="Descripción" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value || undefined })} />
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
        </div>
      </div>
    </Modal>
  );
}
