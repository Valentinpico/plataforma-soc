import { Badge } from "../../../shared/components/Badge";
import type { DocumentItem } from "../types/catalog";

const tone: Record<string, "accent" | "success" | "warning" | "neutral"> = {
  informe: "accent",
  paper: "success",
  oficio: "warning",
};

interface Props {
  documents: DocumentItem[];
  onSelect: (doc: DocumentItem) => void;
}

export function DocumentList({ documents, onSelect }: Props) {
  return (
    <ul className="space-y-1">
      {documents.map((doc) => (
        <li key={doc.id}>
          <button
            onClick={() => onSelect(doc)}
            className="flex w-full items-center justify-between gap-3 rounded-md bg-surface px-3 py-2 text-left text-sm text-token transition hover:bg-surface-2"
          >
            <span className="min-w-0 flex-1 truncate">{doc.title}</span>
            {doc.type && <Badge tone={tone[doc.type] ?? "neutral"}>{doc.type}</Badge>}
          </button>
        </li>
      ))}
    </ul>
  );
}
