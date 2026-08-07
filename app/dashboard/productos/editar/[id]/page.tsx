"use client";

import EditarProducto from "@/components/producto/editar-producto/EditarProducto";
import { useParams } from "next/navigation";

export default function EditarProductoPage() {
  const params = useParams();
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return <div>ID de producto inválido</div>;
  }

  return <EditarProducto id={id} />;
}
