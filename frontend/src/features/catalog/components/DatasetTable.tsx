import { Badge } from "../../../shared/components/Badge";
import { Button } from "../../../shared/components/Button";
import type { Dataset } from "../types/catalog";

interface Props {
  datasets: Dataset[];
  canEdit: boolean;
  onEdit: (d: Dataset) => void;
  onDelete: (d: Dataset) => void;
}

export function DatasetTable({ datasets, canEdit, onEdit, onDelete }: Props) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
          <th className="py-2 font-medium">Nombre</th>
          <th className="py-2 font-medium">Tipo</th>
          <th className="py-2 text-right font-medium">Registros</th>
          {canEdit && <th className="py-2" />}
        </tr>
      </thead>
      <tbody>
        {datasets.map((d) => (
          <tr key={d.id} className="border-b border-border">
            <td className="py-2 pr-2 text-token">{d.name}</td>
            <td className="py-2 pr-2">{d.type && <Badge tone="accent">{d.type}</Badge>}</td>
            <td className="py-2 pr-2 text-right font-mono text-muted">
              {d.recordCount != null ? (
                d.recordCount.toLocaleString()
              ) : (
                <span className="font-sans italic opacity-70">ráster</span>
              )}
            </td>
            {canEdit && (
              <td className="py-2">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => onEdit(d)}>Editar</Button>
                  <Button variant="danger" onClick={() => onDelete(d)}>Borrar</Button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
