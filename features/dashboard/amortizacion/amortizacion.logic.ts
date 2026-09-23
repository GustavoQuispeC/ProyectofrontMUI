import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { getAuthUser } from "@/shared/auth/auth.service";
import {
  amortizarClienteApi,
  amortizarVentaApi,
  listarVentasCreditoApi,
} from "./amortizacion.service";
import {
  AmortizarClienteRequest,
  AmortizarVentaRequest,
  ListarVentasCreditoRequest,
} from "./amortizacion.type";

export async function listarVentasCredito(params: ListarVentasCreditoRequest) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarAmortizaciones)) {
    throw new Error("No tienes privilegios para listar amortizaciones");
  }

  return listarVentasCreditoApi(params);
}

export async function amortizarVenta(ventaId: number, data: AmortizarVentaRequest) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.registrarAmortizacion)) {
    throw new Error("No tienes privilegios para registrar amortizaciones");
  }

  return amortizarVentaApi(ventaId, data);
}

export async function amortizarCliente(clienteId: number, data: AmortizarClienteRequest) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.registrarAmortizacion)) {
    throw new Error("No tienes privilegios para registrar amortizaciones");
  }

  return amortizarClienteApi(clienteId, data);
}
