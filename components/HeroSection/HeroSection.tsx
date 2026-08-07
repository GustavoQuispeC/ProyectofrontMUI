'use client'

export default function HeroSection() {

   return (
      <>
         {/* hero section */}
         <section className="px-4 md:px-8 mt-12">
            <div className="max-w-7xl mx-auto">
               <div className="grid justify-center items-center gap-x-12 gap-y-16 lg:grid-cols-2">
                  <div>
                     <div className="max-w-3xl mx-auto text-center lg:mx-0 lg:text-left">
                        <p className="mb-2 font-medium text-orange-700 text-sm uppercase"><span
                           className="rotate-90 inline-block mr-2">|</span> Construye con nosotros</p>
                        <h1 className="text-4xl text-slate-900 font-bold leading-tight! mb-6 md:text-5xl">
                           Soluciones para Empresas y Hogares</h1>
                        <p className="text-slate-600 text-lg leading-relaxed">
                           Atendemos a mayoristas, minoristas y público en general con un amplio catálogo de materiales de construcción y ferretería, brindando calidad, disponibilidad y los mejores precios.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                           <a href="#"
                              className="py-2.5 px-4 text-sm rounded-md font-semibold text-white border border-orange-600 bg-orange-600 hover:bg-orange-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                              Contáctanos
                           </a>
                           <a href="#"
                              className="py-2.5 px-4 text-slate-900 text-sm font-semibold rounded-md bg-white border border-slate-300 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
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
                     <div className="break-inside-avoid">
                        {/* 252*252 */}
                        <img src="/HeroSection/Sika.png" alt="face-primer-category"
                           className="w-full h-full object-cover object-top rounded-lg max-h-90" />
                     </div>
                     <div className="break-inside-avoid">
                        {/* 540*720 */}
                        <img src="/HeroSection/Fierros.webp" alt="product6"
                           className="w-full h-full object-cover object-top rounded-lg max-h-90" />
                     </div>
                     <div className="break-inside-avoid">
                        {/* 540*720 */}
                        <img src="/HeroSection/Cemento.webp" alt="product2"
                           className="w-full h-full object-cover object-top rounded-lg max-h-90" />
                     </div>
                     <div className="break-inside-avoid">
                         {/* 252*252 */}
                        <img src="/HeroSection/Envios.png" alt="skin-glow-category"
                           className="w-full h-full object-cover object-top rounded-lg max-h-90" />
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}