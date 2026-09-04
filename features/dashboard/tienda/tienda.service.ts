import { ListarTienda } from "./tienda.type";
import { apiTienda } from "@/lib/api-tienda";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar tiendas
export function listarTiendasApi(): Promise<ListarTienda[]> {
  return apiTienda(`${apiUrl}/tiendas`, {
    method: "GET",
  });
}
