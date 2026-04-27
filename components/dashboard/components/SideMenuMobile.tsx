"use client";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";
import MenuContent from "./MenuContent";
import { IUserData } from "@/shared/auth/types/IAuth";
import { getAuthUser } from "@/shared/auth/auth.service";
import { useEffect, useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
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
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexGrow: 1, p: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                position: "relative",
              }}
            >
              <Image
                src={usuario?.fotoUrl || "/Avatar.png"}
                alt="usuario"
                fill
                sizes="32px"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Typography component="p" variant="h6">
              {usuario?.rol ?? "Usuario"}
            </Typography>
          </Stack>

          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
            Cerrar sesión
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
