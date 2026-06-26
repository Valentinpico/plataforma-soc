// Perfil individual de investigador — ruta /equipo/:id
// Renderiza dentro del wrapper Contained (max-w-6xl) definido en App.tsx.
import { Link, useParams } from "react-router-dom";
import { researchers } from "../data/researchers";
import { researchLines } from "../data/researchLines";
import { publicationsBySlug } from "../data/publications";
import { experienceBySlug } from "../data/experience";
import { PapersList } from "./PapersList";
import { KnowledgeGraph } from "./KnowledgeGraph";
import { ResearcherHeader } from "./ResearcherHeader";

export function ResearcherProfile() {
  const { id } = useParams<{ id: string }>();
  const researcher = researchers.find((r) => r.id === id);

  if (!researcher) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl text-token">Investigador no encontrado</p>
        <p className="mt-3 text-muted">No existe un perfil para el identificador solicitado.</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-accent underline underline-offset-2 hover:opacity-80"
        >
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const { lines } = researcher;
  // Publicaciones: las del roster más las del registro de publicaciones.
  const papers = [...researcher.papers, ...(publicationsBySlug[researcher.id] ?? [])];
  const experience = experienceBySlug[researcher.id] ?? [];

  const resolvedLines = lines
    .map((code) => researchLines.find((l) => l.code === code))
    .filter(Boolean) as typeof researchLines;

  // Resumen factual cuando no hay bio escrita (rol + adscripción + producción).
  const years = papers.map((p) => p.year).filter((y): y is number => !!y);
  const span = years.length ? ` entre ${Math.min(...years)} y ${Math.max(...years)}` : "";
  const lineNames = resolvedLines.map((l) => l.name).join(" y ");
  const bioText =
    researcher.bio ||
    `${researcher.degree}, ${researcher.role.toLowerCase()} del grupo de investigación META` +
      (lineNames ? `, con líneas de trabajo en ${lineNames}` : "") +
      `. Adscripción: ${researcher.affiliation}.` +
      (papers.length ? ` Registra ${papers.length} publicaciones científicas${span}.` : "");

  return (
    <div className="space-y-10 py-2">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-token"
      >
        ← Volver al grupo META
      </Link>

      <ResearcherHeader researcher={researcher} resolvedLines={resolvedLines} />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-7">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-accent">Perfil</p>
          <p className="text-base leading-relaxed text-muted">{bioText}</p>
        </section>
        <section className="rounded-2xl border border-border bg-surface p-7">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-accent">
            Grafo de conocimiento
          </p>
          <KnowledgeGraph papers={papers} />
          <p className="mt-3 text-xs text-muted">
            Áreas de investigación según sus publicaciones; las líneas unen temas
            que aparecen juntos en un mismo trabajo.
          </p>
        </section>
      </div>

      {experience.length > 0 && (
        <section>
          <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
            <h2 className="font-display text-2xl text-token sm:text-3xl">Experiencia en proyectos</h2>
            <span className="nums font-mono text-sm text-muted">{experience.length}</span>
          </div>
          <ol className="space-y-4">
            {experience.map((e, i) => (
              <li
                key={i}
                className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:gap-5"
              >
                <span className="nums shrink-0 font-mono text-xs text-accent sm:w-24">{e.period}</span>
                <div>
                  <p className="font-medium leading-snug text-token">{e.title}</p>
                  {e.role && <p className="mt-1 text-sm text-muted">{e.role}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="font-display text-2xl text-token sm:text-3xl">Publicaciones</h2>
          <span className="nums font-mono text-sm text-muted">{papers.length} trabajos</span>
        </div>
        <PapersList papers={papers} />
      </section>
    </div>
  );
}
