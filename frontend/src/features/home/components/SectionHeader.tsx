// Encabezado editorial de sección: numeral grande + eyebrow + título + regla.
// Sistema repetible que da identidad de "revista científica" a la landing.
interface Props {
  index: string; // p.ej. "01"
  eyebrow: string;
  title: string;
}

export function SectionHeader({ index, eyebrow, title }: Props) {
  return (
    <div className="on-scroll mb-10 flex items-end gap-5 border-b border-border pb-5">
      <span
        className="nums hidden font-display text-6xl leading-[0.8] sm:block"
        style={{ color: "var(--accent)", opacity: 0.22 }}
      >
        {index}
      </span>
      <div>
        <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl leading-tight text-token sm:text-4xl">{title}</h2>
      </div>
    </div>
  );
}
