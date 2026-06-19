import { ChipProps } from "@mui/material";
import { EstadoPeriodoVacacional, EstadoVacacion } from "./vacaciones.type";

// ─── Estados ─────────────────────────────────────────────────────────────────
export const EstadoPeriodoColor: Record<EstadoPeriodoVacacional, ChipProps["color"]> = {
  [EstadoPeriodoVacacional.Incompleto]: "warning",
  [EstadoPeriodoVacacional.Completo]: "success",
};

export const EstadoPeriodoLabel: Record<EstadoPeriodoVacacional, string> = {
  [EstadoPeriodoVacacional.Incompleto]: "Incompleto",
  [EstadoPeriodoVacacional.Completo]: "Completo",
};
// export const EstadoVacacionColor: Record<EstadoVacacion, ChipProps["color"]> = {
//   [EstadoVacacion.Pendiente]: "warning",
//   [EstadoVacacion.Aprobado]: "success",
//   [EstadoVacacion.Rechazado]: "error",
//   [EstadoVacacion.Cancelado]: "default",
// };

// ─── Avatar ───────────────────────────────────────────────────────────────────
const avatarPalette = [
  { bg: "#2458da", color: "#ffffff" },
  { bg: "#15a167", color: "#ffffff" },
  { bg: "#621cb1", color: "#ffffff" },
  { bg: "#842910", color: "#ffffff" },
  { bg: "#125393", color: "#ffffff" },
  { bg: "#7e6014", color: "#ffffff" },
  { bg: "#136413", color: "#ffffff" },
  { bg: "#6a0c3b", color: "#ffffff" },
];
export const avatarStyle = (id: number) => avatarPalette[id % avatarPalette.length];

export const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

// ─── Fechas ───────────────────────────────────────────────────────────────────
export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
