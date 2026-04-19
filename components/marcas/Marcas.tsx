"use client";
import Image from "next/image";

const BRANDS = [
  "ACEROS AREQUIPA",
  "PACASMAYO",
  "ETERNIT",
  "SIDERPERU",
  "LARK",
  "NICOLL",
  "FIBRAFORTE",
  "UYUSTOOLS",
  "ANYPSA",
  "SIKA",
  "CPP",
  "PRODAC",
];

export default function Marcas() {
  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-12">
        {/* HEADER */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Marcas de confianza
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-900 dark:text-white mb-4">
            Aliados estratégicos
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Trabajamos con marcas reconocidas del sector construcción, garantizando materiales de calidad, confianza y
            respaldo para cada proyecto.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
          {BRANDS.map((brand) => (
            <a
              key={brand}
              href="#"
              aria-label={`Ver productos de ${brand}`}
              title={brand}
              className="
                group relative flex items-center justify-center
                rounded-2xl
                bg-white dark:bg-gray-800
                border-2 border-gray-200 dark:border-gray-700
                px-6 py-10
                shadow-sm hover:shadow-xl
                transition-all duration-500
                hover:-translate-y-2
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-orange-500
              "
            >
              {/* Efectos visuales */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl ring-2 ring-orange-500/0 group-hover:ring-orange-500/30 transition-all duration-500 pointer-events-none" />

              {/* Contenedor del Logo con Next.js Image */}
              <div className="relative h-14 sm:h-16 lg:h-20 w-full transition-all duration-500 group-hover:scale-110 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100">
                <Image
                  src={`https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Marcas%2F${encodeURIComponent(
                    brand,
                  )}.png?alt=media`}
                  alt={`Logo de ${brand}`}
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 15vw"
                  className="object-contain"
                  priority={false}
                />
              </div>
            </a>
          ))}
        </div>

        {/* Nota informativa */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Y muchas marcas más disponibles en nuestra tienda</p>
        </div>
      </div>
    </section>
  );
}
