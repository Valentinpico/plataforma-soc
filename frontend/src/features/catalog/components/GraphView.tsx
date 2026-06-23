import { useMemo } from "react";
import type { Graph } from "../types/catalog";
import { computeLayout } from "../utils/graphLayout";

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

export function GraphView({ graph }: { graph: Graph }) {
  const { nodes, edges } = graph;
  const pos = useMemo(() => computeLayout(nodes, edges, SIZE), [nodes, edges]);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Grafo de conocimiento">
      {edges.map((e, i) => {
        const a = pos.get(e.source);
        const b = pos.get(e.target);
        if (!a || !b) return null;
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border)" strokeWidth={0.8} />;
      })}
      {nodes.map((n) => {
        const p = pos.get(n.id);
        if (!p) return null;
        return (
          <g key={n.id}>
            <circle cx={p.x} cy={p.y} r={7} fill={COLORS[n.label] ?? "var(--text-muted)"} />
            <text x={p.x} y={p.y - 10} fontSize={7.5} textAnchor="middle" fill="var(--text-muted)">
              {n.caption.slice(0, 16)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
