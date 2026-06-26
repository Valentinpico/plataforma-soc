// Red de colaboración — marquee infinito con las instituciones del equipo
// (de las adscripciones del roster). Auto-scroll, pausa en hover, reduced-motion.

const institutions = [
  "Escuela Politécnica Nacional",
  "Instituto Nacional de Meteorología e Hidrología",
  "ESPAM",
  "Universidad de Las Américas",
  "Universidad de La Coruña",
  "AIMS Consultores",
];

const fade =
  "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)";

export function CollaboratorsMarquee() {
  // Lista duplicada para el loop continuo.
  const items = [...institutions, ...institutions];

  return (
    <section className="overflow-hidden border-y border-border bg-surface-2 py-12">
      <p className="mx-auto mb-7 max-w-6xl px-6 font-mono text-xs uppercase tracking-[0.22em] text-accent">
        Red de colaboración
      </p>
      <div
        className="marquee-mask relative"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div className="marquee-track">
          {items.map((name, i) => (
            <div key={i} className="flex items-center" aria-hidden={i >= institutions.length}>
              <span className="whitespace-nowrap px-10 font-display text-xl text-muted sm:text-2xl">
                {name}
              </span>
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
