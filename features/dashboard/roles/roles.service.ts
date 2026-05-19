import { ApiRoles } from "@/lib/api-roles";
import { ListarRoles } from "./roles.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function listarRolesApi() {
  return ApiRoles<ListarRoles[]>(`${apiUrl}/roles`, {
    method: "GET",
  });
}
