"use client";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";
import MenuContent from "./MenuContent";
import { IUserData } from "@/shared/auth/types/IAuth";
import { getAuthUser, logout } from "@/shared/auth/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const [usuario] = useState<IUserData | null>(() => getAuthUser());
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmLogout = () => {
    handleCloseDialog();
    logout();
    router.push("/");
  };

  return (
    <>
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
            <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />} onClick={handleOpenDialog}>
              Cerrar sesión
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"¡Advertencia!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro de que deseas cerrar sesión?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Cancelar
          </Button>
          <Button color="error" onClick={handleConfirmLogout}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
