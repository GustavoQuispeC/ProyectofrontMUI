import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearSalida } from "../salida.logic";
import { CrearSalidaRequest } from "../salida.type";

export function useCrearSalida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearSalidaRequest) => crearSalida(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["salidas"],
      });
    },
  });
}
