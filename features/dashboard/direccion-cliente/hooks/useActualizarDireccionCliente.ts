import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarDireccionCliente } from "../direccion-cliente.logic";
import { ActualizarDireccionClienteRequest } from "../direccion-cliente.type";

export function useActualizarDireccionCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ActualizarDireccionClienteRequest }) =>
      actualizarDireccionCliente(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["direcciones-cliente", data.clienteId],
      });
      queryClient.invalidateQueries({
        queryKey: ["direccion-cliente", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientes-listado"],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientes"],
      });
    },
  });
}
