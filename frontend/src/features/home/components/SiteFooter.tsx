// Footer institucional multi-columna del grupo META — EPN.
import { researchLines } from "../data/researchLines";

export function SiteFooter() {
  return (
    <footer className="bg-brand-bg text-on-brand">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Columna 1 — Identidad */}
        <div className="lg:col-span-1">
          <p className="font-display text-2xl font-bold tracking-tight">META</p>
          <p className="mt-1 text-sm leading-snug opacity-70">
            Grupo de Investigación en Modelización Estocástica Teórica y Aplicada
          </p>
          <p className="mt-3 text-xs opacity-50">EPN</p>
        </div>

        {/* Columna 2 — Líneas */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-60">
            Líneas de investigación
          </p>
          <ul className="space-y-1.5">
            {researchLines.map((l) => (
              <li key={l.code} className="text-xs leading-relaxed opacity-75">
                {l.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3 — Contacto */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-60">
            Contacto
          </p>
          <p className="text-sm font-medium">PhD. Miguel Alfonso Flores Sánchez</p>
          <p className="mt-0.5 text-xs opacity-70">Coordinador del grupo</p>
          <a
            href="mailto:miguel.flores@epn.edu.ec"
            className="mt-2 block text-xs underline underline-offset-2 opacity-80 transition hover:opacity-100"
          >
            miguel.flores@epn.edu.ec
          </a>
          <p className="mt-3 text-xs opacity-60">
            Departamento de Matemática<br />
            EPN
          </p>
        </div>

        {/* Columna 4 — Institución */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-60">
            Institución
          </p>
          <p className="text-sm">EPN</p>
          <p className="mt-1 text-xs opacity-70">
            Ladrón de Guevara E11-253<br />
            Quito, Ecuador
          </p>
          <p className="mt-3 text-xs opacity-50">
            <a
              href="https://www.epn.edu.ec"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition hover:opacity-80"
            >
              www.epn.edu.ec
            </a>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-on-brand/10">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs opacity-40">
          © 2026 Grupo META — EPN. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
