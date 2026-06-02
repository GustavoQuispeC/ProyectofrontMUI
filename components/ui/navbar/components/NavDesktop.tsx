
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
      <span className="opacity-70">
        <WorkOutlineOutlinedIcon fontSize="small" />
      </span>

      Ver por categorias

      <KeyboardArrowDownIcon
        fontSize="small"
        className={`transition-transform duration-200 ${
          openDropdown === "products" ? "rotate-180" : ""
        }`}
      />
    </>
  );

  return (
    <div className="hidden md:flex items-center gap-1 flex-1">
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
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-800">
         Categorias
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
  label="Catálogo de Productos"
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