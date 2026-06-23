import type { Dataset, DatasetInput, DocumentItem, Graph, Model, Source } from "../types/catalog";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `${path} → ${res.status}`);
  }
  return (res.status === 204 ? null : await res.json()) as T;
}

export const catalogApi = {
  sources: () => request<Source[]>("GET", "/api/sources"),
  datasets: () => request<Dataset[]>("GET", "/api/datasets"),
  models: () => request<Model[]>("GET", "/api/models"),
  documents: () => request<DocumentItem[]>("GET", "/api/documents"),
  graph: () => request<Graph>("GET", "/api/graph"),

  createDataset: (input: DatasetInput) => request<Dataset>("POST", "/api/datasets", input),
  updateDataset: (id: number, input: DatasetInput) =>
    request<Dataset>("PUT", `/api/datasets/${id}`, input),
  deleteDataset: (id: number) => request<null>("DELETE", `/api/datasets/${id}`),
};
