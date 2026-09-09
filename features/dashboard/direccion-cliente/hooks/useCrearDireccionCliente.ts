import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearDireccionCliente } from "../direccion-cliente.logic";
import { CrearDireccionClienteRequest } from "../direccion-cliente.type";

export function useCrearDireccionCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearDireccionClienteRequest) => crearDireccionCliente(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["direcciones-cliente", variables.clienteId],
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
