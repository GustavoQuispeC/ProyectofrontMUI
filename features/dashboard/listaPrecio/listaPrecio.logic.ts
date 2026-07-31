import { getAuthUser } from "@/shared/auth/auth.service";
import { listarListasPrecioApi } from "./listaPrecio.service";

export async function listarListasPrecio() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return listarListasPrecioApi();
}
