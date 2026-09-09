import { useQuery } from "@tanstack/react-query";
import { obtenerDireccionCliente } from "../direccion-cliente.logic";
import { DireccionCliente } from "../direccion-cliente.type";

export function useDireccionCliente(id: number | null) {
  return useQuery<DireccionCliente>({
    queryKey: ["direccion-cliente", id],
    queryFn: () => obtenerDireccionCliente(id!),
    enabled: !!id,
  });
}
