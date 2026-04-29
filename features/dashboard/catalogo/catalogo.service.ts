import { apiCatalogo } from "@/lib/api-catalogo";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/catalogos`;

// función base reutilizable
async function fetchCatalogo(endpoint: string) {
  return apiCatalogo(`${baseUrl}/${endpoint}`, {
    method: "GET",
  });
}

// funciones específicas (naming consistente)
export const listarTiposDocumento = () => fetchCatalogo("tipos-documento");
export const listarGeneros = () => fetchCatalogo("generos");
export const listarEstadosCiviles = () => fetchCatalogo("estados-civiles");
export const listarTiposCuentaBancaria = () => fetchCatalogo("tipos-cuenta-bancaria");
export const listarSistemasPensiones = () => fetchCatalogo("sistemas-pensiones");
export const listarNivelesEducativos = () => fetchCatalogo("niveles-educativos");
export const listarTiposParentesco = () => fetchCatalogo("tipos-parentesco");
export const listarTiposContrato = () => fetchCatalogo("tipos-contrato");
export const listarTiposJornada = () => fetchCatalogo("tipos-jornada");
