
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailIcon from "@mui/icons-material/Email";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { NavLink } from "./NavLink";
import { Dropdown, DropdownItem } from "./Dropdown";
import { PRODUCT_ITEMS} from "../navbar.config";
import type { DropdownId } from "../types";

interface NavDesktopProps {
  activeNav: string;
  openDropdown: DropdownId;
  onNavClick: (id: string) => void;
  onToggleDropdown: (id: DropdownId) => void;
}

export function NavDesktop({
  activeNav,
  openDropdown,
  onNavClick,
  onToggleDropdown,
}: NavDesktopProps) {
  const productTrigger = (
    <>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
        <WorkOutlineOutlinedIcon fontSize="small" />
      </span>

      Categorías

      <KeyboardArrowDownIcon
        fontSize="small"
        className={`transition-transform duration-200 ${
          openDropdown === "products" ? "rotate-180" : ""
        }`}
      />
    </>
  );

  return (
    <div className="hidden md:flex items-center gap-2 flex-1 rounded-full border border-white/60 bg-white/40 px-2 py-1 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      {/* Inicio */}
      <NavLink
        icon={<HomeOutlinedIcon fontSize="small" />}
        label="Inicio"
        active={activeNav === "Inicio"}
        onClick={() => onNavClick("Inicio")}
      />

      {/* Categoria de Productos */}
      <Dropdown
        id="products"
        openId={openDropdown}
        onToggle={onToggleDropdown}
        trigger={productTrigger}
      >
        <div className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
         Categorías
        </div>

        {PRODUCT_ITEMS.map(({ icon: Icon, label, href }) => (
          <DropdownItem
            key={label}
            icon={<Icon fontSize="small" />}
            label={label}
            href={href}
          />
        ))}
      </Dropdown>

      {/* Catalogo Productos */}
      <NavLink
        icon={<BusinessOutlinedIcon fontSize="small" />}
        label="Catálogo"
        href="/productFilter"
        active={activeNav === "productFilter"}
        onClick={() => onNavClick("productFilter")}
      />
      {/* Contact */}
      <NavLink
        icon={<EmailIcon fontSize="small" />}
        label="Contáctanos"
        href="/#contacto"
        active={activeNav === "contacto"}
        onClick={() => onNavClick("contacto")}
      />
    </div>
  );
}