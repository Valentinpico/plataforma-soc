import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminProvider } from "./shared/auth/AdminContext";
import { Navbar } from "./shared/layout/Navbar";
import { HomePage } from "./features/home/components/HomePage";
import { CatalogView } from "./features/catalog/components/CatalogView";

export function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogView />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AdminProvider>
  );
}
