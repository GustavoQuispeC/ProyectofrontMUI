"use client";

import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import GroupIcon from "@mui/icons-material/Group";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SummarizeIcon from "@mui/icons-material/Summarize";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import React from "react";
import Link from "next/link";

import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";

type SubMenuItem = {
  text: string;
  icon: React.ReactNode;
  href: string;
  allowedRoles?: string[];
};

type MenuItemType = {
  text: string;
  icon: React.ReactNode;
  href?: string;
  allowedRoles?: string[];
  children?: SubMenuItem[];
};

const mainListItems: MenuItemType[] = [
  {
    text: "Inicio",
    icon: <HomeRoundedIcon />,
    href: "/dashboard/Inicio",
  },

  {
    text: "Productos",
    icon: <ProductionQuantityLimitsIcon />,
    allowedRoles: [...permissions.registrarProducto],
    children: [
      {
        text: "Listar",
        icon: <SummarizeIcon />,
        href: "/dashboard/productos/listar",
        allowedRoles: [...permissions.registrarProducto],
      },
      {
        text: "Categorias",
        icon: <SummarizeIcon />,
        href: "/dashboard/categorias/listar",
        allowedRoles: [...permissions.registrarProducto],
      },
    ],
  },

  {
    text: "Usuarios",
    icon: <GroupIcon />,
    href: "/dashboard/usuarios/listar",

    allowedRoles: [
      ...permissions.listarUsuarios,
      ...permissions.registrarUsuarios,
      ...permissions.cambiarEstadoUsuarios,
      ...permissions.resetPasswordUsuarios,
      ...permissions.changeEmailUsuarios,
      ...permissions.changeRoleUsuarios,
    ],
  },

  {
    text: "Empleados",
    icon: <AnalyticsRoundedIcon />,
    href: "/dashboard/empleados/listar",
    allowedRoles: [
      ...permissions.registrarEmpleado,
      ...permissions.listarEmpleados,
      ...permissions.detalleEmpleado,
      ...permissions.eliminarEmpleado,
      ...permissions.editarEmpleado,
    ],
  },

  {
    text: "Clientes",
    icon: <AccountBoxIcon />,
    href: "#",
  },

  {
    text: "Permisos",
    icon: <PendingActionsIcon />,
    href: "/dashboard/permisos/pendiente",
    allowedRoles: [
      ...permissions.registrarPermiso,
      ...permissions.listarPermisosPendientes,
      ...permissions.aprobarPermiso,
      ...permissions.cancelarPermiso,
      ...permissions.listarPermisosMensual,
    ],
  },
  {
    text: "Vacaciones",
    icon: <AssignmentRoundedIcon />,
    allowedRoles: [
      ...permissions.listarVacacionesGenerales,
      ...permissions.listarVacacionesPendientes,
      ...permissions.registrarVacaciones,
      ...permissions.aprobarVacaciones,
      ...permissions.cancelarVacacionesAprobadas,
      ...permissions.listarVacacionesResumen,
      ...permissions.cancelarVacacionesPendientes,
      ...permissions.listarVacacionesById,
    ],
    children: [
      {
        text: "Resumen",
        icon: <SummarizeIcon />,
        href: "/dashboard/vacaciones/resumen",
        allowedRoles: [
          ...permissions.listarVacacionesGenerales,
          ...permissions.listarVacacionesPendientes,
          ...permissions.registrarVacaciones,
          ...permissions.aprobarVacaciones,
          ...permissions.cancelarVacacionesAprobadas,
          ...permissions.listarVacacionesResumen,
          ...permissions.cancelarVacacionesPendientes,
        ],
      },
      {
        text: "Mis Vacaciones",
        icon: <AccountCircleIcon />,
        href: "/dashboard/vacaciones/resumen-id",
        allowedRoles: permissions.listarVacacionesById,
      },
    ],
  },
  {
    text: "Faltas",
    icon: <EventBusyIcon />,
    href: "/dashboard/faltas/pendientes",
    allowedRoles: [
      ...permissions.registrarFalta,
      ...permissions.listarFaltasPendientes,
      ...permissions.aprobarFalta,
      ...permissions.cancelarFalta,
      ...permissions.listarFaltaMensual,
    ],
  },
];

const secondaryListItems = [
  {
    text: "Configuraciones",
    icon: <SettingsRoundedIcon />,
    href: "/dashboard/configuraciones",
  },

  {
    text: "Acerca de",
    icon: <InfoRoundedIcon />,
    href: "/dashboard/acerca",
  },

  {
    text: "Ayuda",
    icon: <HelpRoundedIcon />,
    href: "/dashboard/ayuda",
  },
];

export default function MenuContent() {
  const mounted = useMounted(); //? controla el estado de montaje
  const user = getAuthUser();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  if (!mounted) return null;

  const toggleGroup = (text: string) => setOpenGroups((prev) => ({ ...prev, [text]: !prev[text] }));

  const filteredMainItems = mainListItems.filter((item) => {
    // Sin restricción
    if (!item.allowedRoles) {
      return true;
    }

    // Sin usuario
    if (!user) {
      return false;
    }

    return hasPermission(user.rol, item.allowedRoles);
  });

  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: 1,
        justifyContent: "space-between",
      }}
    >
      <List dense>
        {filteredMainItems.map((item, index) => {
          if (item.children) {
            const visibleChildren = item.children.filter(
              (child) => !child.allowedRoles || (user && hasPermission(user.rol, child.allowedRoles)),
            );
            if (visibleChildren.length === 0) return null;
            const isOpen = !!openGroups[item.text];
            return (
              <React.Fragment key={index}>
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton onClick={() => toggleGroup(item.text)}>
                    <ListItemIcon
                      sx={{ color: (theme) => (theme.palette.mode === "dark" ? "warning.main" : "primary.dark") }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List dense disablePadding>
                    {visibleChildren.map((child, ci) => (
                      <ListItem key={ci} disablePadding sx={{ display: "block" }}>
                        <Link href={child.href} passHref>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon
                              sx={{
                                minWidth: 36,
                                color: (theme) => (theme.palette.mode === "dark" ? "warning.main" : "primary.dark"),
                              }}
                            >
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          return (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <Link href={item.href!} passHref>
                <ListItemButton>
                  <ListItemIcon
                    sx={{ color: (theme) => (theme.palette.mode === "dark" ? "warning.main" : "primary.dark") }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link href={item.href} passHref>
              <ListItemButton>
                <ListItemIcon
                  sx={{ color: (theme) => (theme.palette.mode === "dark" ? "warning.main" : "primary.dark") }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
