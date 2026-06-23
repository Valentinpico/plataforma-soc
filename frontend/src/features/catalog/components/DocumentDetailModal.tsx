import { Badge } from "../../../shared/components/Badge";
import { Button } from "../../../shared/components/Button";
import { Modal } from "../../../shared/components/Modal";
import type { DocumentItem } from "../types/catalog";
import { docUrl, isExternal } from "../utils/docUrl";

interface Props {
  doc: DocumentItem | null;
  onClose: () => void;
  onEdit?: (doc: DocumentItem) => void;
  onDelete?: (doc: DocumentItem) => void;
}

export function DocumentDetailModal({ doc, onClose, onEdit, onDelete }: Props) {
  const url = docUrl(doc?.filePath);

  return (
    <Modal open={doc !== null} onClose={onClose} title={doc?.title ?? ""}>
      {doc && (
        <div className="space-y-3 text-sm">
          {doc.type && <Badge tone="accent">{doc.type}</Badge>}
          {doc.authors && (
            <p className="text-token">
              <span className="text-muted">Autores: </span>
              {doc.authors}
            </p>
          )}
          {doc.description && <p className="text-muted">{doc.description}</p>}

          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="ghost" onClick={() => onEdit(doc)}>Editar</Button>
              )}
              {onDelete && (
                <Button variant="danger" onClick={() => onDelete(doc)}>Borrar</Button>
              )}
            </div>
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Button>{isExternal(doc.filePath) ? "Abrir DOI ↗" : "Ver PDF ↗"}</Button>
              </a>
            ) : (
              <span className="text-muted">Sin enlace</span>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
