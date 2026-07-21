import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarPermisoApi } from "../permiso.service";

export function useCancelarPermiso() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, motivoCancelacion }: { id: number; motivoCancelacion: string }) =>
      cancelarPermisoApi(id, motivoCancelacion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
      queryClient.invalidateQueries({ queryKey: ["permisosPendientes"] });
      queryClient.invalidateQueries({ queryKey: ["permisosMensuales"] });
    },
  });

  return {
    cancelarPermiso: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
