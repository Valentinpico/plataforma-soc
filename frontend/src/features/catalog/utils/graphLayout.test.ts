import { describe, expect, it } from "vitest";
import type { GraphEdge, GraphNode } from "../types/catalog";
import { computeLayout } from "./graphLayout";

const nodes: GraphNode[] = [
  { id: "a", label: "X", caption: "a" },
  { id: "b", label: "Y", caption: "b" },
  { id: "c", label: "Z", caption: "c" },
];
const edges: GraphEdge[] = [{ source: "a", target: "b", type: "R" }];

describe("computeLayout", () => {
  it("una posición por nodo, finita y dentro de los límites", () => {
    const size = 500;
    const m = computeLayout(nodes, edges, size);
    expect(m.size).toBe(3);
    for (const p of m.values()) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(size);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(size);
    }
  });

  it("sin nodos devuelve mapa vacío", () => {
    expect(computeLayout([], [], 500).size).toBe(0);
  });

  it("es determinista (misma entrada → misma salida)", () => {
    const a = computeLayout(nodes, edges, 500);
    const b = computeLayout(nodes, edges, 500);
    expect(a.get("a")).toEqual(b.get("a"));
    expect(a.get("c")).toEqual(b.get("c"));
  });
});
