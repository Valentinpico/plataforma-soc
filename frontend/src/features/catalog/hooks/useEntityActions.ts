import { useState } from "react";

interface EntityApi<T> {
  create: (input: T) => Promise<unknown>;
  update: (id: number, input: T) => Promise<unknown>;
  remove: (id: number) => Promise<unknown>;
}

// Hook genérico de acciones CRUD: maneja errores, retorna boolean. Nunca lanza.
export function useEntityActions<T>(api: EntityApi<T>, onChanged: () => Promise<void> | void) {
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
    create: (input: T) => run(() => api.create(input)),
    update: (id: number, input: T) => run(() => api.update(id, input)),
    remove: (id: number) => run(() => api.remove(id)),
  };
}
