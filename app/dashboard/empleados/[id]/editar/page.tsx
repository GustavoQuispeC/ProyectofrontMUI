"use client";

import { use } from "react";
import { EditarEmpleado } from "@/components";

export default function EditarEmpleadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <EditarEmpleado id={id} />;
}
