import { ChipProps } from "@mui/material";
import { EstadoPeriodoVacacional } from "./vacaciones.type";

//! Estados de período
export const EstadoPeriodoColor: Record<EstadoPeriodoVacacional, ChipProps["color"]> = {
  [EstadoPeriodoVacacional.Incompleto]: "warning",
  [EstadoPeriodoVacacional.Completo]: "success",
};

//! Labels de estados de período
export const EstadoPeriodoLabel: Record<EstadoPeriodoVacacional, string> = {
  [EstadoPeriodoVacacional.Incompleto]: "Incompleto",
  [EstadoPeriodoVacacional.Completo]: "Completo",
};
