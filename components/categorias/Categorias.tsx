"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface CardData {
  title: string;
  img: string;
  description?: string;
}

interface CardProps {
  title: string;
  img: string;
  description?: string;
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

import Image from "next/image"; // Importa el componente de Next.js

// Asegúrate de que la interfaz CardProps incluya la definición correcta para usar Image
interface CardProps {
  title: string;
  img: string;
  description?: string;
}

function Card({ title, img, description }: CardProps) {
  return (
    <button
      type="button"
      className="group relative flex flex-col overflow-hidden rounded-2xl text-left w-full h-full bg-surface border border-border-base shadow-sm"
    >
      {/* Imagen — Aumentada a h-36 (144px) para mejor visualización */}
      {/* Mantenemos el shrink-0 para que no se comprima */}
      <div className="relative h-36 shrink-0 overflow-hidden bg-surface-image">
        <Image
          src={img}
          alt={title}
          fill // Ocupa todo el contenedor relativo
          sizes="(max-width: 768px) 45vw, (max-width: 1024px) 25vw, 18vw" // Ajusta según tus breakpoints del carrusel
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          // Mantenemos loading="lazy" por defecto en Next.js Image, o usa priority si es above-the-fold
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Contenido — Calibrado para reducir la distancia vertical */}
      {/* flex-1 asegura que ocupe el resto de los 260px */}
      <div className="flex flex-col flex-1 p-3 min-w-0 justify-between">
        {/* Bloque de Texto — Eliminamos márgenes excesivos */}
        <div className="space-y-0.5">
          {/* Título: Máximo 2 líneas */}
          <h3 className="text-[14px] font-bold text-text-primary leading-tight line-clamp-2">{title}</h3>

          {/* Descripción: Tamaño pequeño, máximo 2 líneas. */}
          <p className="text-[11px] text-text-secondary leading-snug">{description || "Calidad garantizada"}</p>
        </div>

        {/* Botón Explorar — Ajustado el pt-1.5 para acercarlo un poco más al texto si hay poco, 
           pero justify-between en el padre lo mantendrá abajo en la tarjeta de 260px. */}
        <div className="pt-1.5 flex items-center justify-between text-orange-600 dark:text-orange-400">
          <span className="text-[15px] font-bold uppercase tracking-wider">Explorar</span>
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </button>
  );
}
export default function Categorias() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const cards: CardData[] = useMemo(
    () => [
      {
        title: "Cementos",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCEMENTOS.png?alt=media&token=5d3cda29-4bb0-4995-8a06-8ba682fad27d",
        description: "Distribuidor autorizado",
      },
      {
        title: "Ladrillos",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FLADRILLOS.png?alt=media&token=d5e605cf-989e-4687-9117-6f7d9ae937a7",
      },
      {
        title: "Clavos",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCLAVOS.png?alt=media&token=b28b962f-bab1-4ab4-a8af-39554ac19f70",
      },
      {
        title: "Perfiles y Tubos",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FPERFILES.png?alt=media&token=a9a0deef-eb83-458a-8275-72cf3b3d9338",
      },
      {
        title: "Alambres",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FALAMBRES.png?alt=media&token=90569c1e-7376-4c63-8de0-bd811dac7435",
      },
      {
        title: "Teja Andina",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FTEJA%20ANDINA.png?alt=media&token=783b20f5-7e8d-4cce-bc89-b8a85f45d2c2",
      },
      {
        title: "Tuberías, tanques y accesorios",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FTUBERIAS.png?alt=media&token=11c93a02-c2fa-4d91-8687-1dcc0d76127e",
      },
      {
        title: "Fierros",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FFIERROS.png?alt=media&token=bed4ba9b-a40d-40b3-a0c3-e0dff043de68",
      },
      {
        title: "Calaminas",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCALAMINA.png?alt=media&token=58b0c4dc-2a02-467e-8bf3-4edc4a0f9ec3",
      },
    ],
    [],
  );

  const updateScrollButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollLeft(emblaApi.canScrollPrev());
    setCanScrollRight(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateScrollButtons);
    emblaApi.on("reInit", updateScrollButtons);
    const rafId = window.requestAnimationFrame(updateScrollButtons);
    return () => {
      window.cancelAnimationFrame(rafId);
      emblaApi.off("select", updateScrollButtons);
      emblaApi.off("reInit", updateScrollButtons);
    };
  }, [emblaApi, updateScrollButtons]);

  const scrollByCards = useCallback(
    (dir: "left" | "right") => {
      if (!emblaApi) return;
      if (dir === "left") {
        emblaApi.scrollPrev();
      } else {
        emblaApi.scrollNext();
      }
    },
    [emblaApi],
  );

  return (
    <section className="bg-surface-secondary">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full text-xs font-medium mb-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Categorías
            </div>
            <h2 className="text-xl sm:text-2xl font-bold ">Encuentra lo que necesitas</h2>
            <p className="mt-1 text-sm text-text-secondary">Materiales de construcción organizados por categoría</p>
          </div>

          {/* Flechas desktop alineadas a la derecha */}
          <div className="hidden lg:flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCards("left")}
              disabled={!canScrollLeft}
              className="flex items-center justify-center h-9 w-9 rounded-full border border-border-base shadow-sm hover:shadow transition-all text-text-primary hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards("right")}
              disabled={!canScrollRight}
              className="flex items-center justify-center h-9 w-9 rounded-full  border border-border-base shadow-sm hover:shadow transition-all text-text-primary hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Siguiente"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carrusel */}
        <div ref={emblaRef} className="overflow-hidden px-0.5 pb-2">
          <div className="flex items-stretch gap-3 sm:gap-4">
            {cards.map((card, index) => (
              <div
                key={`${card.title}-${index}`}
                className="min-w-0 flex-[0_0_45%] sm:flex-[0_0_33%] md:flex-[0_0_25%] lg:flex-[0_0_18%] xl:flex-[0_0_16%]"
                style={{ height: "260px" }}
              >
                <Card title={card.title} img={card.img} description={card.description} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots mobile */}
        <div className="lg:hidden flex justify-center gap-1.5 mt-3">
          {cards.slice(0, 5).map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          ))}
        </div>
      </div>
    </section>
  );
}
