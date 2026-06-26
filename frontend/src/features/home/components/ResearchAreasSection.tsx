// T10 — Investigaciones por área: las publicaciones del equipo agrupadas por
// clasificación (T9). Al elegir un área se listan las investigaciones relacionadas,
// con los miembros del equipo que las firman enlazados a su perfil.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { researchers } from "../data/researchers";
import { publicationsBySlug } from "../data/publications";
import { researchCategories, categoryName } from "../data/classifications";
import { SectionHeader } from "./SectionHeader";

interface FlatPaper {
  title: string;
  year: number;
  file?: string;
  topics: string[];
  authors: string[]; // slugs de miembros del equipo
}

const nameOf = (slug: string) => researchers.find((r) => r.id === slug)?.fullName ?? slug;

export function ResearchAreasSection() {
  const papers = useMemo(() => {
    const byKey = new Map<string, FlatPaper>();
    for (const r of researchers)
      for (const p of publicationsBySlug[r.id] ?? []) {
        const key = `${p.title.toLowerCase()}|${p.year}`;
        const e = byKey.get(key) ?? { title: p.title, year: p.year, file: p.file, topics: p.topics ?? [], authors: [] };
        if (!e.authors.includes(r.id)) e.authors.push(r.id);
        byKey.set(key, e);
      }
    return [...byKey.values()];
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of papers) for (const t of p.topics) c[t] = (c[t] ?? 0) + 1;
    return c;
  }, [papers]);

  const cats = researchCategories.filter((c) => counts[c.id]);
  const [active, setActive] = useState<string>(cats[0]?.id ?? "");

  const list = papers
    .filter((p) => p.topics.includes(active))
    .sort((a, b) => b.year - a.year)
    .slice(0, 12);

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader index="05" eyebrow="Producción científica" title="Investigaciones por área" />

        <div className="mb-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                active === c.id
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border text-muted hover:border-accent/40 hover:text-token"
              }`}
            >
              {c.name} <span className="font-mono text-xs opacity-70">{counts[c.id]}</span>
            </button>
          ))}
        </div>

        <div className="on-scroll space-y-3">
          {list.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface-2 p-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-medium leading-snug text-token">{p.title}</h3>
                <span className="shrink-0 font-mono text-xs text-muted">{p.year || ""}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                {p.authors.map((s) => (
                  <Link key={s} to={`/equipo/${s}`} className="text-accent underline underline-offset-2 hover:opacity-80">
                    {nameOf(s)}
                  </Link>
                ))}
                {p.file && (
                  <a href={p.file} target="_blank" rel="noopener noreferrer" className="ml-auto underline underline-offset-2 hover:text-token">
                    Ver publicación →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">{categoryName(active)}: {counts[active]} investigaciones del equipo.</p>
      </div>
    </section>
  );
}
