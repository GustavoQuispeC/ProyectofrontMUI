import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarEmpleadoApi } from "../empleado.service";

export function useEliminarEmpleado() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: eliminarEmpleadoApi,

    onSuccess: () => {
      // 🔥 refresca la tabla automáticamente
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
    },
  });

  return {
    eliminarEmpleado: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
