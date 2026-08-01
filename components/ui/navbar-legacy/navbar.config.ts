import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

// ─── Productos ─────────────────────────────────────────────

export const PRODUCT_ITEMS = [
  {
    icon: MonitorOutlinedIcon,
    label: "Cementos",
    href: "/productFilter?category=Cementos",
  },
  {
    icon: StorageOutlinedIcon,
    label: "Fierros",
    href: "/productFilter?category=Fierros",
  },
  {
    icon: PhoneAndroidOutlinedIcon,
    label: "Ladrillos",
    href: "/productFilter?category=Ladrillos",
  },
  {
    icon: StarBorderOutlinedIcon,
    label: "Perfiles y Tubos",
    href: "/productFilter?category=Perfiles%20y%20Tubos",
  },
  {
    icon: StarBorderOutlinedIcon,
    label: "Tuberías, tanques y accesorios",
    href: "/productFilter?category=Tuber%C3%ADas%2C%20tanques%20y%20accesorios",
  },
] as const;
