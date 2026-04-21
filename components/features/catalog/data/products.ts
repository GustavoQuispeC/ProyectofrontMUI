import { CatalogProduct } from "../interfaces/catalog";

export const PRODUCTS: CatalogProduct[] = [
  {
    id: 1,
    name: "Camiseta de lino",
    category: "Ropa",
    price: 89,
    emoji: "👕",
    badge: "Nuevo",
    description: "Tejido fresco para uso diario.",
  },
  {
    id: 2,
    name: "Pantalon cargo",
    category: "Ropa",
    price: 149,
    emoji: "👖",
    description: "Corte relajado con bolsillos utilitarios.",
  },
  {
    id: 3,
    name: "Sudadera urban",
    category: "Abrigos",
    price: 129,
    emoji: "🧥",
    description: "Interior suave y ajuste comodo.",
  },
  {
    id: 4,
    name: "Zapatillas trail",
    category: "Calzado",
    price: 199,
    emoji: "👟",
    badge: "Top",
    description: "Traccion extra para ciudad y ruta.",
  },
  {
    id: 5,
    name: "Mochila compacta",
    category: "Accesorios",
    price: 119,
    emoji: "🎒",
    description: "Organizacion inteligente para todo el dia.",
  },
  {
    id: 6,
    name: "Gorra deportiva",
    category: "Accesorios",
    price: 59,
    emoji: "🧢",
    description: "Visera curva y ajuste posterior rapido.",
  },
];
