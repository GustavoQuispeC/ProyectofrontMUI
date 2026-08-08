import { apiMarca } from "@/lib/api-marca";
import { ListarMarca } from "@/features/dashboard/marca/Marca.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function listarMarcasPublicasApi(): Promise<ListarMarca[]> {
  return apiMarca(`${apiUrl}/marcas`, {
    method: "GET",
  });
}
