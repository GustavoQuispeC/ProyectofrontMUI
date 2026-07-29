"use client";

import {
  AccessTime,
  ArrowForward,
  Facebook,
  Instagram,
  Mail,
  MapOutlined,
  StorefrontOutlined,
  X,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const WHATSAPP_NUMBER = "51904193374";
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, quiero cotizar materiales. ¿Me pueden ayudar?",
)}`;

const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/#categorias" },
  { label: "Catálogo", href: "/productFilter" },
  { label: "Marcas", href: "/#marcas" },
  { label: "Ofertas", href: "/#ofertas" },
  { label: "Contáctenos", href: "/#contacto" },
];

const socialLinks = [
  { name: "Facebook", icon: <Facebook fontSize="small" />, className: "hover:bg-blue-600 hover:text-white" },
  {
    name: "Instagram",
    icon: <Instagram fontSize="small" />,
    className: "hover:bg-linear-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white",
  },
  // { name: "X", icon: <X fontSize="small" />, className: "hover:bg-slate-900 hover:text-white" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-50 text-slate-800 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_20%_0%,rgba(249,115,22,0.12),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.12),transparent_30%)] dark:block" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-2 sm:py-4 lg:grid-cols-[1.25fr_0.85fr_1fr] lg:gap-12">
          <section aria-label="Grupo Famet">
            <Link href="/" className="group inline-flex items-center">
              <Image
                src="/LogoFamet2.png"
                alt="Grupo Famet"
                width={170}
                height={64}
                loading="lazy"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] dark:brightness-110"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              Materiales de construcción con atención cercana para proyectos que necesitan calidad, seguridad y
              confianza desde la compra hasta la entrega.
            </p>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950"
            >
              Cotizar por WhatsApp
              <ArrowForward
                fontSize="small"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>

            <ul className="mt-6 flex items-center gap-2" aria-label="Redes sociales">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href="#"
                    aria-label={social.name}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:focus:ring-offset-slate-950 ${social.className}`}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Enlaces del footer">
            <FooterTitle>Enlaces rápidos</FooterTitle>
            <ul className="grid grid-cols-2 gap-2 sm:max-w-md lg:grid-cols-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-white hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-orange-300"
                  >
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="translate-x-0 text-orange-500 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      /
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-label="Contacto">
            <FooterTitle>Contacto directo</FooterTitle>
            <ul className="space-y-1">
              <FooterContactItem
                label="Tienda Libertad"
                value="904 193 374"
                href={WA_LINK}
                icon={<StorefrontOutlined fontSize="small" />}
                variant="whatsapp"
              />
              <FooterContactItem
                label="Tienda Salamanca"
                value="904 193 374"
                href={WA_LINK}
                icon={<StorefrontOutlined fontSize="small" />}
                variant="whatsapp"
              />
              <FooterContactItem
                label="Almacén principal"
                value="904 193 374"
                href={WA_LINK}
                icon={<StorefrontOutlined fontSize="small" />}
                variant="whatsapp"
              />
              <FooterContactItem
                label="Correo electrónico"
                value="grupo.fametsac@gmail.com"
                href="mailto:grupo.fametsac@gmail.com"
                icon={<Mail fontSize="small" />}
              />
            </ul>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                  <AccessTime fontSize="small" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Horario de atención</h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Lun - Vie: 8:00 AM - 6:30 PM</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Sáb: 8:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 py-5 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">Grupo Famet SAC</span>
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-end">
            {["Privacidad", "Términos", "Seguridad"].map((label) => (
              <li key={label}>
                <a className="transition-colors hover:text-orange-600 dark:hover:text-orange-300" href="#">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
      <span className="h-5 w-1 rounded-full bg-orange-500" />
      {children}
    </h3>
  );
}

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
  icon: React.ReactNode;
  variant?: "whatsapp";
}) {
  const isWhatsApp = variant === "whatsapp";

  return (
    <li>
      <a
        href={href}
        target={isWhatsApp ? "_blank" : undefined}
        rel={isWhatsApp ? "noreferrer" : undefined}
        className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-white/10 dark:bg-white/4 dark:hover:border-orange-400/50 dark:hover:bg-white/[0.07]"
      >
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
            isWhatsApp
              ? "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-500/15 dark:text-emerald-300"
              : "bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white dark:bg-orange-500/15 dark:text-orange-300"
          }`}
        >
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {label}
          </span>
          <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</span>
        </span>
      </a>
    </li>
  );
}
