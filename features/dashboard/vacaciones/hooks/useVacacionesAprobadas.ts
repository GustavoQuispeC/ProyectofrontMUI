import { useQuery } from "@tanstack/react-query";
import { listarVacacionesAprobadas } from "../vacaciones.logic";

export function useVacacionesAprobadas(canAccess: boolean) {
    const {
        data: vacacionesAprobadas = [],
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["vacacionesAprobadas"],
        queryFn: listarVacacionesAprobadas,
        staleTime: 0,
        refetchInterval: 1000 * 30, // cada 30 segundos
        refetchOnWindowFocus: true,
        retry: 1,
        enabled: canAccess,
    });

    return {
        vacacionesAprobadas,
        loading,
        error: error?.message ?? null,
        refetch,
    };
}