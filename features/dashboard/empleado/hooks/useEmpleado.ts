import { useEffect, useState } from "react";
import { DetalleEmpleado } from "../empleado.types";
import { detalleEmpleadoApi } from "../empleado.service";
import { useQuery } from "@tanstack/react-query";

// export function useEmpleado(id: string) {
//   const [empleado, setEmpleado] = useState<DetalleEmpleado | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     const fetchEmpleado = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const data = await detalleEmpleadoApi(id);
//         setEmpleado(data);
//       } catch (err) {
//         console.error("Error al obtener empleado:", err);
//         setError("Error al cargar empleado");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmpleado();
//   }, [id]);

//   return { empleado, loading, error };
// }

export function useEmpleado(id: string) {
  const {
    data: empleado,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<DetalleEmpleado>({
    queryKey: ["empleado", id],
    queryFn: () => detalleEmpleadoApi(id),
    enabled: !!id, // evita ejecutar si no existe id
    staleTime: 1000 * 60 * 5, // 5 minutos cache fresco
  });

  return {
    empleado,
    loading,
    error: error ? "Error al cargar empleado" : null,
    refetch,
  };
}
