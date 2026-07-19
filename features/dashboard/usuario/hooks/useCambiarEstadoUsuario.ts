import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarEstado } from "../usuario.logic";

export function useCambiarEstadoUsuario() {
  const queryClient = useQueryClient();

  const { mutateAsync: cambiarEstadoUsuario, isPending: loading } = useMutation({
    mutationFn: ({ usuarioId, estado }: { usuarioId: string; estado: boolean }) => cambiarEstado(usuarioId, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  return {
    cambiarEstadoUsuario,
    loading,
  };
}
