import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Modal } from "../../../shared/components/Modal";
import { catalogApi } from "../api/catalogApi";
import { useEntityActions } from "../hooks/useEntityActions";
import type { EnvironmentalVariable, VariableInput } from "../types/catalog";

const api = {
  create: catalogApi.createVariable,
  update: catalogApi.updateVariable,
  remove: catalogApi.deleteVariable,
};

interface Props {
  open: boolean;
  onClose: () => void;
  variable: EnvironmentalVariable | null;
  onChanged: () => Promise<void>;
}

export function VariableFormModal({ open, onClose, variable, onChanged }: Props) {
  const { saving, error, create, update } = useEntityActions<VariableInput>(api, onChanged);
  const [form, setForm] = useState<VariableInput>({ name: "" });

  const key = variable?.id ?? "new";
  const [lastKey, setLastKey] = useState<string | number>();
  if (key !== lastKey) {
    setLastKey(key);
    setForm(variable ? { name: variable.name, unit: variable.unit, description: variable.description } : { name: "" });
  }

  const set = (patch: Partial<VariableInput>) => setForm((f) => ({ ...f, ...patch }));
  const submit = async () => {
    const ok = variable ? await update(variable.id, form) : await create(form);
    if (ok) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={variable ? "Editar variable" : "Nueva variable"}>
      <div className="space-y-3">
        <Input label="Nombre" value={form.name} onChange={(e) => set({ name: e.target.value })} />
        <Input label="Unidad" value={form.unit ?? ""} onChange={(e) => set({ unit: e.target.value || undefined })} />
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
