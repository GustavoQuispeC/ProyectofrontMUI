import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarEmpleado } from "@/features/dashboard/empleado/empleado.logic";
import { ActualizarEmpleadoRequest } from "@/features/dashboard/empleado/empleado.types";

export function useActualizarEmpleado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActualizarEmpleadoRequest }) =>
      actualizarEmpleado(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      queryClient.invalidateQueries({ queryKey: ["empleados-autocomplete"] });
      queryClient.invalidateQueries({ queryKey: ["empleado-edicion", id] });
      queryClient.invalidateQueries({ queryKey: ["empleado", Number(id)] });
    },
  });
}
