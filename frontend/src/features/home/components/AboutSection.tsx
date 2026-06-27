// Sección "¿Para qué es el grupo META?" — objetivo y ODS asociados.
import { GraphMotif } from "./GraphMotif";
import { SectionHeader } from "./SectionHeader";

const ODS = [
  { num: 6, label: "Agua Limpia" },
  { num: 9, label: "Industria e Innovación" },
  { num: 12, label: "Producción Responsable" },
  { num: 13, label: "Acción por el Clima" },
  { num: 15, label: "Vida de Ecosistemas Terrestres" },
];

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-surface-2">
      {/* Motivo de grafo como acento decorativo derecho */}
      <GraphMotif
        className="pointer-events-none absolute -right-8 top-0 h-full w-64 text-accent"
        opacity={0.06}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <SectionHeader index="01" eyebrow="Sobre el grupo" title="¿Para qué es META?" />

        <div className="on-scroll mb-12 flex justify-center">
          <img
            src="/logo-meta.png"
            alt="Grupo META — Modelización Estocástica Teórica y Aplicada"
            className="h-40 w-auto sm:h-52"
          />
        </div>

        <div className="on-scroll grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4 text-base leading-relaxed text-muted">
            <p>
              META genera metodologías, modelos y herramientas de análisis,
              predicción, optimización y apoyo a la toma de decisiones en
              sistemas industriales, ambientales y tecnológicos complejos.
              Combina modelización estocástica, teoría de probabilidades,
              estadística avanzada, inteligencia artificial y ciencia de datos
              para representar la incertidumbre presente en fenómenos del mundo
              real.
            </p>
            <p>
              El grupo articula investigación teórica y aplicada: desde el
              desarrollo de marcos probabilísticos rigurosos hasta la
              implementación de plataformas computacionales que permiten
              visualizar, analizar y proyectar variables ambientales clave —
              como el carbono orgánico del suelo, los recursos hídricos y los
              patrones de clima — con soporte en redes neuronales de grafos
              (GNN) y modelos estadísticos de última generación.
            </p>
          </div>

          {/* ODS chips */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
              ODS asociados
            </p>
            <div className="flex flex-wrap gap-2">
              {ODS.map((o) => (
                <span
                  key={o.num}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-token"
                >
                  <span
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold text-on-accent"
                    style={{ background: "var(--accent)" }}
                  >
                    {o.num}
                  </span>
                  {o.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
