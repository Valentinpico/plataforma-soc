import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
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

const LEGEND: [string, string][] = [
  ["Fuente", "Fuente"],
  ["Dataset", "Dataset"],
  ["VariableAmbiental", "Variable"],
  ["Modelo", "Modelo"],
  ["Resultado", "Resultado"],
  ["Documento", "Documento"],
];

const W = 1000;
const H = 560;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function GraphView({ graph }: { graph: Graph }) {
  const { nodes, edges } = graph;
  const pos = useMemo(() => computeLayout(nodes, edges, W, H), [nodes, edges]);

  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [hover, setHover] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      setView((v) => ({ ...v, k: clamp(v.k * factor, 0.4, 4) }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    drag.current = { x: e.clientX - view.x, y: e.clientY - view.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const { clientX, clientY } = e;
    setView((v) => ({ ...v, x: clientX - d.x, y: clientY - d.y }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full cursor-grab touch-none select-none active:cursor-grabbing"
        role="img"
        aria-label="Grafo de conocimiento"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          {edges.map((e, i) => {
            const a = pos.get(e.source);
            const b = pos.get(e.target);
            if (!a || !b) return null;
            const on = hover && (e.source === hover || e.target === hover);
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={on ? "var(--accent)" : "var(--border)"}
                strokeWidth={on ? 1.4 : 0.7}
              />
            );
          })}
          {nodes.map((n) => {
            const p = pos.get(n.id);
            if (!p) return null;
            const active = hover === n.id;
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={p.x} cy={p.y} r={active ? 9 : 6.5} fill={COLORS[n.label] ?? "var(--text-muted)"}>
                  <title>{n.caption}</title>
                </circle>
                {active ? (
                  <text
                    x={p.x}
                    y={p.y - 12}
                    fontSize={12}
                    textAnchor="middle"
                    fill="var(--text)"
                    stroke="var(--surface-2)"
                    strokeWidth={3}
                    style={{ paintOrder: "stroke" }}
                  >
                    {n.caption}
                  </text>
                ) : (
                  <text
                    x={p.x}
                    y={p.y - 10}
                    fontSize={7.5}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    opacity={0.4}
                  >
                    {n.caption.slice(0, 16)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Leyenda */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {LEGEND.map(([key, label]) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[key] }} />
            {label}
          </span>
        ))}
      </div>

      <div className="absolute right-2 top-2 flex gap-1">
        <button
          onClick={() => setView((v) => ({ ...v, k: clamp(v.k * 1.2, 0.4, 4) }))}
          className="h-7 w-7 rounded-md border border-border bg-surface text-token"
          aria-label="Acercar"
        >
          +
        </button>
        <button
          onClick={() => setView((v) => ({ ...v, k: clamp(v.k * 0.83, 0.4, 4) }))}
          className="h-7 w-7 rounded-md border border-border bg-surface text-token"
          aria-label="Alejar"
        >
          −
        </button>
        <button
          onClick={() => setView({ x: 0, y: 0, k: 1 })}
          className="h-7 rounded-md border border-border bg-surface px-2 text-xs text-token"
          aria-label="Reiniciar vista"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
