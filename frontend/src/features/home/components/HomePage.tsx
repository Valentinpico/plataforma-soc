import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { team } from "../data/team";
import { TeamCard } from "./TeamCard";

export function HomePage() {
  return (
    <div className="space-y-16">
      <section className="max-w-3xl pt-8">
        <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
          Proyecto PIS-24-09
        </p>
        <h1 className="font-display text-4xl leading-tight text-token sm:text-5xl">
          Estimación del Carbono Orgánico del Suelo mediante Redes Neuronales de Grafos
        </h1>
        <p className="mt-5 text-lg text-muted">
          Plataforma web para la gestión, visualización y consulta del carbono orgánico
          del suelo (SOC) en Ecuador, a partir de datos geoespaciales multimodales y
          modelos de aprendizaje automático.
        </p>
        <div className="mt-7">
          <Link to="/catalogo">
            <Button>Explorar el catálogo →</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { k: "Departamento", v: "Biología — EPN" },
          { k: "Línea de investigación", v: "Ecología" },
          { k: "Duración", v: "May 2025 – Oct 2026" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-border bg-surface-2 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{s.k}</p>
            <p className="mt-1 font-medium text-token">{s.v}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-5 font-display text-2xl text-token">Equipo del proyecto</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {team.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
