import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiToolbar from "@mui/material/Toolbar";
import { tabsClasses } from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SideMenuMobile from "./SideMenuMobile";
import MenuButton from "./MenuButton";
import ColorModeToggleButton from "@/components/ui/theme/ColorModeToggleButton";

const Toolbar = styled(MuiToolbar)({
  width: "100%",
  padding: "8px 12px", // menos padding vertical — el AppBar quedaba alto
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  justifyContent: "center",
  gap: "12px",
  flexShrink: 0,
  [`& ${tabsClasses.list}`]: {
    gap: "8px",
    pb: 0,
  },
});

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "auto", md: "none" },
        boxShadow: 0,
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#0F172A" : "#FFFFFF"),
        backgroundImage: "none",
        borderBottom: "1px solid",
        borderColor: (theme) => (theme.palette.mode === "dark" ? "#1E293B" : "#E2E8F0"),
        top: "var(--template-frame-height, 0px)",
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
            gap: 1,
          }}
        >
          {/* Logo + título — alineado a la izquierda */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mr: "auto" }}>
            <CustomIcon />
            <Typography
              variant="body1" // h4 era demasiado grande para mobile
              component="h1"
              sx={{
                fontWeight: 500,
                color: "text.primary",
                letterSpacing: "-0.01em",
              }}
            >
              Dashboard
            </Typography>
          </Stack>

          {/* Acciones del lado derecho */}
          <ColorModeToggleButton />

          <MenuButton
            aria-label="Abrir menú"
            onClick={toggleDrawer(true)}
            sx={{
              width: 34,
              height: 34,
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <MenuRoundedIcon sx={{ fontSize: "1.1rem" }} />
          </MenuButton>

          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export function CustomIcon() {
  return (
    <Box
      sx={{
        width: 26,
        height: 26,
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        flexShrink: 0,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)"
            : "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        color: "white",
        border: "1px solid",
        borderColor: (theme) => (theme.palette.mode === "dark" ? "#2563EB" : "#F97316"),
      }}
    >
      <DashboardRoundedIcon sx={{ fontSize: "0.95rem", color: "white" }} />
    </Box>
  );
}
