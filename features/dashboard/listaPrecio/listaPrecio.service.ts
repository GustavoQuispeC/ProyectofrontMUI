import { apiListaPrecio } from "@/lib/api-listaPrecio";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function listarListasPrecioApi() {
  return apiListaPrecio(`${apiUrl}/listas-precio`, {
    method: "GET",
  });
}
