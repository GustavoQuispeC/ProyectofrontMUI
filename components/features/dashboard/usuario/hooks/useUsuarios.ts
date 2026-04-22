import { useEffect, useState } from "react";
import { listarUsuarios } from "../usuario.logic";
import { ListarUsuarios } from "../usuario.types";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<ListarUsuarios[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0); // ← para el refetch

  useEffect(() => {
    let cancelled = false; // evita setState si el componente se desmontó

    async function fetchUsuarios() {
      setLoading(true);
      setError(null);

      try {
        const data = await listarUsuarios();
        if (!cancelled) {
          setUsuarios(data ?? []);
        }
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
        if (!cancelled) {
          setError("Error al cargar usuarios");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUsuarios();

    return () => {
      cancelled = true; // cleanup
    };
  }, [trigger]); // ← se re-ejecuta solo cuando cambia trigger

  const refetch = () => setTrigger((t) => t + 1);

  return { usuarios, loading, error, refetch };
}
