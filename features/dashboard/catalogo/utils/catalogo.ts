export function mapCatalogToId(catalogo: any[], value: string): string {
  if (!value) return "";

  const item = catalogo.find((c) => c.nombre === value);
  return item ? String(item.id) : "";
}
