import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearCliente } from "@/features/dashboard/cliente/cliente.logic";
import { CrearClienteRequest } from "@/features/dashboard/cliente/cliente.type";

export function useCrearCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearClienteRequest) => crearCliente(payload),
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
