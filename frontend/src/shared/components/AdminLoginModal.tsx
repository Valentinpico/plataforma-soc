import { useState } from "react";
import { useAdmin } from "../auth/AdminContext";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";

export function AdminLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError(undefined);
    const ok = await login(password);
    setLoading(false);
    if (ok) {
      setPassword("");
      onClose();
    } else {
      setError("Contraseña incorrecta.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Modo administración">
      <div className="space-y-3">
        <p className="text-sm text-muted">
          Ingresá la contraseña para habilitar la edición (crear, editar, borrar, subir).
        </p>
        <Input
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={submit} disabled={loading}>{loading ? "Verificando…" : "Ingresar"}</Button>
        </div>
      </div>
    </Modal>
  );
}
