import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarReporteCajaPagosApi } from "./reportecaja.service";
import { ListarReporteCajaPagosRequest } from "./reportecaja.type";

export async function listarReporteCajaPagos(params: ListarReporteCajaPagosRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarCajaSesiones)) {
    throw new Error("No tienes privilegios para ver el reporte de caja");
  }

  return listarReporteCajaPagosApi(params);
}
