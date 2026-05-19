import { CatalogoItem } from "../catalogo.type";

export function mapCatalogToId(catalogo: CatalogoItem[], value: string): string {
  if (!value) return "";

  const item = catalogo.find((c) => c.nombre === value);

  return item ? String(item.id) : "";
}
