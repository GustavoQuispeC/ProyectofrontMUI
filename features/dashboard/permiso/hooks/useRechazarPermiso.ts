import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rechazarPermisoApi } from "../permiso.service";

export function useRechazarPermiso() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, motivoRechazo }: { id: number; motivoRechazo: string }) => rechazarPermisoApi(id, motivoRechazo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
      queryClient.invalidateQueries({ queryKey: ["permisosPendientes"] });
    },
  });

  return {
    rechazarPermiso: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
