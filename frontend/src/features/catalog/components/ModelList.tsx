import { Badge } from "../../../shared/components/Badge";
import { Button } from "../../../shared/components/Button";
import type { Model } from "../types/catalog";

interface Props {
  models: Model[];
  onSelect: (m: Model) => void;
  canEdit: boolean;
  onEdit: (m: Model) => void;
  onDelete: (m: Model) => void;
}

export function ModelList({ models, onSelect, canEdit, onEdit, onDelete }: Props) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {models.map((m) => (
        <li key={m.id} className="relative">
          {/* Card clickeable — abre el detalle del modelo */}
          <button
            onClick={() => onSelect(m)}
            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
          >
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate font-medium text-token">{m.name}</span>
                {m.architecture && <Badge tone="accent">{m.architecture}</Badge>}
              </span>
              {m.scheme && <span className="mt-1 block text-xs text-muted">Esquema {m.scheme}</span>}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm text-muted transition group-hover:border-transparent group-hover:bg-accent group-hover:text-on-accent">
              →
            </span>
          </button>
          {canEdit && (
            <span className="absolute right-3 top-3 flex gap-2">
              <Button variant="ghost" onClick={() => onEdit(m)}>Editar</Button>
              <Button variant="danger" onClick={() => onDelete(m)}>Borrar</Button>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
