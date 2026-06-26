// Lista de publicaciones: grid de 2 columnas, ordenada por año desc, con
// "ver todas" para perfiles con muchas pubs.
import { useState } from "react";
import { Badge } from "../../../shared/components/Badge";
import { categoryName } from "../data/classifications";
import type { Paper } from "../data/researchers";

interface Props {
  papers: Paper[];
}

const PREVIEW = 12;

export function PapersList({ papers }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (papers.length === 0) {
    return <p className="text-sm italic text-muted">Publicaciones próximamente.</p>;
  }

  const sorted = [...papers].sort((a, b) => b.year - a.year);
  const visible = expanded ? sorted : sorted.slice(0, PREVIEW);
  const hidden = sorted.length - visible.length;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((p, i) => (
          <article
            key={i}
            className="flex flex-col rounded-xl border border-border bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
          >
            <span className="nums mb-2.5 w-fit rounded-full bg-accent-muted px-2.5 py-0.5 font-mono text-xs text-accent">
              {p.year || "s/f"}
            </span>
            <h3 className="line-clamp-3 font-medium leading-snug text-token">{p.title}</h3>
            {p.summary && (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{p.summary}</p>
            )}
            {p.topics && p.topics.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {p.topics.map((t) => (
                  <Badge key={t} tone="neutral">{categoryName(t)}</Badge>
                ))}
              </div>
            )}
            {p.file && (
              <a
                href={p.file}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-3 text-xs font-medium text-accent underline underline-offset-2 hover:opacity-80"
              >
                Ver publicación →
              </a>
            )}
          </article>
        ))}
      </div>

      {hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-6 rounded-full border border-border px-5 py-2 text-sm text-accent transition hover:-translate-y-0.5 hover:border-accent/40"
        >
          Ver todas las {sorted.length} publicaciones →
        </button>
      )}
    </div>
  );
}
