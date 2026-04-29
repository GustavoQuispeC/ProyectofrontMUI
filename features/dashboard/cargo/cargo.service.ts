import { apiCargo } from "@/lib/api-cargo";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function listarCargosApi() {
  return apiCargo(`${apiUrl}/Cargos`, {
    method: "GET",
  });
}
