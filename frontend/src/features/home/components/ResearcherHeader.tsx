// Bloque de encabezado del perfil: avatar, nombre, grado, rol, líneas.
import type { Researcher } from "../data/researchers";
import type { ResearchLine } from "../data/researchLines";
import { initials } from "../utils/initials";
import { emailBySlug } from "../data/contact";
import { GraphMotif } from "./GraphMotif";

interface Props {
  researcher: Researcher;
  resolvedLines: ResearchLine[];
}

export function ResearcherHeader({ researcher, resolvedLines }: Props) {
  const { fullName, degree, role, affiliation, photo } = researcher;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{ background: "var(--brand-bg)" }}
    >
      <GraphMotif
        className="pointer-events-none absolute right-0 top-0 h-full w-64 text-on-brand"
        opacity={0.07}
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        {photo ? (
          <img
            src={photo}
            alt={fullName}
            className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-accent"
          />
        ) : (
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full font-display text-2xl font-bold text-on-accent ring-2 ring-accent-muted"
            style={{ background: "var(--accent)" }}
          >
            {initials(fullName)}
          </div>
        )}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-on-brand opacity-60">
            Grupo META · EPN
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-on-brand">{fullName}</h1>
          <p className="mt-1 text-sm text-on-brand opacity-80">
            {degree} · {role} · {affiliation}
          </p>
          {emailBySlug[researcher.id] && (
            <a
              href={`mailto:${emailBySlug[researcher.id]}`}
              className="mt-1 inline-block font-mono text-xs text-on-brand underline underline-offset-2 opacity-70 transition hover:opacity-100"
            >
              {emailBySlug[researcher.id]}
            </a>
          )}
          {resolvedLines.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {resolvedLines.map((l) => (
                <span
                  key={l.code}
                  className="rounded-full px-3 py-0.5 font-mono text-xs font-medium text-on-accent"
                  style={{ background: "var(--accent)" }}
                >
                  {l.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
