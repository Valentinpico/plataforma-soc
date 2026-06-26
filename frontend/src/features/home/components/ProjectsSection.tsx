// Sección proyectos: card del proyecto SOC + nota de futuros proyectos.
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { categoryName } from "../data/classifications";
import { SectionHeader } from "./SectionHeader";

// Clasificaciones (T9) asociadas al proyecto SOC.
const socCategories = ["suelo", "geoespacial", "ia", "ambiental"];

export function ProjectsSection() {
  return (
    <section id="proyectos" className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader index="06" eyebrow="Proyectos" title="Proyectos de investigación" />

        {/* Card — Proyecto SOC */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-sm sm:flex">
          {/* Acento lateral */}
          <div className="w-2 shrink-0 sm:w-1.5" style={{ background: "var(--accent)" }} />

          <div className="flex flex-1 flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex-1">
              <p className="font-mono text-xs text-muted">PIS-24-09 · En curso</p>
              <h3 className="mt-1 font-display text-xl font-semibold leading-snug text-token">
                Estimación del Carbono Orgánico del Suelo mediante Redes Neuronales de Grafos
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Plataforma web para la gestión, visualización y consulta del carbono orgánico del
                suelo (SOC) en Ecuador. Combina datos geoespaciales multimodales con modelos
                GraphSAGE y GAT para generar predicciones y análisis de incertidumbre sobre el
                stock de carbono a nivel provincial.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {socCategories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-accent-muted px-3 py-0.5 font-mono text-xs text-accent"
                  >
                    {categoryName(c)}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 self-end sm:self-center">
              <Link to="/proyectos/soc">
                <Button variant="primary" className="px-5 py-2">
                  Explorar proyecto →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Nota de futuros proyectos */}
        <p className="mt-6 text-sm text-muted">
          Más proyectos del grupo META se sumarán como fichas informativas a medida que avancen.
        </p>
      </div>
    </section>
  );
}
