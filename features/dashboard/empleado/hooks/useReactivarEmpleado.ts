import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactivarEmpleadoApi } from "../empleado.service";
import { ReactivarEmpleadoRequest } from "../empleado.types";

export function useReactivarEmpleado() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReactivarEmpleadoRequest }) =>
      reactivarEmpleadoApi(id, payload),

    onSuccess: (_data, variables) => {
      // refresca la tabla automáticamente
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      // invalida el detalle del empleado reactivado
      queryClient.invalidateQueries({ queryKey: ["empleado", Number(variables.id)] });
    },
  });

  return {
    reactivarEmpleado: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
