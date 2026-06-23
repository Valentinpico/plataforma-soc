import { Badge } from "../../../shared/components/Badge";
import { Modal } from "../../../shared/components/Modal";
import type { Model } from "../types/catalog";

export function ModelDetailModal({ model, onClose }: { model: Model | null; onClose: () => void }) {
  return (
    <Modal open={model !== null} onClose={onClose} title={model?.name ?? ""}>
      {model && (
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            {model.architecture && <Badge tone="accent">{model.architecture}</Badge>}
            {model.scheme && <Badge tone="neutral">{model.scheme}</Badge>}
          </div>

          {model.framework && (
            <p className="text-token">
              <span className="text-muted">Framework: </span>
              {model.framework}
            </p>
          )}
          {model.codePointer && (
            <p className="break-all font-mono text-xs text-muted">{model.codePointer}</p>
          )}

          {!!model.datasets?.length && (
            <div>
              <p className="mb-1 text-muted">Entrenado con:</p>
              <ul className="list-disc pl-5 text-token">
                {model.datasets.map((d) => (
                  <li key={d.id}>{d.name}</li>
                ))}
              </ul>
            </div>
          )}

          {!!model.results?.length && (
            <div>
              <p className="mb-1 text-muted">Resultados:</p>
              <table className="w-full text-xs">
                <tbody>
                  {model.results.map((r) => (
                    <tr key={r.id} className="border-b border-border">
                      <td className="py-1 text-token">{r.scope ?? "—"}</td>
                      <td className="py-1 text-right font-mono text-muted">RMSE {r.rmse?.toFixed(2) ?? "—"}</td>
                      <td className="py-1 text-right font-mono text-token">R² {r.r2?.toFixed(3) ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
