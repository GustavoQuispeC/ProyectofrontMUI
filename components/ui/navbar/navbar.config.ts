import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

// ─── Productos ─────────────────────────────────────────────

export const PRODUCT_ITEMS = [
  {
    icon: MonitorOutlinedIcon,
    label: "Cemento",
    href: "/software",
  },
  {
    icon: StorageOutlinedIcon,
    label: "Fierros",
    href: "/cloud",
  },
  {
    icon: PhoneAndroidOutlinedIcon,
    label: "Ladrillos",
    href: "/mobile",
  },
  {
    icon: StarBorderOutlinedIcon,
    label: "perfiles",
    href: "/featured",
  },
   {
    icon: StarBorderOutlinedIcon,
    label: "Tuberias",
    href: "/featured",
  },
] as const;
