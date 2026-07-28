"use client";

import DetalleEmpleado from "@/components/empleados/detalle-empleado/DetalleEmpleado";
import Box from "@mui/material/Box";
import { use } from "react";

export default function DetalleEmpleadoPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use(params);
  const numericId = Number(id);

  if (!numericId) {
    return <p>No se encontró el empleado</p>;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <DetalleEmpleado id={numericId} />
    </Box>
  );
}
