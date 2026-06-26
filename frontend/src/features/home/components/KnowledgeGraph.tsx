// Grafo de conocimiento de un investigador: nodo central (persona) + categorías
// de investigación (tamaño por nº de publicaciones), aristas de co-ocurrencia
// (temas que aparecen juntos en una misma publicación → "se relacionan").
// Hover: resalta el área y sus conexiones; el resto se atenúa.
import { useMemo, useState } from "react";
import { computeLayout } from "../../catalog/utils/graphLayout";
import type { GraphNode, GraphEdge } from "../../catalog/types/catalog";
import { categoryName } from "../data/classifications";
import type { Paper } from "../data/researchers";

const W = 520;
const H = 440;

export function KnowledgeGraph({ papers }: { papers: Paper[] }) {
  const [hover, setHover] = useState<string | null>(null);

  const model = useMemo(() => {
    const count: Record<string, number> = {};
    const co: Record<string, number> = {};
    for (const p of papers) {
      const ts = p.topics ?? [];
      for (const t of ts) count[t] = (count[t] ?? 0) + 1;
      for (let i = 0; i < ts.length; i++)
        for (let j = i + 1; j < ts.length; j++) {
          const key = [ts[i], ts[j]].sort().join("|");
          co[key] = (co[key] ?? 0) + 1;
        }
    }
    const cats = Object.keys(count);
    const nodes: GraphNode[] = [
      { id: "__me", label: "", caption: "" },
      ...cats.map((c) => ({ id: c, label: categoryName(c), caption: String(count[c]) })),
    ];
    const edges: GraphEdge[] = [
      ...cats.map((c) => ({ source: "__me", target: c, type: "has" })),
      ...Object.keys(co).map((k) => {
        const [a, b] = k.split("|");
        return { source: a, target: b, type: "co" };
      }),
    ];
    return { count, cats, nodes, edges, pos: computeLayout(nodes, edges, W, H) };
  }, [papers]);

  if (model.cats.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-surface-2 p-6 text-sm italic text-muted">
        Sin categorías de investigación detectadas todavía.
      </p>
    );
  }

  const max = Math.max(...model.cats.map((c) => model.count[c]));
  const r = (c: string) => 9 + 19 * Math.sqrt(model.count[c] / max);
  const connected = (id: string) =>
    !hover || hover === id || model.edges.some((e) => (e.source === hover && e.target === id) || (e.target === hover && e.source === id));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {model.edges.map((e, i) => {
          const a = model.pos.get(e.source)!;
          const b = model.pos.get(e.target)!;
          const on = hover && (e.source === hover || e.target === hover);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={on ? "var(--accent)" : "var(--border)"}
              strokeWidth={on ? 2 : e.type === "co" ? 1.5 : 0.8}
              opacity={hover && !on ? 0.2 : 1}
            />
          );
        })}
        {model.nodes.map((nd) => {
          const p = model.pos.get(nd.id)!;
          if (nd.id === "__me")
            return <circle key={nd.id} cx={p.x} cy={p.y} r={9} fill="var(--accent)" />;
          const isHover = hover === nd.id;
          const dim = hover && !connected(nd.id) ? 0.25 : 1;
          return (
            <g
              key={nd.id}
              onMouseEnter={() => setHover(nd.id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
              opacity={dim}
            >
              <circle cx={p.x} cy={p.y} r={r(nd.id) + (isHover ? 3 : 0)} fill={isHover ? "var(--accent)" : "var(--brand)"} opacity={0.9} />
              <text
                x={p.x}
                y={p.y - r(nd.id) - 6}
                textAnchor="middle"
                className="fill-token"
                style={{ fontSize: 11, fontWeight: isHover ? 600 : 400 }}
              >
                {nd.label} ({nd.caption})
              </text>
            </g>
          );
        })}
      </svg>

      {/* Leyenda */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent)" }} />
          Investigador
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand)" }} />
          Área de investigación (tamaño = nº de trabajos)
        </span>
      </div>
    </div>
  );
}
