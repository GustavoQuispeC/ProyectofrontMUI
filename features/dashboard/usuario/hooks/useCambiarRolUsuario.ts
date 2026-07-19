import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeRole } from "../usuario.logic";

export function useCambiarRolUsuario() {
  const queryClient = useQueryClient();

  const { mutateAsync: cambiarRolUsuario, isPending: loading } = useMutation({
    mutationFn: ({ usuarioId, role }: { usuarioId: string; role: string }) => changeRole(usuarioId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  return {
    cambiarRolUsuario,
    loading,
  };
}
