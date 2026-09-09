import { useQuery } from "@tanstack/react-query";
import { listarDireccionesPorCliente } from "../direccion-cliente.logic";
import { DireccionCliente } from "../direccion-cliente.type";

export function useDireccionesCliente(clienteId: number | null) {
  return useQuery<DireccionCliente[]>({
    queryKey: ["direcciones-cliente", clienteId],
    queryFn: () => listarDireccionesPorCliente(clienteId!),
    enabled: !!clienteId,
  });
}
