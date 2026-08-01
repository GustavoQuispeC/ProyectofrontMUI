"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface Category {
  label: string;
  image: string;
}

interface CategoryCarouselProps {
  title?: string;
  categories?: Category[];
  onSelectCategory?: (category: Category) => void;
}

// Tamaño de imagen recomendado: 600x800px (aspect ratio 3:4) para mejor calidad en todas las resoluciones
const DEFAULT_CATEGORIES: Category[] = [
  {
    label: "Cementos",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCEMENTOS.png?alt=media&token=5d3cda29-4bb0-4995-8a06-8ba682fad27d",
  },
  {
    label: "Ladrillos",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FLADRILLOS.png?alt=media&token=d5e605cf-989e-4687-9117-6f7d9ae937a7",
  },
  {
    label: "Clavos",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCLAVOS.png?alt=media&token=b28b962f-bab1-4ab4-a8af-39554ac19f70",
  },
  {
    label: "Perfiles y Tubos",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FPERFILES.png?alt=media&token=a9a0deef-eb83-458a-8275-72cf3b3d9338",
  },
  {
    label: "Alambres",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FALAMBRES.png?alt=media&token=90569c1e-7376-4c63-8de0-bd811dac7435",
  },
  {
    label: "Teja Andina",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FTEJA%20ANDINA.png?alt=media&token=783b20f5-7e8d-4cce-bc89-b8a85f45d2c2",
  },
  {
    label: "Tuberías, tanques y accesorios",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FTUBERIAS.png?alt=media&token=11c93a02-c2fa-4d91-8687-1dcc0d76127e",
  },
  {
    label: "Fierros",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FFIERROS.png?alt=media&token=bed4ba9b-a40d-40b3-a0c3-e0dff043de68",
  },
  {
    label: "Calaminas",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCALAMINA.png?alt=media&token=58b0c4dc-2a02-467e-8bf3-4edc4a0f9ec3",
  },
];

export default function Categorias({
  title = "Busca por categoría",
  categories = DEFAULT_CATEGORIES,
  onSelectCategory,
}: CategoryCarouselProps) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCards = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = card ? card.offsetWidth + 12 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * cardWidth * 2, behavior: "smooth" });
  };

  const handleCategoryClick = (category: Category) => {
    router.push(`/productFilter?category=${encodeURIComponent(category.label)}`);
    onSelectCategory?.(category);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-blue-950 mb-2">{title}</h2>

      <div className="relative group">
        {/* Flecha izquierda */}
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          disabled={!canScrollLeft}
          aria-label="Desplazar a la izquierda"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10
            flex items-center justify-center w-8 h-12 rounded-lg bg-white shadow-lg
            border border-neutral-200 transition-opacity duration-200
            ${canScrollLeft ? "opacity-100 hover:bg-neutral-50" : "opacity-0 pointer-events-none"}`}
        >
          <ChevronLeftIcon className="w-5 h-5 text-neutral-800" />
        </button>

        {/* Flecha derecha */}
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          disabled={!canScrollRight}
          aria-label="Desplazar a la derecha"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
            flex items-center justify-center w-8 h-12 rounded-lg bg-white shadow-lg
            border border-neutral-200 transition-opacity duration-200
            ${canScrollRight ? "opacity-100 hover:bg-neutral-50" : "opacity-0 pointer-events-none"}`}
        >
          <ChevronRightIcon className="w-5 h-5 text-neutral-800" />
        </button>

        {/* Carrusel */}
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory
            scrollbar-none [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden px-1"
        >
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              data-card
              onClick={() => handleCategoryClick(cat)}
              className="group relative shrink-0 snap-start w-40 sm:w-48 md:w-64 lg:w-72 h-64 md:h-75
                 overflow-hidden focus:outline-none focus:ring-2
                focus:ring-offset-2 cursor-pointer"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 256px, 288px"
                className="object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent transition-colors duration-300 group-hover:from-black/85" />
              <span className="absolute bottom-4 left-4 text-white font-extrabold text-lg sm:text-xl tracking-tight uppercase">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
