import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarCliente } from "@/features/dashboard/cliente/cliente.logic";
import { ActualizarClienteRequest } from "@/features/dashboard/cliente/cliente.type";

export function useActualizarCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ActualizarClienteRequest }) =>
      actualizarCliente(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientes-listado"],
      });
    },
  });
}
