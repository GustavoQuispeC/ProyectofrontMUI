"use client";

import { useParams } from "next/navigation";
import EditarVehiculo from "@/components/vehiculo/editar-vehiculo/EditarVehiculo";

export default function EditarVehiculoPage() {
  const params = useParams();
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return <p>ID de vehículo inválido</p>;
  }

  return <EditarVehiculo id={id} />;
}
