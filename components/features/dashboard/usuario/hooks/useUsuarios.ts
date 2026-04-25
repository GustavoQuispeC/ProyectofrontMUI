import { useQuery } from "@tanstack/react-query";
import { ListarUsuarios } from "../usuario.types";
import { getAuthUser } from "@/shared/auth/auth.service";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchUsuarios(): Promise<ListarUsuarios[]> {
  const auth = getAuthUser();

  if (!auth?.token) {
    throw new Error("No autenticado");
  }

  const response = await fetch(`${apiUrl}/Usuarios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const msg = error?.message || error?.error || error?.title || "Error al obtener usuarios";
    throw new Error(msg);
  }

  return response.json();
}

export function useUsuarios() {
  const {
    data: usuarios = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });

  return {
    usuarios,
    loading,
    error: error?.message || null,
    refetch,
  };
}
