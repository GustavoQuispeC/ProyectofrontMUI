import { getAuthUser } from "@/shared/auth/auth.service";
import { listarMarcasApi } from "./marca.service";

export async function listarMarcas() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return listarMarcasApi();
}
