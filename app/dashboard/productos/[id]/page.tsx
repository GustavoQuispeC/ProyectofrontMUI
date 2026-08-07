import VerProducto from "@/components/producto/ver-producto/VerProducto";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetallePage({ params }: PageProps) {
  const { id } = await params;
  return <VerProducto id={id} />;
}
