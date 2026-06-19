import { useQuery } from "@tanstack/react-query";
import { listarVacacionesPendientes } from "../vacaciones.logic";

export function useVacacionesPendientes(canAccess: boolean) {
    const {
        data: vacacionesPendientes = [],
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["vacacionesPendientes"],
        queryFn: listarVacacionesPendientes,
        staleTime: 0,
        refetchInterval: 1000 * 30, // cada 30 segundos
        refetchOnWindowFocus: true,
        retry: 1,
        enabled: canAccess,
    });

    return {
        vacacionesPendientes,
        loading,
        error: error?.message ?? null,
        refetch,
    };
}