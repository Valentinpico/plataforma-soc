import { Badge } from "../../../shared/components/Badge";
import type { Result } from "../types/catalog";

export function MetricsTable({ results }: { results: Result[] }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
          <th className="py-2 font-medium">Modelo</th>
          <th className="py-2 font-medium">Esquema</th>
          <th className="py-2 font-medium">Región</th>
          <th className="py-2 text-right font-medium">RMSE</th>
          <th className="py-2 text-right font-medium">R²</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr key={r.id} className="border-b border-border">
            <td className="py-2 pr-2 text-token">{r.model?.architecture ?? r.model?.name ?? "—"}</td>
            <td className="py-2 pr-2 text-muted">{r.model?.scheme ?? "—"}</td>
            <td className="py-2 pr-2">{r.scope && <Badge tone="accent">{r.scope}</Badge>}</td>
            <td className="py-2 pr-2 text-right font-mono text-muted">{r.rmse?.toFixed(2) ?? "—"}</td>
            <td className="py-2 text-right font-mono text-token">{r.r2?.toFixed(3) ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
