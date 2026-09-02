"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useCategoriasPublicas } from "@/features/dashboard/categoria/hooks/useCategorias";

export interface Category {
  label: string;
  image: string;
}

interface CategoryCarouselProps {
  title?: string;
  categories?: Category[];
  onSelectCategory?: (category: Category) => void;
}

export default function MostrarCategorias({
  title = "Busca por categoría",
  categories: propCategories,
  onSelectCategory,
}: CategoryCarouselProps) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { categorias } = useCategoriasPublicas();

  const categories =
    propCategories ||
    (categorias.length > 0
      ? categorias
          .filter((cat) => cat.isActive && cat.categoriaPadreId === null)
          .sort((a, b) => a.orden - b.orden)
          .map((cat) => ({
            label: cat.nombre,
            image: cat.imagen || "https://via.placeholder.com/600x800?text=Sin+Imagen",
          }))
      : []);

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
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                className="group relative shrink-0 snap-start w-40 sm:w-48 md:w-64 lg:w-72 h-64 md:h-80
                   overflow-hidden focus:outline-none focus:ring-2
                  focus:ring-offset-2 cursor-pointer"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent transition-colors duration-300 group-hover:from-black/85" />
                <span className="absolute bottom-4 left-4 text-white font-extrabold text-lg sm:text-xl tracking-tight uppercase">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
