// Hero asimétrico: acrónimo + nombre + tagline + CTAs a la izquierda;
// motivo gráfico de red a la derecha. Banda full-bleed bg-brand-bg.
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { coordinator } from "../data/researchers";
import { initials } from "../utils/initials";
import { GraphMotif } from "./GraphMotif";

function CoordinatorBadge() {
  return (
    <div className="mt-6 flex items-center gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-on-accent"
        style={{ background: "var(--accent)" }}
      >
        {initials(coordinator.fullName)}
      </div>
      <div>
        <p className="text-sm font-medium text-on-brand">{coordinator.fullName}</p>
        <p className="text-xs text-on-brand opacity-60">
          {coordinator.degree} · Coordinador · Departamento de Matemática
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-brand-bg text-on-brand"
      style={{ minHeight: "520px" }}
    >
      {/* Motivo de fondo — baja opacidad */}
      <GraphMotif
        className="pointer-events-none absolute right-0 top-0 h-full w-[55%]"
        opacity={0.07}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[3fr_2fr] lg:items-center">
        {/* Columna izquierda — reveal escalonado al cargar */}
        <div>
          <p
            className="reveal-up mb-4 font-mono text-xs uppercase tracking-[0.22em] text-accent-light"
            style={{ animationDelay: "0ms" }}
          >
            EPN · Grupo de Investigación
          </p>

          <h1
            className="reveal-up font-display text-7xl font-bold leading-none tracking-tight text-on-brand sm:text-8xl"
            style={{ animationDelay: "90ms" }}
          >
            META
          </h1>

          <p
            className="reveal-up mt-3 text-base leading-snug text-on-brand/80 sm:text-lg"
            style={{ maxWidth: "520px", animationDelay: "180ms" }}
          >
            Grupo de Investigación en Modelización Estocástica Teórica y
            Aplicada a Sistemas Industriales, Ambientales y Tecnológicos
          </p>

          <p
            className="reveal-up mt-5 font-display text-xl italic leading-snug text-accent-light"
            style={{ maxWidth: "480px", animationDelay: "270ms" }}
          >
            Modelando la incertidumbre del mundo natural con matemáticas, datos y redes de grafos.
          </p>

          <div className="reveal-up" style={{ animationDelay: "360ms" }}>
            <CoordinatorBadge />
          </div>

          <div className="reveal-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "450ms" }}>
            <Link to="/proyectos/soc">
              <Button variant="primary" className="px-5 py-2 text-sm">
                Ver proyecto SOC
              </Button>
            </Link>
            <a
              href="#equipo"
              className="inline-flex items-center rounded-md border border-on-brand/40 px-5 py-2 text-sm font-medium text-on-brand transition hover:bg-on-brand/10"
            >
              Conocé al equipo
            </a>
          </div>
        </div>

        {/* Columna derecha — motivo de grafo two-tone (nodos granate, aristas claras) */}
        <div className="hidden lg:flex lg:items-center lg:justify-end">
          <GraphMotif
            className="float-slow h-80 w-full text-on-brand/70"
            opacity={0.9}
            nodeColor="var(--accent-light)"
          />
        </div>
      </div>
    </section>
  );
}
