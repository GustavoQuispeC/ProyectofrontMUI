import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarDireccionCliente } from "../direccion-cliente.logic";

export function useEliminarDireccionCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; clienteId: number }) => eliminarDireccionCliente(variables.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["direcciones-cliente", variables.clienteId],
      });
      queryClient.invalidateQueries({
        queryKey: ["direccion-cliente", variables.id],
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
