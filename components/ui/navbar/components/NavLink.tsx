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
  const className = `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
    active
      ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
      : "text-gray-500 hover:bg-gray-100 hover:text-orange-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
  }`;

  // ─── Si tiene href → navegación ─────────────────────────────
  if (href) {
    return (
      <Link href={href} className={className}>
        <span className="opacity-70">{icon}</span>

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
      <span className="opacity-70">{icon}</span>

      {label}

      {badge && (
        <span className="ml-1 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
          {badge}
        </span>
      )}
    </button>
  );
}