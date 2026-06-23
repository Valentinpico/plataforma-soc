import { useEffect, useState } from "react";
import { Button } from "./shared/components/Button";
import { CatalogView } from "./features/catalog/components/CatalogView";

export function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.dark = dark ? "true" : "false";
  }, [dark]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-token">Plataforma SOC</h1>
          <p className="mt-1 text-sm text-muted">
            Repositorio + grafo de conocimiento · PIS-24-09
          </p>
        </div>
        <Button variant="ghost" onClick={() => setDark((d) => !d)}>
          {dark ? "☀ Claro" : "☾ Oscuro"}
        </Button>
      </header>
      <CatalogView />
    </main>
  );
}
