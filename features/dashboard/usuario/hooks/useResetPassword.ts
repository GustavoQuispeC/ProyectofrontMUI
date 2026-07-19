import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../usuario.logic";

export function useResetPassword() {
  const { mutateAsync: resetPasswordUsuario, isPending: loading } = useMutation({
    mutationFn: ({ usuarioId, password }: { usuarioId: string; password: string }) =>
      resetPassword(usuarioId, password),
  });

  return {
    resetPasswordUsuario,
    loading,
  };
}
