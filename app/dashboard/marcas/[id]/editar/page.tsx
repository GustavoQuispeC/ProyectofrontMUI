"use client";

import { useParams } from "next/navigation";
import EditarMarca from "@/components/marcas/editar-marca/EditarMarca";

export default function EditarMarcaPage() {
  const params = useParams();
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return <p>ID de marca inválido</p>;
  }

  return <EditarMarca id={id} />;
}
