import { useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Select } from "../../../shared/components/Select";
import { Modal } from "../../../shared/components/Modal";
import { useDocumentActions } from "../hooks/useDocumentActions";
import type { DocumentItem } from "../types/catalog";

interface Props {
  open: boolean;
  onClose: () => void;
  doc: DocumentItem | null; // null = nuevo
  onChanged: () => Promise<void>;
}

const TYPES = ["informe", "paper", "oficio", "metodologia"];

export function DocumentFormModal({ open, onClose, doc, onChanged }: Props) {
  const { saving, error, create, update } = useDocumentActions(onChanged);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [authors, setAuthors] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const key = doc?.id ?? "new";
  const [lastKey, setLastKey] = useState<string | number>();
  if (key !== lastKey) {
    setLastKey(key);
    setTitle(doc?.title ?? "");
    setType(doc?.type ?? "");
    setAuthors(doc?.authors ?? "");
    setDescription(doc?.description ?? "");
    setLink(doc?.filePath?.startsWith("http") ? doc.filePath : "");
    setFile(null);
  }

  const submit = async () => {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("type", type);
    fd.append("authors", authors);
    fd.append("description", description);
    if (link) fd.append("link", link);
    if (file) fd.append("file", file);
    const ok = doc ? await update(doc.id, fd) : await create(fd);
    if (ok) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={doc ? "Editar documento" : "Subir documento"}>
      <div className="space-y-3">
        <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select label="Tipo" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">—</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        <Input label="Autores" value={authors} onChange={(e) => setAuthors(e.target.value)} />
        <Input label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Enlace / DOI (opcional)" value={link} onChange={(e) => setLink(e.target.value)} />
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Archivo PDF (opcional)</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-token file:mr-3 file:rounded-md file:border file:border-border file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-token"
          />
        </label>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
        </div>
      </div>
    </Modal>
  );
}
