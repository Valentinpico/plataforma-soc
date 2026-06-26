// Sección equipo: coordinador destacado + grid de investigadores.
import { coordinator, researchers } from "../data/researchers";
import { initials } from "../utils/initials";
import { ResearcherCard } from "./ResearcherCard";
import { SectionHeader } from "./SectionHeader";
import { Link } from "react-router-dom";

const members = researchers.filter((r) => r.id !== coordinator.id);

export function TeamSection() {
  return (
    <section id="equipo" className="bg-surface-2">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader index="04" eyebrow="Equipo" title="Nuestro equipo de investigación" />

        {/* Coordinador — tarjeta destacada */}
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
            Coordinador
          </p>
          <Link
            to={`/equipo/${coordinator.id}`}
            className="flex items-center gap-5 rounded-2xl border border-accent/30 bg-surface p-6 transition hover:border-accent/60 hover:shadow-md sm:max-w-md"
          >
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold text-on-accent ring-2 ring-accent-muted"
              style={{
                background: "var(--accent)",
              }}
            >
              {coordinator.photo ? (
                <img
                  src={coordinator.photo}
                  alt={coordinator.fullName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials(coordinator.fullName)
              )}
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-token">
                {coordinator.fullName}
              </p>
              <p className="mt-0.5 text-sm text-accent">
                {coordinator.degree} · Coordinador
              </p>
              <p className="mt-0.5 text-xs text-muted">{coordinator.affiliation}</p>
            </div>
          </Link>
        </div>

        {/* Resto del equipo */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
            Miembros y colaboradores
          </p>
          <div className="on-scroll grid gap-4 sm:grid-cols-2">
            {members.map((r) => (
              <ResearcherCard key={r.id} researcher={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
