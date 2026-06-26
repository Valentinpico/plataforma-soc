// Líneas de investigación del grupo META, agrupadas por departamento.
import { researchLines } from "../data/researchLines";
import { SectionHeader } from "./SectionHeader";

// Icono según departamento — SVG inline pequeño
function DeptIcon({ dept }: { dept: string }) {
  if (dept.includes("Matemática")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    );
  }
  if (dept.includes("Biología")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M12 22c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" /><path d="M4.22 4.22l15.56 15.56" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
    </svg>
  );
}

// Agrupa líneas por departamento manteniendo orden de aparición
function groupByDept(lines: typeof researchLines) {
  const order: string[] = [];
  const map = new Map<string, typeof researchLines>();
  for (const l of lines) {
    if (!map.has(l.department)) {
      order.push(l.department);
      map.set(l.department, []);
    }
    map.get(l.department)!.push(l);
  }
  return order.map((dept) => ({ dept, lines: map.get(dept)! }));
}

export function ResearchLinesSection() {
  const groups = groupByDept(researchLines);

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader index="02" eyebrow="Investigación" title="Líneas de investigación" />

        <div className="on-scroll space-y-10">
          {groups.map(({ dept, lines }) => (
            <div key={dept}>
              <h3 className="mb-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-muted">
                {dept}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {lines.map((line) => (
                  <div
                    key={line.code}
                    className="flex gap-4 rounded-xl border border-border bg-surface-2 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
                  >
                    <div
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-accent"
                      style={{ background: "var(--accent)" }}
                    >
                      <DeptIcon dept={dept} />
                    </div>
                    <div>
                      <p className="font-medium leading-snug text-token">{line.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted">{line.code}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{line.blurb}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
