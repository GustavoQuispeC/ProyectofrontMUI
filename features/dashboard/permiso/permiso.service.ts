import { apiPermiso } from "@/lib/api-permiso";
import { ListarPermisos, PendientesPermisos, RegistrarPermiso } from "./permiso.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//!Listar permisos
export async function listarPermisosApi(empleadoId: number, anio: number, mes: number): Promise<ListarPermisos[]> {
  return apiPermiso(`${apiUrl}/Permisos?empleadoId=${empleadoId}&anio=${anio}&mes=${mes}`, {
    method: "GET",
  });
}

//!Registrar permiso
export async function registrarPermisoApi(data: RegistrarPermiso): Promise<{ permisoId: number }> {
  return apiPermiso<{ permisoId: number }>(`${apiUrl}/Permisos`, { method: "POST", body: JSON.stringify(data) });
}

//!Listar permisos pendientes
export async function listarPermisosPendientesApi(): Promise<PendientesPermisos[]> {
  return apiPermiso(`${apiUrl}/Permisos/pendientes`, {
    method: "GET",
  });
}
