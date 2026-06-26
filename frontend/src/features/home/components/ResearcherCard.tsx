// Tarjeta de investigador — estilo moderno tipo ÁPICE: foto (B/N → color en
// hover) + panel azul con nombre, grado/rol y flecha. Toda la card es un Link.
import { Link } from "react-router-dom";
import type { Researcher } from "../data/researchers";
import { initials } from "../utils/initials";

interface Props {
  researcher: Researcher;
}

export function ResearcherCard({ researcher }: Props) {
  const { id, fullName, degree, role, affiliation, photo } = researcher;

  return (
    <Link
      to={`/equipo/${id}`}
      className="group grid grid-cols-[1fr_1.15fr] overflow-hidden rounded-2xl border border-border transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Foto / avatar */}
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        {photo ? (
          <img
            src={photo}
            alt={fullName}
            className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-display text-3xl font-bold"
            style={{ color: "var(--accent)", background: "var(--accent-muted)" }}
          >
            {initials(fullName)}
          </div>
        )}
      </div>

      {/* Panel */}
      <div
        className="flex flex-col justify-between p-5 text-on-brand"
        style={{ background: "var(--brand-bg)" }}
      >
        <div>
          <p className="font-display text-base font-semibold leading-snug">{fullName}</p>
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider opacity-60">
            {degree} · {role}
          </p>
          <p className="mt-2 line-clamp-2 text-xs leading-snug opacity-75">{affiliation}</p>
        </div>
        <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-on-brand/30 text-sm transition group-hover:border-transparent group-hover:bg-accent">
          →
        </span>
      </div>
    </Link>
  );
}
