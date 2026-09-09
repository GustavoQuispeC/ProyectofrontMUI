import { useMutation, useQueryClient } from "@tanstack/react-query";
import { establecerDireccionPrincipal } from "../direccion-cliente.logic";

export function useEstablecerDireccionPrincipal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => establecerDireccionPrincipal(id),
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
