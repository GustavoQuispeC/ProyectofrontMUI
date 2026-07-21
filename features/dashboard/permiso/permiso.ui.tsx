import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";
import { Condicion } from "@/features/dashboard/permiso/permiso.type";

const condicionConfig: Record<Condicion, { color: ChipProps["color"]; label: string }> = {
  Pendiente: { color: "warning", label: "Pendiente" },
  Aprobado: { color: "success", label: "Aprobado" },
  Cancelado: { color: "error", label: "Cancelado" },
};

const isCondicion = (condicion: string): condicion is Condicion => condicion in condicionConfig;

export const chipCondicion = (condicion?: string | null) => {
  const config =
    condicion && isCondicion(condicion)
      ? condicionConfig[condicion]
      : { color: "default" as const, label: condicion?.trim() || "Sin estado" };

  return <Chip size="small" color={config.color} label={config.label} />;
};
