import { ChipProps } from "@mui/material";

//! Condicion
export const CondicionPermisoColor: Record<string, ChipProps["color"]> = {
  Pendiente: "warning",
  Aprobado: "success",
  Cancelado: "error",
};

export const CondicionPermisoLabel: Record<string, string> = {
  Pendiente: "Pendiente",
  Aprobado: "Aprobado",
  Cancelado: "Cancelado",
};
