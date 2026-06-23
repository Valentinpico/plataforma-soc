import type { Graph } from "../types/catalog";

// Paleta categórica de data viz (excepción al design system: no es UI estándar).
const COLORS: Record<string, string> = {
  Fuente: "#c2683f",
  VariableAmbiental: "#6f9e7e",
  Dataset: "#3f6b8f",
  Modelo: "#7a5a9b",
  Resultado: "#c9a14a",
  Documento: "#8a8170",
};

const SIZE = 560;
const R = 235;

export function GraphView({ graph }: { graph: Graph }) {
  const { nodes, edges } = graph;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const pos = new Map(
    nodes.map((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      return [n.id, { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }] as const;
    })
  );

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Grafo de conocimiento">
      {edges.map((e, i) => {
        const a = pos.get(e.source);
        const b = pos.get(e.target);
        if (!a || !b) return null;
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border)" strokeWidth={1} />;
      })}
      {nodes.map((n) => {
        const p = pos.get(n.id);
        if (!p) return null;
        return (
          <g key={n.id}>
            <circle cx={p.x} cy={p.y} r={8} fill={COLORS[n.label] ?? "var(--text-muted)"} />
            <text x={p.x} y={p.y - 12} fontSize={8.5} textAnchor="middle" fill="var(--text-muted)">
              {n.caption.slice(0, 18)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
