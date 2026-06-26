// Motivo decorativo de nodos + aristas (line-art) — temático del grupo META (GNN).
// Uso: aria-hidden, sin significado semántico. Acepta className para posición/tamaño.
// `nodeColor` permite acentuar los nodos (two-tone tipo ÁPICE); las aristas usan
// currentColor (el color de texto del contenedor).

interface Props {
  className?: string;
  opacity?: number;
  nodeColor?: string;
}

export function GraphMotif({ className = "", opacity = 0.12, nodeColor = "currentColor" }: Props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Aristas */}
      <line x1="50" y1="60" x2="160" y2="40" stroke="currentColor" strokeWidth="1.2" />
      <line x1="160" y1="40" x2="270" y2="80" stroke="currentColor" strokeWidth="1.2" />
      <line x1="50" y1="60" x2="110" y2="150" stroke="currentColor" strokeWidth="1.2" />
      <line x1="160" y1="40" x2="200" y2="170" stroke="currentColor" strokeWidth="1.2" />
      <line x1="270" y1="80" x2="200" y2="170" stroke="currentColor" strokeWidth="1.2" />
      <line x1="110" y1="150" x2="200" y2="170" stroke="currentColor" strokeWidth="1.2" />
      <line x1="50" y1="60" x2="30" y2="160" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="160" x2="110" y2="150" stroke="currentColor" strokeWidth="1" />
      <line x1="270" y1="80" x2="290" y2="170" stroke="currentColor" strokeWidth="1" />
      <line x1="200" y1="170" x2="290" y2="170" stroke="currentColor" strokeWidth="1" />
      <line x1="160" y1="40" x2="110" y2="150" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="110" y1="150" x2="290" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" />
      {/* Halos — profundidad tipo ÁPICE */}
      <circle cx="160" cy="40" r="13" fill="none" stroke={nodeColor} strokeWidth="0.8" opacity="0.5" />
      <circle cx="270" cy="80" r="11" fill="none" stroke={nodeColor} strokeWidth="0.8" opacity="0.5" />
      {/* Nodos — acentuados (two-tone), tamaños distintos para jerarquía */}
      <circle cx="160" cy="40" r="7" fill={nodeColor} />
      <circle cx="50" cy="60" r="5" fill={nodeColor} />
      <circle cx="270" cy="80" r="6" fill={nodeColor} />
      <circle cx="30" cy="160" r="4" fill={nodeColor} />
      <circle cx="110" cy="150" r="5" fill={nodeColor} />
      <circle cx="200" cy="170" r="6" fill={nodeColor} />
      <circle cx="290" cy="170" r="4" fill={nodeColor} />
    </svg>
  );
}
