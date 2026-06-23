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
    <ul className="space-y-1">
      {models.map((m) => (
        <li
          key={m.id}
          className="flex items-center justify-between gap-3 rounded-md bg-surface px-3 py-2 text-sm"
        >
          <button onClick={() => onSelect(m)} className="flex min-w-0 flex-1 items-center gap-2 text-left text-token">
            <span className="truncate">{m.name}</span>
            {m.architecture && <Badge tone="accent">{m.architecture}</Badge>}
          </button>
          {canEdit && (
            <span className="flex shrink-0 gap-2">
              <Button variant="ghost" onClick={() => onEdit(m)}>Editar</Button>
              <Button variant="danger" onClick={() => onDelete(m)}>Borrar</Button>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
