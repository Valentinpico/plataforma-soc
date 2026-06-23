import { Badge } from "../../../shared/components/Badge";
import type { Model } from "../types/catalog";

interface Props {
  models: Model[];
  onSelect: (m: Model) => void;
}

export function ModelList({ models, onSelect }: Props) {
  return (
    <ul className="space-y-1">
      {models.map((m) => (
        <li key={m.id}>
          <button
            onClick={() => onSelect(m)}
            className="flex w-full items-center justify-between gap-3 rounded-md bg-surface px-3 py-2 text-left text-sm text-token transition hover:bg-surface-2"
          >
            <span className="min-w-0 flex-1 truncate">{m.name}</span>
            {m.architecture && <Badge tone="accent">{m.architecture}</Badge>}
          </button>
        </li>
      ))}
    </ul>
  );
}
