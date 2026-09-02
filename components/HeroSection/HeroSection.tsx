"use client";

import Image from "next/image";

export default function HeroSection() {
  const scrollToContacto = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("contacto");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      {/* hero section */}
      <section className="w-full bg-white px-4 md:px-8 pt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid justify-center items-center gap-x-12 gap-y-16 lg:grid-cols-2">
            <div>
              <div className="max-w-3xl mx-auto text-center lg:mx-0 lg:text-left">
                <p className="mb-2 font-medium text-orange-700 text-sm uppercase">
                  <span className="rotate-90 inline-block mr-2">|</span> Construye con nosotros
                </p>
                <h1 className="text-4xl text-slate-900 font-bold leading-tight! mb-6 md:text-5xl">
                  Soluciones para Empresas y Hogares
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Atendemos a mayoristas, minoristas y público en general con un amplio catálogo de materiales de
                  construcción y ferretería, brindando calidad, disponibilidad y los mejores precios.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                  <a
                    href="#contacto"
                    onClick={scrollToContacto}
                    className="py-2.5 px-4 text-sm rounded-md font-semibold text-white border border-orange-600 bg-orange-600 hover:bg-orange-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    Contáctanos
                  </a>
                  <a
                    href="/productFilter"
                    className="py-2.5 px-4 text-slate-900 text-sm font-semibold rounded-md bg-white border border-slate-300 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    Catálogo
                  </a>
                </div>
              </div>

              <div className="mt-12">
                <div className="grid gap-x-4 gap-y-6 text-center sm:grid-cols-3 lg:text-left">
                  <div className="flex flex-col">
                    <h5 className="text-orange-700 font-semibold text-2xl mb-2">10+</h5>
                    <p className="text-base text-slate-600 font-medium">Años de Experiencia</p>
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-orange-700 font-semibold text-2xl mb-2">+500</h5>
                    <p className="text-base text-slate-600 font-medium">Clientes nos eligen</p>
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-orange-700 font-semibold text-2xl mb-2">+50</h5>
                    <p className="text-base text-slate-600 font-medium">Marcas asociadas</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns-2 space-y-4">
              <div className="break-inside-avoid relative aspect-square w-full overflow-hidden rounded-lg">
                {/* 252*252 */}
                <Image
                  src="/HeroSection/Sika.png"
                  alt="face-primer-category"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="break-inside-avoid relative aspect-3/4 w-full overflow-hidden rounded-lg">
                {/* 540*720 */}
                <Image
                  src="/HeroSection/Fierros.webp"
                  alt="product6"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="break-inside-avoid relative aspect-3/4 w-full overflow-hidden rounded-lg">
                {/* 540*720 */}
                <Image
                  src="/HeroSection/Cemento.webp"
                  alt="product2"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="break-inside-avoid relative aspect-square w-full overflow-hidden rounded-lg">
                {/* 252*252 */}
                <Image
                  src="/HeroSection/Envios.png"
                  alt="skin-glow-category"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
