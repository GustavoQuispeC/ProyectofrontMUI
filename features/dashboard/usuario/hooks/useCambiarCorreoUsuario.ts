import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeEmail } from "../usuario.logic";

export function useCambiarCorreoUsuario() {
  const queryClient = useQueryClient();

  const { mutateAsync: cambiarCorreoUsuario, isPending: loading } = useMutation({
    mutationFn: ({ usuarioId, email }: { usuarioId: string; email: string }) => changeEmail(usuarioId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  return {
    cambiarCorreoUsuario,
    loading,
  };
}
