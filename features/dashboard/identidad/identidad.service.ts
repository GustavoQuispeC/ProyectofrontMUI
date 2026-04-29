import { apiDni } from "@/lib/api-dni";
import { BuscarDni } from "./identidad.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function buscarDni(dni: string): Promise<BuscarDni> {
  const url = `${apiUrl}/dni/${dni}`;
  return apiDni(url);
}
