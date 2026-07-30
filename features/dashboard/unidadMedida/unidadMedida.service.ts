import { apiUnidadMedida } from "@/lib/api-unidadMedida";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function listarUnidadesMedidaApi() {
  return apiUnidadMedida(`${apiUrl}/unidad-medida`, {
    method: "GET",
  });
}
