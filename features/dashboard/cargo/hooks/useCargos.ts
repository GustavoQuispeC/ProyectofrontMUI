import { useState, useEffect } from "react";
import { ListarCargos } from "../cargo.types";
import { listarCargos } from "../cargo.logic";

export function useCargos() {
  const [cargos, setCargos] = useState<ListarCargos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCargos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await listarCargos();
        setCargos(response ?? []);
      } catch (err) {
        console.error("Error al cargar cargos:", err);
        setError("Error al cargar los cargos");
      } finally {
        setLoading(false);
      }
    };

    cargarCargos();
  }, []);

  return { cargos, loading, error };
}
