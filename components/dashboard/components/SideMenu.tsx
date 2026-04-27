"use client";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { getAuthUser } from "@/shared/auth/auth.service";
import { IUserData } from "@/shared/auth/types/IAuth";
import { useEffect, useState } from "react";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    // borde derecho más sutil
    borderRight: "0.5px solid",
    borderColor: "divider",
  },
});

export default function SideMenu() {
  const [usuario, setUsuario] = useState<IUserData | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = getAuthUser();
      setUsuario(data);
    };

    loadUser();
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      {/* Header: selector de proyecto */}
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.25,
        }}
      >
        <SelectContent />
      </Box>

      <Divider />

      {/* Navegación */}
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          py: 1,
        }}
      >
        <MenuContent />
      </Box>

      <Divider />

      {/* Footer: usuario */}
      <Stack
        direction="row"
        sx={{
          p: 1.5,
          gap: 1,
          alignItems: "center",
        }}
      >
        <Tooltip title="Ver perfil" placement="top">
          <Avatar
            alt={usuario?.nombreCompleto || "Usuario"}
            src={usuario?.fotoUrl || "/Avatar.png"}
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
              border: "1px solid",
              borderColor: "divider",

              bgcolor: "primary.100",
              color: "primary.800",
            }}
          >
            {usuario?.nombreCompleto
              ?.split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("") || "US"}
          </Avatar>
        </Tooltip>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              lineHeight: "16px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {usuario?.nombreCompleto ?? "Usuario"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {usuario?.email ?? "usuario@email.com"}
          </Typography>
        </Box>

        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
