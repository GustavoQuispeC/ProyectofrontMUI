import { useMutation, useQueryClient } from "@tanstack/react-query";
import { desactivarEmpleadoApi } from "../empleado.service";
import { DesactivarEmpleadoRequest } from "../empleado.types";

export function useDesactivarEmpleado() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: DesactivarEmpleadoRequest }) =>
      desactivarEmpleadoApi(id, payload),

    onSuccess: (_data, variables) => {
      // refresca la tabla automáticamente
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      // invalida el detalle del empleado desactivado
      queryClient.invalidateQueries({ queryKey: ["empleado", Number(variables.id)] });
    },
  });

  return {
    desactivarEmpleado: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
