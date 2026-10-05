"use client";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";
import RegistrarVenta from "@/components/ventas/registrar-venta/RegistrarVenta";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import {
  getTerminalSeleccionada,
  guardarTerminalSeleccionada,
  listarTerminalesApi,
  Terminal,
} from "@/shared/auth/terminal.service";

interface DashboardProps {
  children?: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [ventaPersistente, setVentaPersistente] = useState(false);
  const [terminales, setTerminales] = useState<Terminal[]>([]);
  const [terminalId, setTerminalId] = useState("");
  const [seleccionandoTerminal, setSeleccionandoTerminal] = useState(() => !getTerminalSeleccionada());
  const [errorTerminal, setErrorTerminal] = useState<string | null>(null);
  const [requiereTerminal, setRequiereTerminal] = useState(() => !getTerminalSeleccionada());
  const ventaOpen = ventaPersistente || pathname === "/dashboard/ventas/registrar";

  useEffect(() => {
    if (getTerminalSeleccionada()) return;

    listarTerminalesApi()
      .then(setTerminales)
      .catch((error: Error) => setErrorTerminal(error.message))
      .finally(() => setSeleccionandoTerminal(false));
  }, []);

  const seleccionarTerminal = () => {
    const terminal = terminales.find((item) => item.id === Number(terminalId));
    if (!terminal) return;
    guardarTerminalSeleccionada(terminal);
    setRequiereTerminal(false);
  };

  const handleCloseVenta = () => {
    setVentaPersistente(false);
    if (pathname === "/dashboard/ventas/registrar") router.push("/dashboard/ventas/listar");
  };

  const isFullWidthList =
    pathname?.startsWith("/dashboard/productos/listar") ||
    pathname?.startsWith("/dashboard/proveedores/listar") ||
    pathname?.startsWith("/dashboard/ingresos/listar") ||
    pathname?.startsWith("/dashboard/salidas/listar") ||
    pathname?.startsWith("/dashboard/transferencias/listar") ||
    pathname?.startsWith("/dashboard/ventas/listar") ||
    pathname?.startsWith("/dashboard/despachos") ||
    pathname?.startsWith("/dashboard/inventario/listar") ||
    pathname?.startsWith("/dashboard/clientes/listar") ||
    pathname?.startsWith("/dashboard/caja/ingresos") ||
    pathname?.startsWith("/dashboard/amortizaciones");
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
        <Header />

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
      <RegistrarVenta open={ventaOpen} onClose={handleCloseVenta} onMinimize={() => setVentaPersistente(true)} />
      <Dialog open={requiereTerminal} maxWidth="xs" fullWidth>
        <DialogTitle>Seleccionar terminal de caja</DialogTitle>
        <DialogContent>
          <Stack sx={{ gap: 2, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Seleccione la terminal que utilizará durante esta sesión. Para cambiarla deberá cerrar sesión.
            </Typography>
            {seleccionandoTerminal ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <FormControl fullWidth size="small" error={Boolean(errorTerminal)}>
                <InputLabel id="terminal-sesion-label">Terminal</InputLabel>
                <Select
                  labelId="terminal-sesion-label"
                  label="Terminal"
                  value={terminalId}
                  onChange={(event) => setTerminalId(event.target.value)}
                >
                  {terminales.map((terminal) => (
                    <MenuItem key={terminal.id} value={String(terminal.id)}>
                      {terminal.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errorTerminal && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errorTerminal}
                  </Typography>
                )}
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" disabled={!terminalId || seleccionandoTerminal} onClick={seleccionarTerminal}>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
