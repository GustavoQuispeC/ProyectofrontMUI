import { useEffect, useState } from "react";
import { VerEmpleado } from "../empleado.types";
import { verEmpleadoApi } from "../empleado.service";

export function useEmpleado(id: string) {
  const [empleado, setEmpleado] = useState<VerEmpleado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEmpleado = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await verEmpleadoApi(id);
        setEmpleado(data);
      } catch (err) {
        console.error("Error al obtener empleado:", err);
        setError("Error al cargar empleado");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleado();
  }, [id]);

  return { empleado, loading, error };
}
