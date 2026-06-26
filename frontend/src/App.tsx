import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminProvider } from "./shared/auth/AdminContext";
import { Navbar } from "./shared/layout/Navbar";
import { ScrollToTop } from "./shared/layout/ScrollToTop";
import { HomePage } from "./features/home/components/HomePage";
import { ResearcherProfile } from "./features/home/components/ResearcherProfile";
import { CatalogView } from "./features/catalog/components/CatalogView";

// Páginas internas viven en un contenedor centrado; la landing es full-bleed
// y gestiona sus propios anchos por sección.
function Contained({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>;
}

export function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/equipo/:id" element={<Contained><ResearcherProfile /></Contained>} />
          <Route path="/proyectos/soc" element={<Contained><CatalogView /></Contained>} />
          <Route path="/catalogo" element={<Navigate to="/proyectos/soc" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}
