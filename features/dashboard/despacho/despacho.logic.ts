import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { getAuthUser } from "@/shared/auth/auth.service";
import {
  asignarConductorVehiculoApi,
  completarDespachoApi,
  descargarPdfEnvioDomicilioApi,
  descargarPdfRecojoTiendaApi,
  despacharEnTiendaApi,
  listarConductoresDespachoApi,
  listarDespachosPorVentaApi,
  marcarDespachoEnRutaApi,
} from "./despacho.service";
import { AsignarConductorVehiculoRequest, Despacho, EnRutaRequest, ModalidadDespacho } from "./despacho.type";

export function esEnvioDomicilio(modalidad: ModalidadDespacho | null | undefined) {
  if (Number(modalidad) === 2) return true;
  if (Number(modalidad) === 1) return false;

  const valor = String(modalidad ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/gi, "")
    .toLowerCase();

  return valor === "enviodomicilio" || (valor.includes("envio") && valor.includes("domicilio"));
}

export function esRecojoTienda(modalidad: ModalidadDespacho | null | undefined) {
  if (Number(modalidad) === 1) return true;

  const valor = String(modalidad ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/gi, "")
    .toLowerCase();

  return valor === "recojotienda" || (valor.includes("recojo") && valor.includes("tienda"));
}

export async function listarDespachosPorVenta(ventaId: number) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para listar despachos");
  }

  return listarDespachosPorVentaApi(ventaId);
}

export async function listarConductoresDespacho() {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para listar conductores");
  }

  return listarConductoresDespachoApi();
}

export async function asignarConductorVehiculo(id: number, data: AsignarConductorVehiculoRequest) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para asignar el despacho");
  }

  return asignarConductorVehiculoApi(id, data);
}

export async function marcarDespachoEnRuta(despacho: Despacho, data?: EnRutaRequest) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para poner el despacho en ruta");
  }
  if (!esEnvioDomicilio(despacho.modalidad)) {
    throw new Error("El recojo en tienda no usa en ruta. Solo aplica para entregas a domicilio");
  }

  return marcarDespachoEnRutaApi(despacho.id, data);
}

export async function despacharEnTienda(despacho: Despacho, data: EnRutaRequest) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para despachar en tienda");
  }
  if (esEnvioDomicilio(despacho.modalidad)) {
    throw new Error("La entrega a domicilio se despacha poniendo el despacho en ruta");
  }

  return despacharEnTiendaApi(despacho.id, data);
}

export async function completarDespacho(despacho: Despacho) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para completar el despacho");
  }

  return completarDespachoApi(despacho.id);
}

export async function descargarPdfDespacho(despacho: Despacho) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para descargar el acta de entrega");
  }

  if (esRecojoTienda(despacho.modalidad)) {
    if (despacho.estado !== 3) {
      throw new Error("El despacho debe estar completado para descargar el acta de entrega");
    }
    return descargarPdfRecojoTiendaApi(despacho.id, `acta-recojo-${despacho.codigo}.pdf`);
  }

  if (esEnvioDomicilio(despacho.modalidad)) {
    if (despacho.estado !== 2 && despacho.estado !== 3) {
      throw new Error("El despacho debe estar en ruta o entregado para descargar el PDF");
    }
    return descargarPdfEnvioDomicilioApi(despacho.id, `acta-envio-${despacho.codigo}.pdf`);
  }

  throw new Error("La modalidad del despacho no permite descargar un acta de entrega");
}
