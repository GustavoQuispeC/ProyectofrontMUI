import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aprobarPermisoApi } from "../permiso.service";

export function useAprobarPermiso() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => aprobarPermisoApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permisos"],
      });

      queryClient.invalidateQueries({
        queryKey: ["permisosPendientes"],
      });
    },
  });

  return {
    aprobarPermiso: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
