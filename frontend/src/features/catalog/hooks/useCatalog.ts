import { useCallback, useEffect, useState } from "react";
import { catalogApi } from "../api/catalogApi";
import type { Dataset, DocumentItem, Graph, Model, Source } from "../types/catalog";

interface CatalogData {
  datasets: Dataset[];
  models: Model[];
  documents: DocumentItem[];
  sources: Source[];
  graph: Graph;
}

// El try/catch vive acá, no en el componente.
export function useCatalog() {
  const [data, setData] = useState<CatalogData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    try {
      const [datasets, models, documents, sources, graph] = await Promise.all([
        catalogApi.datasets(),
        catalogApi.models(),
        catalogApi.documents(),
        catalogApi.sources(),
        catalogApi.graph(),
      ]);
      setData({ datasets, models, documents, sources, graph });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
