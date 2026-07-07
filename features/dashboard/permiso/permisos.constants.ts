import { ChipProps } from "@mui/material";

//! Condicion
export const CondicionPermisoColor: Record<string, ChipProps["color"]> = {
  Pendiente: "warning",
  Aprobado: "success",
  Rechazado: "error",
};

export const CondicionPermisoLabel: Record<string, string> = {
  Pendiente: "Pendiente",
  Aprobado: "Aprobado",
  Rechazado: "Rechazado",
};

//! Avatar
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

//! Fechas
export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

//! Horas
export const formatHoras = (horas: number): string => {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
};
