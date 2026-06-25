// components/NavLink.tsx

import Link from "next/link";

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavLink({
  icon,
  label,
  href,
  badge,
  active,
  onClick,
}: NavLinkProps) {
  const className = `inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
    active
      ? "border-blue-500/20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20"
      : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white"
  }`;

  // ─── Si tiene href → navegación ─────────────────────────────
  if (href) {
    return (
      <Link href={href} className={className}>
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-white/15" : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-300"}`}>
          {icon}
        </span>

        {label}

        {badge && (
          <span className="ml-1 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
            {badge}
          </span>
        )}
      </Link>
    );
  }

  // ─── Si NO tiene href → acción ─────────────────────────────
  return (
    <button onClick={onClick} className={className}>
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-white/15" : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-300"}`}>
        {icon}
      </span>

      {label}

      {badge && (
        <span className="ml-1 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
          {badge}
        </span>
      )}
    </button>
  );
}