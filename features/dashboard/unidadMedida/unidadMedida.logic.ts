import { getAuthUser } from "@/shared/auth/auth.service";
import { listarUnidadesMedidaApi } from "./unidadMedida.service";

export async function listarUnidadesMedida() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return listarUnidadesMedidaApi();
}
