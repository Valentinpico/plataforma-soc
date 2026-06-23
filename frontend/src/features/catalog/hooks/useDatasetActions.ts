import { useState } from "react";
import { catalogApi } from "../api/catalogApi";
import type { DatasetInput } from "../types/catalog";

// Hook de acciones: maneja errores internamente, retorna boolean. Nunca lanza.
export function useDatasetActions(onChanged: () => void) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  async function run(fn: () => Promise<unknown>): Promise<boolean> {
    setSaving(true);
    setError(undefined);
    try {
      await fn();
      await onChanged();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    saving,
    error,
    clearError: () => setError(undefined),
    create: (input: DatasetInput) => run(() => catalogApi.createDataset(input)),
    update: (id: number, input: DatasetInput) => run(() => catalogApi.updateDataset(id, input)),
    remove: (id: number) => run(() => catalogApi.deleteDataset(id)),
  };
}
