import { apiCategoria } from "@/lib/api-categoria";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function listarCategoriasApi() {
  return apiCategoria(`${apiUrl}/categorias`, {
    method: "GET",
  });
}
