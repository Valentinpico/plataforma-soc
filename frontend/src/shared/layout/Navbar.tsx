import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const sectionLinks = [
  { id: "equipo", href: "/#equipo", label: "Equipo" },
  { id: "proyectos", href: "/#proyectos", label: "Proyectos" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [active, setActive] = useState("inicio");

  // Scroll-spy: resalta el ítem de la sección visible (solo en la landing).
  useEffect(() => {
    if (pathname.startsWith("/proyectos")) {
      setActive("proyectos");
      return;
    }
    if (pathname !== "/") {
      setActive("");
      return;
    }
    // Trackea hero + secciones. En secciones sin ítem (About/Líneas/Ámbitos/…)
    // no se marca ninguno, en vez de caer a "Inicio".
    const spy = ["inicio", "equipo", "proyectos"];
    const els = spy
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        setActive(
          visible.has("proyectos")
            ? "proyectos"
            : visible.has("equipo")
              ? "equipo"
              : visible.has("inicio")
                ? "inicio"
                : ""
        );
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const cls = (on: boolean) =>
    `rounded-md px-3 py-1.5 text-sm transition ${
      on ? "bg-accent-muted text-accent" : "text-muted hover:text-token"
    }`;

  // Si ya estás en la landing, "Inicio"/logo scrollean al tope (no recargan).
  const goTop = () => {
    if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <NavLink to="/" className="flex items-center gap-3" onClick={goTop}>
          <img src="/logo-meta.png" alt="Grupo META" className="h-10 w-auto" />
          <img src="/logo-epn.png" alt="Escuela Politécnica Nacional" className="h-7 w-auto opacity-90" />
        </NavLink>
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={cls(active === "inicio")} onClick={goTop}>
            Inicio
          </NavLink>
          {sectionLinks.map((l) => (
            <a key={l.id} href={l.href} className={cls(active === l.id)}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
