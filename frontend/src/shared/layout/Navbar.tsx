import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAdmin } from "../auth/AdminContext";
import { AdminLoginModal } from "../components/AdminLoginModal";
import { Button } from "../components/Button";
import { useDarkMode } from "../hooks/useDarkMode";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
];

export function Navbar() {
  const { dark, toggle } = useDarkMode();
  const { isAdmin, logout } = useAdmin();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <span className="font-display text-lg text-token">
          Plataforma SOC <span className="text-muted">· PIS-24-09</span>
        </span>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition ${
                  isActive ? "bg-accent-muted text-accent" : "text-muted hover:text-token"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {isAdmin ? (
            <Button variant="ghost" onClick={logout} className="ml-2">
              <span className="text-success">● admin</span> · Salir
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setLoginOpen(true)} className="ml-2">
              Administrar
            </Button>
          )}

          <Button variant="ghost" onClick={toggle}>{dark ? "☀" : "☾"}</Button>
        </div>
      </div>

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </nav>
  );
}
