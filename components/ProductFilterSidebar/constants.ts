import {
  ProductColor,
  ProductSize,
  ColorOption,
  Product,
} from "./types";

export const MAX_PRICE = 1000;

export const BRANDS: string[] = [
  "Zara",
  "H&M",
  "Uniqlo",
  "Levi's",
  "Nike",
  "Adidas",
  "Puma",
  "Tommy Hilfiger",
];

export const SIZES: ProductSize[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "4XL",
];

export const COLOR_OPTIONS: ColorOption[] = [
  {
    name: "Blue",
    bg: "bg-blue-600",
    ring: "ring-blue-600",
  },
  {
    name: "Purple",
    bg: "bg-purple-600",
    ring: "ring-purple-600",
  },
  {
    name: "Pink",
    bg: "bg-pink-500",
    ring: "ring-pink-500",
  },
  {
    name: "Orange",
    bg: "bg-orange-500",
    ring: "ring-orange-500",
  },
  {
    name: "Red",
    bg: "bg-red-600",
    ring: "ring-red-600",
  },
  {
    name: "Yellow",
    bg: "bg-yellow-400",
    ring: "ring-yellow-400",
  },
  {
    name: "Black",
    bg: "bg-neutral-900 dark:bg-neutral-100",
    ring: "ring-neutral-700",
  },
  {
    name: "Gray",
    bg: "bg-slate-400",
    ring: "ring-slate-400",
  }
];