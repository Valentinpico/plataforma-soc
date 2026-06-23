import { useState } from "react";
import { catalogApi } from "../api/catalogApi";

// Hook de acciones de documentos: maneja errores, retorna boolean. Nunca lanza.
export function useDocumentActions(onChanged: () => Promise<void> | void) {
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
    create: (form: FormData) => run(() => catalogApi.createDocument(form)),
    update: (id: number, form: FormData) => run(() => catalogApi.updateDocument(id, form)),
    remove: (id: number) => run(() => catalogApi.deleteDocument(id)),
  };
}
