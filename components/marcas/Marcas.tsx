"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
] as const;

const TRUST_STATS = [
  {
    icon: WorkspacePremiumOutlinedIcon,
    label: "Marcas líderes",
    value: "25+",
  },
  {
    icon: VerifiedOutlinedIcon,
    label: "Productos originales",
    value: "100%",
  },
  {
    icon: LocalShippingOutlinedIcon,
    label: "Disponibilidad",
    value: "Inmediata",
  },
] as const;

const FIREBASE_BRAND_BASE =
  "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Marcas%2F";

function getBrandLogoUrl(brand: string) {
  return `${FIREBASE_BRAND_BASE}${encodeURIComponent(brand)}.png?alt=media`;
}

function getBrandInitials(brand: string) {
  return brand
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

interface BrandCardProps {
  brand: string;
  onSelect: (brand: string) => void;
}

function BrandCard({ brand, onSelect }: BrandCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect(brand)}
      aria-label={`Ver productos de ${brand}`}
      title={brand}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border-base bg-surface text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/60 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:hover:border-orange-500/50"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 scale-x-0 bg-linear-to-r from-orange-500 to-orange-600 transition-transform duration-300 group-hover:scale-x-100" />

      <div className="relative flex min-h-30 flex-1 items-center justify-center px-4 py-8 sm:min-h-33 sm:px-5 sm:py-9">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 to-orange-600/0 transition-colors duration-300 group-hover:from-orange-500/5 group-hover:to-orange-600/10" />

        {imageError ? (
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-image text-lg font-bold tracking-wide text-orange-600 dark:text-orange-400">
            {getBrandInitials(brand)}
          </div>
        ) : (
          <div className="relative z-10 h-14 w-full opacity-75 grayscale transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 sm:h-16 lg:h-18">
            <Image
              src={getBrandLogoUrl(brand)}
              alt={`Logo de ${brand}`}
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 12vw"
              className="object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      <div className="border-t border-border-base bg-surface-secondary/70 px-3 py-2.5 transition-colors duration-300 group-hover:bg-orange-50/80 dark:group-hover:bg-orange-950/20">
        <p className="truncate text-center text-[11px] font-semibold uppercase tracking-wide text-text-secondary transition-colors duration-300 group-hover:text-orange-700 dark:group-hover:text-orange-300">
          {brand}
        </p>
      </div>
    </button>
  );
}

export default function Marcas() {
  const router = useRouter();

  const handleBrandSelect = useCallback(
    (brand: string) => {
      router.push(`/productFilter?brand=${encodeURIComponent(brand)}`);
    },
    [router],
  );

  return (
    <section className="relative w-full overflow-hidden bg-surface-secondary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-screen-2xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 2xl:px-12">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 dark:bg-orange-950 dark:text-orange-400">
            <VerifiedOutlinedIcon sx={{ fontSize: 14 }} />
            Marcas de confianza
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl lg:text-4xl">
            Aliados estratégicos del sector
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
            Trabajamos con marcas reconocidas en construcción para garantizar materiales de calidad, respaldo técnico y
            disponibilidad en cada proyecto.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-3 sm:mb-16 sm:grid-cols-3 sm:gap-4">
          {TRUST_STATS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border-base bg-surface px-4 py-3.5 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
                <Icon sx={{ fontSize: 22 }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold leading-none text-text-primary">{value}</p>
                <p className="mt-1 text-xs text-text-secondary">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {BRANDS.map((brand) => (
            <BrandCard key={brand} brand={brand} onSelect={handleBrandSelect} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
          <p className="text-center text-sm text-text-secondary">
            Y muchas marcas más disponibles en nuestra tienda física y online
          </p>

          <Link
            href="/productFilter"
            className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:from-orange-600 hover:to-orange-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />
            Explorar catálogo completo
            <ArrowForwardIcon
              sx={{ fontSize: 16 }}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
