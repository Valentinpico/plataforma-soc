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

const W = 1000;
const H = 560;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function GraphView({ graph }: { graph: Graph }) {
  const { nodes, edges } = graph;
  const pos = useMemo(() => computeLayout(nodes, edges, W, H), [nodes, edges]);

  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  // Zoom con rueda (listener no-pasivo para poder preventDefault).
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
    if (!drag.current) return;
    setView((v) => ({ ...v, x: e.clientX - drag.current!.x, y: e.clientY - drag.current!.y }));
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
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border)" strokeWidth={0.8} />;
          })}
          {nodes.map((n) => {
            const p = pos.get(n.id);
            if (!p) return null;
            return (
              <g key={n.id}>
                <circle cx={p.x} cy={p.y} r={7} fill={COLORS[n.label] ?? "var(--text-muted)"} />
                <text x={p.x} y={p.y - 10} fontSize={8} textAnchor="middle" fill="var(--text-muted)">
                  {n.caption.slice(0, 18)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

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
