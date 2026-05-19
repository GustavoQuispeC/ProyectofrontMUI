import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

// import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
// import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

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

// // ─── Recursos ─────────────────────────────────────────────

// export const RESOURCE_ITEMS = [
//   {
//     icon: MenuBookOutlinedIcon,
//     label: "Docs",
//     sub: "Technical docs",
//     href: "/docs",
//     bg: "bg-blue-50 dark:bg-blue-950",
//     color: "text-blue-600 dark:text-blue-400",
//   },
//   {
//     icon: OndemandVideoOutlinedIcon,
//     label: "Tutorials",
//     sub: "Step-by-step guides",
//     href: "/Tutorials",
//     bg: "bg-purple-50 dark:bg-purple-950",
//     color: "text-purple-600 dark:text-purple-400",
//   },
//   {
//     icon: EditOutlinedIcon,
//     label: "Blog",
//     sub: "Latest updates",
//      href: "/Blog",
//     bg: "bg-green-50 dark:bg-green-950",
//     color: "text-green-600 dark:text-green-400",
//   },
//   {
//     icon: HeadsetMicOutlinedIcon,
//     label: "Support",
//     sub: "Help center",
//      href: "/Support",
//     bg: "bg-red-50 dark:bg-red-950",
//     color: "text-red-500 dark:text-red-400",
//   },
// ] as const;