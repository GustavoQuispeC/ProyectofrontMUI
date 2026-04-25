import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import GroupIcon from "@mui/icons-material/Group";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Link from "next/link";

const mainListItems = [
  { text: "Inicio", icon: <HomeRoundedIcon />, href: "/dashboard/Inicio" },
  { text: "Productos", icon: <ProductionQuantityLimitsIcon />, href: "/dashboard/productos" },
  { text: "Usuarios", icon: <GroupIcon />, href: "/dashboard/usuarios/listar" },
  { text: "Empleados", icon: <AnalyticsRoundedIcon />, href: "/dashboard/empleados/listar" },
  { text: "Clients", icon: <AccountBoxIcon />, href: "/dashboard/clientes" },
  { text: "Tasks", icon: <AssignmentRoundedIcon />, href: "/dashboard/tasks" },
];

const secondaryListItems = [
  { text: "Configuraciones", icon: <SettingsRoundedIcon />, href: "/dashboard/configuraciones" },
  { text: "Acerca de", icon: <InfoRoundedIcon />, href: "/dashboard/acerca" },
  { text: "Ayuda", icon: <HelpRoundedIcon />, href: "/dashboard/ayuda" },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link href={item.href} passHref>
              <ListItemButton selected={index === 0}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link href={item.href} passHref>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
