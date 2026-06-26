// Banda full-bleed con 3 contadores institucionales del grupo.
import { researchers } from "../data/researchers";
import { researchLines } from "../data/researchLines";

const stats = [
  {
    value: researchLines.length,
    label: "Líneas de investigación",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
  {
    value: researchers.length,
    label: "Investigadores",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
        <circle cx="9" cy="7" r="3" />
        <circle cx="15" cy="7" r="3" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
        <path d="M13 21v-2a4 4 0 0 1 4-4h4" />
      </svg>
    ),
  },
  {
    value: 1,
    label: "Proyecto activo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export function StatsBand() {
  return (
    <section className="bg-brand">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-around">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 text-on-brand">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--accent)" }}
            >
              {s.icon}
            </div>
            <div>
              <p className="font-display text-4xl font-bold leading-none">{s.value}</p>
              <p className="mt-0.5 text-sm opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
