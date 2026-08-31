"use client";

import { Facebook, FmdGood, Instagram, Phone } from "@mui/icons-material";

const TIENDAS = [
  {
    id: 1,
    nombre: "Tienda Libertad",
    direccion: "Jr. Libertad 824",
    telefono: "970 253 391",
    whatsapp: "51970253391",
  },
  {
    id: 2,
    nombre: "Tienda Salamanca",
    direccion: "Jr. Salamanca 858",
    telefono: "970 232 330",
    whatsapp: "51970232330",
  },
  {
    id: 3,
    nombre: "Almacén Principal",
    direccion: "Cruce Pucacruz",
    telefono: "904 193 374",
    whatsapp: "51904193374",
  },
];

const FACEBOOK_URL = "https://www.facebook.com/p/Grupo-Famet-SAC-100044475944246/";
const INSTAGRAM_URL = "https://www.instagram.com/grupofametsac/";

export default function Banner() {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-50">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-3 px-4 py-2 text-xs sm:flex-row sm:gap-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
          <span className="inline-flex items-center gap-1 pr-4 font-medium text-orange-300 sm:pr-6">
            <FmdGood fontSize="inherit" />
            Chachapoyas - Amazonas
          </span>
          {TIENDAS.map((tienda) => (
            <a
              key={tienda.id}
              href={`https://wa.me/${tienda.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-orange-300"
              title={`${tienda.nombre} - ${tienda.direccion}`}
            >
              <span className="hidden font-medium sm:inline">{tienda.nombre}:</span>
              <span className="text-slate-300">{tienda.direccion}</span>
              <Phone fontSize="inherit" className="text-emerald-400" />
              <span className="font-medium">{tienda.telefono}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 transition-colors hover:bg-blue-600 hover:text-white"
          >
            <Facebook fontSize="small" />
            <span className="font-medium">Facebook</span>
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 transition-colors hover:bg-linear-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white"
          >
            <Instagram fontSize="small" />
            <span className="font-medium">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
}
