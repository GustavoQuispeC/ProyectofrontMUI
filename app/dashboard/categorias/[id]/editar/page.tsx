"use client";

import { useParams } from "next/navigation";
import EditarCategoria from "@/components/categorias/editar-categoria/EditarCategoria";

export default function EditarCategoriaPage() {
  const params = useParams();
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return <p>ID de categoría inválido</p>;
  }

  return <EditarCategoria id={id} />;
}
