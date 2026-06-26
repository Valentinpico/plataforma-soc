import { Badge } from "../../../shared/components/Badge";
import { Button } from "../../../shared/components/Button";

interface Props<T extends { id: number }> {
  items: T[];
  label: (item: T) => string;
  canEdit: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  display?: "list" | "badges";
  badgeTone?: "accent" | "neutral";
}

export function ManagedList<T extends { id: number }>({
  items,
  label,
  canEdit,
  onEdit,
  onDelete,
  display = "list",
  badgeTone = "neutral",
}: Props<T>) {
  // Modo badges (solo lectura): chips compactos en flex-wrap.
  if (display === "badges" && !canEdit) {
    if (items.length === 0) return <p className="text-sm italic text-muted">Sin registros.</p>;
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <Badge key={it.id} tone={badgeTone}>
            {label(it)}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {items.map((it) => (
        <li
          key={it.id}
          className="flex items-center justify-between gap-3 rounded-md bg-surface px-3 py-2 text-sm"
        >
          <span className="min-w-0 flex-1 truncate text-token">{label(it)}</span>
          {canEdit && (
            <span className="flex shrink-0 gap-2">
              <Button variant="ghost" onClick={() => onEdit(it)}>Editar</Button>
              <Button variant="danger" onClick={() => onDelete(it)}>Borrar</Button>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
