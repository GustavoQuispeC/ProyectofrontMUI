"use client";

import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
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
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CategoryIcon from "@mui/icons-material/Category";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import SellIcon from "@mui/icons-material/Sell";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { alpha } from "@mui/material/styles";

import { brand } from "@/components/ui/theme/Theme";
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
        icon: <FormatListNumberedIcon />,
        href: "/dashboard/productos/listar",
        allowedRoles: [...permissions.registrarProducto],
      },
      {
        text: "Categorias",
        icon: <CategoryIcon />,
        href: "/dashboard/categorias/listar",
        allowedRoles: [...permissions.registrarProducto],
      },
      {
        text: "Marcas",
        icon: <StorefrontOutlinedIcon />,
        href: "/dashboard/marcas/listar",
        allowedRoles: [...permissions.listarMarcas],
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
    text: "Clientes",
    icon: <AccountBoxIcon />,
    allowedRoles: [...permissions.listarClientes, ...permissions.registrarCliente],
    children: [
      {
        text: "Listar",
        icon: <FormatListNumberedIcon />,
        href: "/dashboard/clientes/listar",
        allowedRoles: [...permissions.listarClientes],
      },
    ],
  },

  {
    text: "RRHH",
    icon: <PeopleAltRoundedIcon />,
    allowedRoles: [
      ...permissions.registrarEmpleado,
      ...permissions.listarEmpleados,
      ...permissions.detalleEmpleado,
      ...permissions.eliminarEmpleado,
      ...permissions.editarEmpleado,
      ...permissions.registrarPermiso,
      ...permissions.listarPermisosPendientes,
      ...permissions.aprobarPermiso,
      ...permissions.cancelarPermiso,
      ...permissions.listarPermisosMensual,
      ...permissions.listarVacacionesGenerales,
      ...permissions.listarVacacionesPendientes,
      ...permissions.registrarVacaciones,
      ...permissions.aprobarVacaciones,
      ...permissions.cancelarVacacionesAprobadas,
      ...permissions.listarVacacionesResumen,
      ...permissions.cancelarVacacionesPendientes,
      ...permissions.listarVacacionesById,
      ...permissions.registrarFalta,
      ...permissions.listarFaltasPendientes,
      ...permissions.aprobarFalta,
      ...permissions.cancelarFalta,
      ...permissions.listarFaltaMensual,
    ],
    children: [
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
    ],
  },
  {
    text: "Proveedores",
    icon: <LocalShippingIcon />,
    href: "/dashboard/proveedores/listar",
    allowedRoles: [...permissions.listarProveedores, ...permissions.registrarProveedor],
  },
  {
    text: "Vehículos",
    icon: <DirectionsCarIcon />,
    href: "/dashboard/vehiculo/listar",
    allowedRoles: [...permissions.listarVehiculos, ...permissions.registrarVehiculo],
  },
  {
    text: "Caja",
    icon: <PointOfSaleIcon />,
    allowedRoles: [...permissions.listarCajaSesiones, ...permissions.abrirCajaSesion, ...permissions.cerrarCajaSesion],
    children: [
      {
        text: "Gestionar",
        icon: <PointOfSaleIcon />,
        href: "/dashboard/caja",
        allowedRoles: [
          ...permissions.listarCajaSesiones,
          ...permissions.abrirCajaSesion,
          ...permissions.cerrarCajaSesion,
        ],
      },
      {
        text: "Ingresos",
        icon: <VisibilityIcon />,
        href: "/dashboard/caja/ingresos",
        allowedRoles: [...permissions.listarCajaSesiones, ...permissions.listarVentas],
      },
    ],
  },
  {
    text: "Ventas",
    icon: <SellIcon />,
    href: "/dashboard/ventas/listar",
    allowedRoles: [...permissions.registrarVenta, ...permissions.listarVentas],
  },
  {
    text: "Amortizaciones",
    icon: <AccountBalanceWalletIcon />,
    href: "/dashboard/amortizaciones",
    allowedRoles: [...permissions.listarAmortizaciones, ...permissions.registrarAmortizacion],
  },
  {
    text: "Kardex",
    icon: <InventoryIcon />,
    allowedRoles: [
      ...permissions.listarIngresos,
      ...permissions.registrarIngreso,
      ...permissions.listarSalidas,
      ...permissions.registrarSalida,
      ...permissions.listarTransferencias,
      ...permissions.registrarTransferencia,
      ...permissions.listarInventario,
    ],
    children: [
      {
        text: "Ingresos",
        icon: <FileOpenIcon />,
        href: "/dashboard/ingresos/listar",
        allowedRoles: [...permissions.listarIngresos, ...permissions.registrarIngreso],
      },
      {
        text: "Salidas",
        icon: <AssignmentReturnIcon />,
        href: "/dashboard/salidas/listar",
        allowedRoles: [...permissions.listarSalidas, ...permissions.registrarSalida],
      },
      {
        text: "Transferencias",
        icon: <SwapHorizontalCircleIcon />,
        href: "/dashboard/transferencias/listar",
        allowedRoles: [...permissions.listarTransferencias, ...permissions.registrarTransferencia],
      },
      {
        text: "Inventario",
        icon: <NoteAltIcon />,
        href: "/dashboard/inventario/listar",
        allowedRoles: [...permissions.listarInventario],
      },
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

interface MenuContentProps {
  open?: boolean;
}

export default function MenuContent({ open = true }: MenuContentProps) {
  const mounted = useMounted(); //? controla el estado de montaje
  const user = getAuthUser();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  if (!mounted) return null;

  const toggleGroup = (text: string) => setOpenGroups((prev) => ({ ...prev, [text]: !prev[text] }));

  const isActive = (href: string) => pathname === href;

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
            const hasActiveChild = item.children.some((child) => isActive(child.href));
            const isOpen = open && (openGroups[item.text] ?? hasActiveChild);
            return (
              <React.Fragment key={index}>
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={() => toggleGroup(item.text)}
                    selected={item.children?.some((c) => isActive(c.href))}
                    sx={{
                      justifyContent: open ? "flex-start" : "center",
                      px: open ? 2 : 1,
                      borderRadius: 2,
                      mx: 0.5,
                      my: 0.25,
                      color: "text.primary",
                      "&.Mui-selected": {
                        bgcolor: (theme) =>
                          alpha(
                            theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue,
                            theme.palette.mode === "dark" ? 0.22 : 0.12,
                          ),
                        color: (theme) => (theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlueDark),
                        "& .MuiListItemIcon-root": {
                          color: (theme) => (theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlueDark),
                        },
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(
                              theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue,
                              theme.palette.mode === "dark" ? 0.28 : 0.18,
                            ),
                        },
                      },
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue, 0.08),
                      },
                    }}
                  >
                    <Tooltip title={open ? "" : item.text} placement="right">
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : 0,
                          color: "text.secondary",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                    {open && <ListItemText primary={item.text} sx={{ flex: 1 }} />}
                    {open && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List
                    dense
                    disablePadding
                    sx={{
                      py: 0.5,
                      mb: 0.75,
                    }}
                  >
                    {visibleChildren.map((child, ci) => (
                      <ListItem key={ci} disablePadding sx={{ display: "block" }}>
                        <Link href={child.href} passHref>
                          <ListItemButton
                            selected={isActive(child.href)}
                            sx={{
                              justifyContent: "flex-start",
                              pl: 5.5,
                              pr: 2,
                              py: 0.75,
                              mx: 0.75,
                              my: 0.25,
                              borderRadius: 2,
                              color: "text.secondary",
                              "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: 500 },
                              "&.Mui-selected": {
                                bgcolor: (theme) =>
                                  alpha(theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue, 0.14),
                                color: (theme) =>
                                  theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue,
                              },
                              "&:hover": {
                                bgcolor: (theme) =>
                                  alpha(theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue, 0.1),
                                color: (theme) =>
                                  theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue,
                              },
                            }}
                          >
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
                <ListItemButton
                  selected={isActive(item.href!)}
                  sx={{
                    justifyContent: open ? "flex-start" : "center",
                    px: open ? 2 : 1,
                    borderRadius: 2,
                    mx: 0.5,
                    my: 0.25,
                    color: "text.primary",
                    "&.Mui-selected": {
                      bgcolor: (theme) =>
                        alpha(
                          theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue,
                          theme.palette.mode === "dark" ? 0.22 : 0.12,
                        ),
                      color: (theme) => (theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlueDark),
                      "& .MuiListItemIcon-root": {
                        color: (theme) => (theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlueDark),
                      },
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(
                            theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue,
                            theme.palette.mode === "dark" ? 0.28 : 0.18,
                          ),
                      },
                    },
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue, 0.08),
                    },
                  }}
                >
                  <Tooltip title={open ? "" : item.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                        color: "text.secondary",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                  {open && <ListItemText primary={item.text} />}
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
              <ListItemButton
                selected={isActive(item.href)}
                sx={{
                  justifyContent: open ? "flex-start" : "center",
                  px: open ? 2 : 1,
                  borderRadius: 2,
                  mx: 0.5,
                  my: 0.25,
                  color: "text.primary",
                  "&.Mui-selected": {
                    bgcolor: (theme) =>
                      alpha(
                        theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue,
                        theme.palette.mode === "dark" ? 0.22 : 0.12,
                      ),
                    color: (theme) => (theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlueDark),
                    "& .MuiListItemIcon-root": {
                      color: (theme) => (theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlueDark),
                    },
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(
                          theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue,
                          theme.palette.mode === "dark" ? 0.28 : 0.18,
                        ),
                    },
                  },
                  "&:hover": {
                    bgcolor: (theme) =>
                      alpha(theme.palette.mode === "dark" ? brand.darkBlueLight : brand.darkBlue, 0.08),
                  },
                }}
              >
                <Tooltip title={open ? "" : item.text} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 0,
                      color: "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
