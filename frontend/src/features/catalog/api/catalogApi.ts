import type {
  Dataset,
  DatasetInput,
  DocumentItem,
  EnvironmentalVariable,
  Graph,
  Model,
  Result,
  Source,
} from "../types/catalog";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

// Contraseña de admin en memoria; se adjunta como header en las mutaciones.
let adminPassword: string | null = null;
export function setAdminPassword(p: string | null) {
  adminPassword = p;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData;
  const headers: Record<string, string> = {};
  if (body && !isForm) headers["Content-Type"] = "application/json";
  if (adminPassword && method !== "GET") headers["X-Admin-Password"] = adminPassword;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? (isForm ? (body as FormData) : JSON.stringify(body)) : undefined,
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
  variables: () => request<EnvironmentalVariable[]>("GET", "/api/variables"),
  results: () => request<Result[]>("GET", "/api/results"),
  graph: () => request<Graph>("GET", "/api/graph"),

  createDataset: (input: DatasetInput) => request<Dataset>("POST", "/api/datasets", input),
  updateDataset: (id: number, input: DatasetInput) =>
    request<Dataset>("PUT", `/api/datasets/${id}`, input),
  deleteDataset: (id: number) => request<null>("DELETE", `/api/datasets/${id}`),

  createDocument: (form: FormData) => request<DocumentItem>("POST", "/api/documents", form),
  updateDocument: (id: number, form: FormData) =>
    request<DocumentItem>("PUT", `/api/documents/${id}`, form),
  deleteDocument: (id: number) => request<null>("DELETE", `/api/documents/${id}`),

  adminVerify: async (password: string): Promise<boolean> => {
    const res = await fetch(`${API}/api/admin/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return res.ok;
  },
};
