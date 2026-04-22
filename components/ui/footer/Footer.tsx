"use client";
import { AccessTime, Facebook, Instagram, Mail, X } from "@mui/icons-material";
import Image from "next/image";
import React from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";

export default function Footer() {
  const WHATSAPP_NUMBER = "51904193374";
  const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola, quiero cotizar materiales. ¿Me pueden ayudar?",
  )}`;

  return (
    <footer className="relative w-full border-t border-slate-200 bg-gray-200 text-slate-900 transition-colors duration-300 dark:border-transparent dark:bg-linear-to-br dark:from-slate-950 dark:via-slate-950 dark:to-blue-950 dark:text-slate-200">
      {/* Patrón decorativo */}
      <div className="absolute inset-0 opacity-5 hidden dark:block pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="py-12 sm:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-5">
              <a href="#" className="inline-block group">
                <div className="relative">
                  <Image
                    src="/LogoFamet2.png"
                    alt="Grupo Famet"
                    width={160}
                    height={60}
                    priority
                    className="h-auto w-auto transition-transform duration-300 group-hover:scale-105 dark:brightness-110"
                  />
                </div>
              </a>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Somos una empresa especializada en la venta de materiales de construcción, orientada a brindar{" "}
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  calidad, seguridad y confianza
                </span>{" "}
                en cada proyecto.
              </p>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Síguenos en redes</p>
                <ul className="flex flex-wrap gap-3">
                  {[
                    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, color: "hover:bg-blue-600" },
                    {
                      name: "Instagram",
                      icon: <Instagram className="h-5 w-5" />,
                      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600",
                    },
                    { name: "X", icon: <X className="h-5 w-5" />, color: "hover:bg-slate-700" },
                  ].map((s) => (
                    <li key={s.name}>
                      <a
                        href="#"
                        className={`group inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:text-white hover:shadow-lg dark:border-white/20 dark:bg-white/5 ${s.color}`}
                      >
                        {s.icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-3">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <div className="h-6 w-1 rounded-full bg-linear-to-b from-orange-500 to-orange-600" />
                Enlaces rápidos
              </h3>

              <ul className="space-y-3">
                {[
                  { label: "Inicio", href: "#" },
                  { label: "Categorías", href: "#" },
                  { label: "Marcas", href: "#" },
                  { label: "Ofertas especiales", href: "#" },
                  { label: "Nosotros", href: "#" },
                  { label: "Contáctenos", href: "#" },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group inline-flex items-center gap-2 px-1 text-slate-600 transition-all duration-200 hover:text-orange-600 dark:text-slate-300 dark:hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-orange-500 dark:bg-slate-600" />
                      <span className="group-hover:translate-x-1 transition">{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* 🔥 Acceso interno discreto */}
              <div className="mt-4 pt-3 border-t border-dashed border-slate-300/40 dark:border-white/10">
                <a
                  href="/login-usuario"
                  className="group inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-orange-500 dark:text-slate-500 dark:hover:text-orange-400 transition-all duration-200"
                >
                  <GridViewOutlinedIcon className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  <span className="opacity-70 group-hover:opacity-100">Acceso interno</span>
                </a>
              </div>
            </div>

            {/* Contacto */}
            <div className="lg:col-span-4">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <div className="h-6 w-1 rounded-full bg-linear-to-b from-orange-500 to-orange-600" />
                Contacto directo
              </h3>

              <ul className="space-y-3">
                <FooterContactItem label="Tienda Libertad" value="904 193 374" href={WA_LINK} variant="whatsapp" />
                <FooterContactItem label="Tienda Salamanca" value="904 193 374" href={WA_LINK} variant="whatsapp" />
                <FooterContactItem
                  label="Correo electrónico"
                  value="grupo.fametsac@gmail.com"
                  href="mailto:grupo.fametsac@gmail.com"
                  icon={<Mail className="h-5 w-5" />}
                />
              </ul>

              <div className="mt-4 border border-slate-200 bg-white p-3 shadow-sm dark:border-blue-700/30 dark:bg-blue-900/30 rounded-xl">
                <div className="mb-1.5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-blue-600/30">
                    <AccessTime className="h-4 w-4 text-orange-600 dark:text-blue-300" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Horario de atención</h4>
                </div>
                <p className="ml-11 text-sm text-slate-600 dark:text-slate-300">Lun - Vie: 8:00 AM - 6:30 PM</p>
                <p className="ml-11 text-sm text-slate-600 dark:text-slate-300">Sáb: 8:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 py-6 dark:border-white/10">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <ul className="flex flex-wrap justify-center gap-5 text-sm md:justify-start">
              {["Privacidad", "Términos", "Seguridad"].map((label) => (
                <li key={label}>
                  <a href="#" className="text-slate-500 hover:text-orange-600 dark:text-slate-400">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-right">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">Grupo Famet SAC</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Sub-componente de Contacto ---------- */

function FooterContactItem({
  label,
  value,
  href,
  icon,
  variant,
}: {
  label: string;
  value: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "whatsapp";
}) {
  const isWA = variant === "whatsapp";

  // Icono de WhatsApp por defecto si es variant whatsapp
  const finalIcon = icon || (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor">
      <path d="M16 0a16 16 0 0 0-13.84 24.08L0 32l8.16-2.16A16 16 0 1 0 16 0zm0 29.33a13.22 13.22 0 0 1-6.72-1.8l-.48-.28-4.84 1.28 1.3-4.78-.32-.5A13.27 13.27 0 1 1 16 29.33zm7.38-9.38c-.4-.2-2.36-1.17-2.73-1.3s-.63-.2-.9.2-1.04 1.3-1.28 1.56-.48.3-.84.1a10.94 10.94 0 0 1-3.36-2.06 12.7 12.7 0 0 1-2.36-3.02c-.24-.4 0-.62.18-.84s.42-.52.63-.8c.2-.28.26-.46.38-.76s.06-.58 0-.8c-.1-.24-.94-2.4-1.3-3.3s-.7-.7-.96-.7h-.82a1.6 1.6 0 0 0-1.18.56 4.93 4.93 0 0 0-1.44 3.66c0 2.16 1.56 4.27 1.76 4.56s3.1 4.72 7.55 6.6a25.37 25.37 0 0 0 2.52.94 6 6 0 0 0 2.76.18c.84-.12 2.5-1 2.85-1.9s.35-1.7.25-1.88-.36-.28-.75-.48z" />
    </svg>
  );

  return (
    <li>
      <a
        href={href}
        target={isWA ? "_blank" : undefined}
        rel={isWA ? "noreferrer" : undefined}
        className={`group flex items-center gap-3 rounded-xl border-2 px-3 py-2 transition-all duration-300 shadow-xs ${
          isWA
            ? "border-emerald-100 bg-emerald-50 hover:border-emerald-400 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:hover:border-emerald-500/50"
            : "border-slate-100 bg-white hover:border-orange-400 dark:border-orange-900/30 dark:bg-orange-950/20 dark:hover:border-orange-500/50"
        }`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            isWA
              ? "bg-emerald-500 text-white dark:bg-emerald-600/20 dark:text-emerald-400 dark:group-hover:bg-emerald-500 dark:group-hover:text-white"
              : "bg-orange-500 text-white dark:bg-orange-600/20 dark:text-orange-400 dark:group-hover:bg-orange-500 dark:group-hover:text-white"
          }`}
        >
          {finalIcon}
        </div>
        <div className="flex-1 min-w-0">
          <small className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </small>
          <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-white truncate">
            {value}
          </span>
        </div>
      </a>
    </li>
  );
}
