import { apiPermiso } from "@/lib/api-permiso";
import { ListarPermisoMensual, ListarPermisos, PendientesPermisos, RegistrarPermiso } from "./permiso.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar permisos
export async function listarPermisosApi(empleadoId: number, anio: number, mes: number): Promise<ListarPermisos[]> {
  return apiPermiso(`${apiUrl}/Permisos?empleadoId=${empleadoId}&anio=${anio}&mes=${mes}`, {
    method: "GET",
  });
}

//! Registrar permiso
export async function registrarPermisoApi(data: RegistrarPermiso): Promise<{ permisoId: number }> {
  return apiPermiso<{ permisoId: number }>(`${apiUrl}/Permisos`, { method: "POST", body: JSON.stringify(data) });
}

//! Listar permisos pendientes
export async function listarPermisosPendientesApi(): Promise<PendientesPermisos[]> {
  return apiPermiso(`${apiUrl}/Permisos/pendientes`, {
    method: "GET",
  });
}

//! Listar permiso mensual
export async function listarPermisosMensualApi(anio: number, mes: number): Promise<ListarPermisoMensual[]> {
  return apiPermiso(`${apiUrl}/Permisos/reporte-mensual?anio=${anio}&mes=${mes}`, {
    method: "GET",
  });
}

//! Aprobar permiso
export async function aprobarPermisoApi(id: number): Promise<void> {
  return apiPermiso(`${apiUrl}/Permisos/${id}/aprobar`, {
    method: "PUT",
  });
}

//! Cancelar permiso
export async function cancelarPermisoApi(id: number, motivoCancelacion: string): Promise<void> {
  return apiPermiso(`${apiUrl}/Permisos/${id}/cancelar`, {
    method: "PUT",
    body: JSON.stringify({ motivoCancelacion }),
  });
}
