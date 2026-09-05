"use client";

import { useState } from "react";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import NavigationOutlinedIcon from "@mui/icons-material/NavigationOutlined";
import Phone from "@mui/icons-material/Phone";
import Mail from "@mui/icons-material/Mail";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const tiendas = [
  {
    id: 1,
    nombre: "Tienda Libertad",
    direccion: "Jr. Libertad 824",
    telefono: "970253391",
    horario: "Lun - Vie: 8:00 AM - 7:00 PM | Sáb: 8:00 AM - 1:00 PM",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2707623661913!2d-77.87393042323248!3d-6.227988993760102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91b6ab302a2a09a7%3A0x71faab90638d4838!2sGrupo%20Famet!5e0!3m2!1ses!2spe!4v1770703752465!5m2!1ses!2spe",
    gmapsLink: "https://www.google.com/maps?q=Grupo%20Famet",
  },
  {
    id: 2,
    nombre: "Tienda Salamanca",
    direccion: "Jr. Salamanca 858",
    telefono: "970232330",
    horario: "Lun - Vie: 8:00 AM - 6:00 PM | Sáb: 8:00 AM - 1:00 PM",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.140116959124!2d-77.87222178117379!3d-6.226735088928205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91b6ab3d0ad44f01%3A0x554e80bc9ed5e677!2sNEGOCIOS%20FAMET!5e0!3m2!1ses!2spe!4v1770704383965!5m2!1ses!2spe",
    gmapsLink: "https://www.google.com/maps?q=NEGOCIOS%20FAMET",
  },
  {
    id: 3,
    nombre: "Almacén Principal",
    direccion: "Cruce Pucacruz",
    telefono: "904193374",
    horario: "Lun - Vie: 8:00 AM - 6:00 PM | Sáb: 8:00 AM - 1:00 PM",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15864.590983710019!2d-77.89342045783998!3d-6.24425191674977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91b6aba3605476b9%3A0x24e39c6024492983!2sGrupo%20Famet%20sac!5e0!3m2!1ses!2spe!4v1770704463430!5m2!1ses!2spe",
    gmapsLink: "https://www.google.com/maps?q=Grupo%20Famet%20sac",
  },
];

export default function Contactenos() {
  const [tiendaActiva, setTiendaActiva] = useState(tiendas[0]);

  const email = "administrador@grupofamet.com";

  return (
    <section id="contacto" className="bg-white">
      <div className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-12">
          {/* Header mejorado */}
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <FmdGoodOutlinedIcon className="w-4 h-4" />
              Nuestras ubicaciones
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-950 mb-4">
              Visítanos o contáctanos
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Elige una sede para ver el mapa y obtener indicaciones. Estamos listos para ayudarte con tu compra.
            </p>
          </div>

          {/* Content */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* MAPA mejorado */}
            <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FmdGoodOutlinedIcon className="w-4 h-4 text-orange-600 shrink-0" />
                    <p className="text-xs uppercase tracking-wide font-semibold text-slate-500">
                      Ubicación seleccionada
                    </p>
                  </div>
                  <p className="font-bold text-lg text-blue-950 line-clamp-1">{tiendaActiva.nombre}</p>
                  <p className="text-sm text-slate-600">{tiendaActiva.direccion}</p>
                </div>

                <a
                  href={tiendaActiva.gmapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex shrink-0 items-center gap-2 
                    rounded-xl 
                    bg-linear-to-r from-orange-500 to-orange-600
                    hover:from-orange-600 hover:to-orange-700
                    px-5 py-2.5 
                    text-sm font-bold text-white 
                    shadow-lg hover:shadow-xl
                    transition-all duration-300
                    hover:scale-105
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                  "
                >
                  <NavigationOutlinedIcon sx={{ fontSize: 16 }} />
                  Cómo llegar
                </a>
              </div>

              <div className="relative flex-1 min-h-0">
                <iframe
                  key={tiendaActiva.id}
                  title={tiendaActiva.nombre}
                  src={tiendaActiva.mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* PANEL DERECHA mejorado */}
            <div className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              {/* Top: contacto rápido */}
              <div className="p-6 bg-orange-50 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-600 text-white">
                    <Phone sx={{ fontSize: 16 }} />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-700">Atención al cliente</p>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={`mailto:${email}`}
                    className="
                      group
                      flex items-center gap-3 
                      rounded-xl 
                      border border-slate-200
                      bg-white
                      px-4 py-2 
                      text-sm font-medium text-slate-800
                      hover:border-orange-300
                      hover:bg-orange-50
                      transition-all duration-300
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                    "
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-orange-100 transition-colors">
                      <Mail sx={{ fontSize: 18 }} className="text-slate-600 group-hover:text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-0.5">Correo electrónico</p>
                      <p className="font-semibold truncate">{email}</p>
                    </div>
                  </a>

                  <a
                    href={`tel:${tiendaActiva.telefono.replace(/\s/g, "")}`}
                    className="
                      group
                      flex items-center gap-3 
                      rounded-xl 
                      border border-slate-200
                      bg-white
                      px-4 py-2 
                      text-sm font-medium text-slate-800
                      hover:border-orange-300
                      hover:bg-orange-50
                      transition-all duration-300
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                    "
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-orange-100 transition-colors">
                      <Phone sx={{ fontSize: 18 }} className="text-slate-600 group-hover:text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-0.5">Teléfono</p>
                      <p className="font-semibold">{tiendaActiva.telefono}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Lista de tiendas */}
              <div className="p-3">
                <p className="px-3 py-1 text-xs uppercase tracking-wide font-bold text-slate-500">
                  Selecciona una tienda
                </p>

                <div className="space-y-2 mt-2">
                  {tiendas.map((tienda) => {
                    const activa = tienda.id === tiendaActiva.id;

                    return (
                      <button
                        key={tienda.id}
                        onClick={() => setTiendaActiva(tienda)}
                        className={[
                          "w-full text-left rounded-xl px-4 py-3 transition-all duration-300",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                          activa
                            ? "bg-orange-50 border border-orange-200 shadow-sm"
                            : "hover:bg-slate-50 border border-transparent hover:border-slate-200",
                        ].join(" ")}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={[
                              "mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300",
                              activa
                                ? "bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-lg"
                                : "bg-slate-100 text-slate-500",
                            ].join(" ")}
                          >
                            <FmdGoodOutlinedIcon sx={{ fontSize: 20 }} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-base text-slate-900">{tienda.nombre}</h3>
                              {activa && (
                                <span className="shrink-0 rounded-full bg-orange-600 text-white px-2.5 py-0.5 text-xs font-bold">
                                  Activa
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-slate-600 mb-1">{tienda.direccion}</p>

                            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Phone sx={{ fontSize: 12 }} />
                                {tienda.telefono}
                              </span>
                              <span className="flex items-center gap-1">
                                <AccessTimeOutlinedIcon sx={{ fontSize: 12 }} />
                                {tienda.horario}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer mejorado */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-900 text-white shrink-0">
                    <Mail sx={{ fontSize: 18 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">¿Necesitas ayuda con tu pedido?</p>
                    <p className="text-sm text-slate-600">Escríbenos y te asesoramos en todo lo que necesites.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
