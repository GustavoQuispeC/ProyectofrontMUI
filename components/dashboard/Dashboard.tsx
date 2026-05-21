"use client";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";

interface DashboardProps {
  children?: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  return (
    <Box sx={{ display: "flex" }}>
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
        {/* ✅ Header sin mx, ocupa todo el ancho */}
        <Header />

        {/* ✅ Solo el contenido tiene mx */}
        <Stack
          spacing={2}
          sx={{
            alignItems: "stretch",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
