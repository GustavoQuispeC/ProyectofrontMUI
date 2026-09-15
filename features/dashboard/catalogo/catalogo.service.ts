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
export const listarSistemasPensiones = () => fetchCatalogo("sistemas-pensiones");
export const listarNivelesEducativos = () => fetchCatalogo("niveles-educativos");
export const listarTiposParentesco = () => fetchCatalogo("tipos-parentesco");
export const listarTiposContrato = () => fetchCatalogo("tipos-contrato");
export const listarTiposJornada = () => fetchCatalogo("tipos-jornada");
export const listarMotivosEgreso = () => fetchCatalogo("motivos-egreso");
export const listarTiposDocumentoCompra = () => fetchCatalogo("tipos-documento-compra");

// Ventas y Despachos
export const listarEstadosVenta = () => fetchCatalogo("estados-venta");
export const listarEstadosPago = () => fetchCatalogo("estados-pago");
export const listarTiposPago = () => fetchCatalogo("tipos-pago");
export const listarEstadosDespacho = () => fetchCatalogo("estados-despacho");
export const listarModalidadesEntrega = () => fetchCatalogo("modalidades-entrega");
export const listarOrigenesSalida = () => fetchCatalogo("origenes-salida");
export const listarEstadosPedido = () => fetchCatalogo("estados-pedido");

// Caja
export const listarEstadosCajaSesion = () => fetchCatalogo("estados-caja-sesion");
export const listarEstadosPagoTransaccion = () => fetchCatalogo("estados-pago-transaccion");
export const listarTiposCajaMovimiento = () => fetchCatalogo("tipos-caja-movimiento");
export const listarTiposMovimientoCuentaCliente = () => fetchCatalogo("tipos-movimiento-cuenta-cliente");
