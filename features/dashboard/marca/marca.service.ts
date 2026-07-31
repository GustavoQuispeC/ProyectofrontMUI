import { apiMarca } from "@/lib/api-marca";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function listarMarcasApi() {
  return apiMarca(`${apiUrl}/marcas`, {
    method: "GET",
  });
}
