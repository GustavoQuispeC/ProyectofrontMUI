"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

interface Props {
  mobileImages: string[];
  desktopImages: string[];
  buttonHref?: string;
  buttonText?: string;
}

export default function Carousel({
  mobileImages,
  desktopImages,
  buttonHref = "/productFilter",
  buttonText = "Ver Catálogo",
}: Props) {
  // 1. Inicialización correcta del plugin
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Suscribirse a eventos
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Ejecutar una vez al inicio
    onSelect();

    // 2. LIMPIEZA: Es fundamental para evitar bugs de duplicidad
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
        {/* Contenedor de Embla */}
        <div
          className="overflow-hidden shadow-xl relative border border-slate-200"
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Banner principal"
        >
          <div className="flex">
            {mobileImages.map((mobileSrc, index) => {
              const desktopSrc = desktopImages[index] || mobileSrc;
              return (
                <div key={index} className="relative min-w-0 flex-[0_0_100%] aspect-video md:aspect-25/9">
                  <Image
                    src={mobileSrc}
                    alt={`Banner ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    className="object-cover md:hidden"
                  />
                  <Image
                    src={desktopSrc}
                    alt={`Banner ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    className="object-cover hidden md:block"
                  />

                  <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20">
                    <Link
                      href={buttonHref}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-lg transition active:scale-95"
                    >
                      {buttonText}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flechas de Navegación */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <button
              type="button"
              onClick={scrollPrev}
              className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/70 backdrop-blur-md border border-white/20 rounded-full p-2 hover:scale-110 flex items-center justify-center"
              aria-label="Anterior"
            >
              <ChevronLeft fontSize="medium" className="text-gray-900" />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/70 backdrop-blur-md border border-white/20 rounded-full p-2 hover:scale-110 flex items-center justify-center"
              aria-label="Siguiente"
            >
              <ChevronRight fontSize="medium" className="text-gray-900" />
            </button>
          </div>

          {/* Indicadores (Dots) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {mobileImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  selectedIndex === index ? "w-8 bg-white shadow-lg" : "w-1.5 bg-white/40 hover:bg-white/60",
                )}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
