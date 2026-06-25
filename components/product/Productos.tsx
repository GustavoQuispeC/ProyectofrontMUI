"use client";

import { useState } from "react";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddToCartModal from "@/components/cartdrawer/AddToCartModal";
import { upsertCartItem } from "@/components/cartdrawer/cartService";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  badge?: string;
}

/* ================== LOCAL STORAGE CONFIG ================== */

export default function Productos() {
  const [isOpen, setIsOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const productosData: Producto[] = [
    {
      id: 1,
      nombre: "Sika Impermur",
      precio: 32,
      descripcion: "Impermeabilizante de alta resistencia para techos y muros.",
      imagen:
        "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/productos%2FSIKA%2FSIKA%20IMPERMUR.png?alt=media&token=5bf61563-0b54-4c38-833c-6e8fcb297e66",
      badge: "Nuevo",
    },
    {
      id: 2,
      nombre: "Cemento Extraforte",
      precio: 34,
      descripcion: "Cemento de alta durabilidad ideal para estructuras.",
      imagen:
        "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/productos%2FCEMENTO%2FPACASMAYO%20EXTRAFORTE.png?alt=media&token=4924ff61-2360-40cf-b832-630912ce01ec",
      badge: "Oferta",
    },
    {
      id: 3,
      nombre: "Cemento Mochica",
      precio: 33.2,
      descripcion: "Excelente rendimiento y resistencia estructural.",
      imagen:
        "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/productos%2FCEMENTO%2FCEMENTO%20MOCHICA.png?alt=media&token=1344c797-d93a-4ecb-b27f-1705cfedb7e7",
    },
    {
      id: 4,
      nombre: "Cemento Tipo 1",
      precio: 37.5,
      descripcion: "Ideal para construcciones generales.",
      imagen:
        "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/productos%2FCEMENTO%2FCEMENTO%20TIPO%201.png?alt=media&token=51630310-fee3-44bb-9d20-f5111601cef6",
    },
    {
      id: 5,
      nombre: "Tubo cuadrado 2.0*2.0mm*6mt",
      precio: 45.0,
      descripcion: "Perfil metálico resistente para estructuras.",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHE10nnA-l3uYYGnHWvdOEXiEnOh-hPZFwEQ&s",
    },
    {
      id: 6,
      nombre: "Calamina roja 0.3x0.8x3.60",
      precio: 25.0,
      descripcion: "Cobertura resistente para techos.",
      imagen:
        "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/productos%2FCALAMINA%2FCALAMINA%20ROJA.png?alt=media&token=673a3e65-be58-4b81-b013-e9235e8b4bc6",
    },
    {
      id: 7,
      nombre: "Teja Andina",
      precio: 44.0,
      descripcion: "Diseño moderno y alta resistencia climática.",
      imagen:
        "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/productos%2FTEJA%2FTEJA%20ANDINA.png?alt=media&token=9dd5edfe-554f-4ef2-8c08-e7ed839ff796",
    },
    {
      id: 8,
      nombre: "Fierro de 1/2",
      precio: 28.0,
      descripcion: "Barra de acero para refuerzo estructural.",
      imagen: "https://media.falabella.com/sodimacPE/211230_01/w=800,h=800,fit=pad",
    },
  ];

  const handleAgregar = (producto: Producto) => {
    upsertCartItem(producto, 1);
    setProductoSeleccionado(producto);
    setIsOpen(true);
  };

  return (
    <>
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
              Productos destacados
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 dark:text-white mb-4">
              Catálogo de Productos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Encuentra los mejores materiales de construcción con precios competitivos
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {productosData.map((producto) => (
              <div
                key={producto.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full relative transition-all duration-500 hover:-translate-y-2 min-w-0"
              >
                {/* Badge con Tailwind puro */}
                {producto.badge && (
                  <span
                    className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold shadow-lg text-white ${producto.badge === "Oferta" ? "bg-blue-600" : "bg-green-600"}`}
                  >
                    {producto.badge}
                  </span>
                )}

                {/* Imagen */}
                <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex justify-center items-center p-3 sm:p-5 lg:p-6 overflow-hidden">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Contenido */}
                <div className="p-3 sm:p-4 lg:p-5 flex flex-col grow bg-white dark:bg-gray-800">
                  <div className="grow">
                    <h3 className="font-bold text-sm sm:text-base text-blue-900 dark:text-white mb-2 line-clamp-2 min-h-10 sm:min-h-12">
                      {producto.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem]">
                      {producto.descripcion}
                    </p>
                  </div>

                  {/* Precio y botón */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg sm:text-2xl font-extrabold text-orange-500">S/ {producto.precio.toFixed(2)}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/unidad</span>
                    </div>

                    <button
                      onClick={() => handleAgregar(producto)}
                      className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 sm:py-2.5 text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <ShoppingCart sx={{ fontSize: 16 }} />
                      <span className="truncate">Agregar</span>
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-orange-500/0 group-hover:ring-orange-500/20 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 flex justify-center">
            <a
              href="/tienda"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 hover:bg-linear-to-r hover:from-orange-500 hover:to-orange-600 border-2 border-orange-500 text-orange-600 hover:text-white dark:text-orange-400 dark:hover:text-white font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              Ver todos los productos
              <ArrowForwardIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {isOpen && productoSeleccionado && (
        <AddToCartModal isOpen={isOpen} onClose={() => setIsOpen(false)} producto={productoSeleccionado} />
      )}
    </>
  );
}
