// Ámbitos de interés del grupo META (campos de aplicación).
// Cards con ícono circular.

import { SectionHeader } from "./SectionHeader";

const areas: { name: string; blurb: string }[] = [
  { name: "Hidrología y recursos hídricos", blurb: "Modelización de procesos hidrológicos y disponibilidad de agua bajo incertidumbre." },
  { name: "Ecología", blurb: "Dinámica de ecosistemas y procesos ecológicos; base ambiental del proyecto SOC." },
  { name: "Geografía y paisaje", blurb: "Análisis territorial y cambio de uso del suelo con datos geoespaciales." },
  { name: "Meteorología y climatología", blurb: "Caracterización de variables climáticas aplicadas a sistemas ambientales." },
  { name: "Ciencia e ingeniería de materiales", blurb: "Modelado de propiedades físicas, químicas y mecánicas de materiales." },
  { name: "Metrología", blurb: "Cuantificación de incertidumbre de medición y aseguramiento metrológico." },
  { name: "Ingeniería de polímeros", blurb: "Análisis y optimización de procesos de diseño y caracterización de polímeros." },
  { name: "Sistemas industriales avanzados", blurb: "Análisis, predicción y optimización de procesos y operaciones industriales." },
];

function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
      <circle cx="6" cy="8" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="17" r="2" />
      <path d="M7.7 9.2l8.6-1.4M7.4 9.6l3.6 6M16.5 8.7l-3.7 6.6" />
    </svg>
  );
}

export function FocusAreasSection() {
  return (
    <section className="bg-surface-2">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader index="03" eyebrow="Campos de aplicación" title="Ámbitos de interés" />

        <div className="on-scroll grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((a) => (
            <div key={a.name} className="rounded-xl border border-border bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm">
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-accent"
                style={{ background: "var(--accent-muted)" }}
              >
                <AreaIcon />
              </div>
              <p className="font-medium leading-snug text-token">{a.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
