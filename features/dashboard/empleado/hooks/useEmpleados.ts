import { useCallback, useEffect, useState } from "react";
import { EmpleadosListar } from "../empleado.types";
import { listarEmpleadosApi } from "../empleado.service";

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<EmpleadosListar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpleados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await listarEmpleadosApi();
      setEmpleados(data ?? []);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
      setError("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  return { empleados, loading, error, refetch: fetchEmpleados };
}
