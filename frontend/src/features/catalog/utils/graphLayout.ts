import type { GraphEdge, GraphNode } from "../types/catalog";

export interface Pt {
  x: number;
  y: number;
}

/**
 * Layout force-directed (Fruchterman-Reingold simplificado), determinista.
 * Devuelve una posición por nodo dentro de [0, size].
 */
export function computeLayout(nodes: GraphNode[], edges: GraphEdge[], size: number): Map<string, Pt> {
  const n = nodes.length;
  if (n === 0) return new Map();

  const center = size / 2;
  // Posición inicial determinista (en círculo, sin aleatoriedad).
  const pos: Pt[] = nodes.map((_, i) => {
    const a = (2 * Math.PI * i) / n;
    return { x: center + Math.cos(a) * size * 0.3, y: center + Math.sin(a) * size * 0.3 };
  });

  const index = new Map(nodes.map((nd, i) => [nd.id, i] as const));
  const links = edges
    .map((e) => [index.get(e.source), index.get(e.target)] as const)
    .filter((l): l is readonly [number, number] => l[0] !== undefined && l[1] !== undefined);

  const k = size * 0.1; // distancia ideal entre nodos
  const iterations = 250;
  const margin = size * 0.05;

  for (let it = 0; it < iterations; it++) {
    const disp: Pt[] = pos.map(() => ({ x: 0, y: 0 }));

    // Repulsión entre todos los pares.
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const rep = (k * k) / dist;
        const ux = dx / dist;
        const uy = dy / dist;
        disp[i].x += ux * rep;
        disp[i].y += uy * rep;
        disp[j].x -= ux * rep;
        disp[j].y -= uy * rep;
      }
    }

    // Atracción a lo largo de las aristas.
    for (const [a, b] of links) {
      const dx = pos[a].x - pos[b].x;
      const dy = pos[a].y - pos[b].y;
      const dist = Math.hypot(dx, dy) || 0.01;
      const att = (dist * dist) / k;
      const ux = dx / dist;
      const uy = dy / dist;
      disp[a].x -= ux * att;
      disp[a].y -= uy * att;
      disp[b].x += ux * att;
      disp[b].y += uy * att;
    }

    // Gravedad al centro + desplazamiento limitado (enfriamiento).
    const temp = size * 0.04 * (1 - it / iterations);
    for (let i = 0; i < n; i++) {
      disp[i].x += (center - pos[i].x) * 0.02;
      disp[i].y += (center - pos[i].y) * 0.02;
      const dl = Math.hypot(disp[i].x, disp[i].y) || 0.01;
      pos[i].x += (disp[i].x / dl) * Math.min(dl, temp);
      pos[i].y += (disp[i].y / dl) * Math.min(dl, temp);
      pos[i].x = Math.max(margin, Math.min(size - margin, pos[i].x));
      pos[i].y = Math.max(margin, Math.min(size - margin, pos[i].y));
    }
  }

  return new Map(nodes.map((nd, i) => [nd.id, pos[i]] as const));
}
