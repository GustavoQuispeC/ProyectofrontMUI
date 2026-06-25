// components/Dropdown.tsx
import type { DropdownId } from "../types";

// ─── Dropdown ────────────────────────────────────────────────────────────────

interface DropdownProps {
  id: DropdownId;
  openId: DropdownId;
  onToggle: (id: DropdownId) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  width?: string;
}

export function Dropdown({
  id,
  openId,
  onToggle,
  trigger,
  children,
  align = "left",
  width = "w-52",
}: DropdownProps) {
  const isOpen = openId === id;
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(id)}
        className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
          isOpen
            ? "border-blue-500/20 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/15 dark:bg-blue-950/70 dark:text-blue-300"
            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white"
        }`}
      >
        {trigger}
      </button>
      <div
        className={`absolute top-full mt-2 ${width} rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl z-50 transition-all duration-200 origin-top dark:border-white/10 dark:bg-zinc-950/95 ${
          align === "right" ? "right-0" : "left-0"
        } ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

import Link from "next/link";

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}

export function DropdownItem({
  icon,
  label,
  href,
  badge,
  danger,
  onClick,
}: DropdownItemProps) {
  const className = `
    flex items-center gap-2.5
    rounded-xl px-3 py-2.5
    text-sm
    transition-all duration-150
    ${
      danger
        ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
    }
  `;

  // ─── Si tiene href → navegación ─────────────────────────────
  if (href) {
    return (
      <Link href={href} className={className}>
        <span className="shrink-0 text-slate-400 dark:text-slate-500">{icon}</span>

        <span className="flex-1">{label}</span>

        {badge && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold leading-tight text-white">
            {badge}
          </span>
        )}
      </Link>
    );
  }

  // ─── Si NO tiene href → acción ─────────────────────────────
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} w-full text-left`}
    >
      <span className="shrink-0 text-slate-400 dark:text-slate-500">{icon}</span>

      <span className="flex-1">{label}</span>

      {badge && (
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold leading-tight text-white">
          {badge}
        </span>
      )}
    </button>
  );
}