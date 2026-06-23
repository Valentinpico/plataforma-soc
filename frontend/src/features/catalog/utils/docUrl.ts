const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/**
 * Resuelve el enlace de un documento:
 * - DOI / URL externa → tal cual.
 * - Ruta local (data/...) → servida por el backend en /files.
 */
export function docUrl(filePath?: string): string | undefined {
  if (!filePath) return undefined;
  if (filePath.startsWith("http")) return filePath;
  return `${API}/files/${filePath.replace(/^data\//, "")}`;
}

export function isExternal(filePath?: string): boolean {
  return !!filePath?.startsWith("http");
}
