import { getAuthUser } from "@/shared/auth/auth.service";
import { listarUsuariosApi as listarUsuariosService } from "./usuario.service";

export async function listarUsuarios() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return listarUsuariosService();
}
