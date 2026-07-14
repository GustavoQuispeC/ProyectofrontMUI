import {apiFalta} from "@/lib/api-falta"
import { RegistrarPermiso } from "../permiso/permiso.type";
import { apiPermiso } from "@/lib/api-permiso";
import { RegistrarFalta } from "./falta.constants";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//!Registrar falta
export async function registrarFaltaApi(data: RegistrarFalta): Promise<{ faltaId: number }> {
  return apiFalta<{ faltaId: number }>(`${apiUrl}/faltas`, { method: "POST", body: JSON.stringify(data) });
}