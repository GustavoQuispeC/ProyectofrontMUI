"use client";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { usePathname } from "next/navigation";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";

interface DashboardProps {
  children?: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const pathname = usePathname();
  const isFullWidthList =
    pathname?.startsWith("/dashboard/productos/listar") ||
    pathname?.startsWith("/dashboard/proveedores/listar") ||
    pathname?.startsWith("/dashboard/ingresos/listar") ||
    pathname?.startsWith("/dashboard/transferencias/listar") ||
    pathname?.startsWith("/dashboard/inventario/listar");
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SideMenu />
      <AppNavbar />
      {/* Main content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: "auto",
        })}
      >
        {/* Header con bordes mejorados */}
        <Header />

        {/* Contenido con mejor espaciado */}
        <Stack
          spacing={3}
          sx={{
            alignItems: "stretch",
            px: { xs: 2, md: isFullWidthList ? 2 : 4 },
            py: { xs: 3, md: 4 },
            maxWidth: isFullWidthList ? "100%" : "1400px",
            mx: "auto",
            width: "100%",
            mt: { xs: "64px", md: 0 },
          }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
