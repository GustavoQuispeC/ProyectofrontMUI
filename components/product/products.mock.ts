import { Product } from "./product.types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Taladro Percutor Bosch",
    brand: "Bosch",
    category: "Herramientas",
    price: 299,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSMt-dRCUd2cFRfDiNf-kPYCwpdBP1TNQ63MnoalOm8cUD0xCpJPU7s9NAkFSD8lgUL9pL2F1W9xchowpEnSsrmAMmUu8BA68__LA-3P_xo-agYTFWPZk1SGg",
    rating: 5,
    inStock: true,
    hasDiscount: true,
  },
  {
    id: 2,
    name: "Juego de Llaves Stanley",
    brand: "Stanley",
    category: "Herramientas",
    price: 149,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSMt-dRCUd2cFRfDiNf-kPYCwpdBP1TNQ63MnoalOm8cUD0xCpJPU7s9NAkFSD8lgUL9pL2F1W9xchowpEnSsrmAMmUu8BA68__LA-3P_xo-agYTFWPZk1SGg",
    rating: 4,
    inStock: true,
    hasDiscount: false,
  },
];