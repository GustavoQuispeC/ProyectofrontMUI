"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { esES } from "@mui/x-data-grid/locales";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import {
  useCajaSesionActiva,
  useCajaSesionesPorTienda,
  useAbrirCajaSesion,
  useCerrarCajaSesion,
} from "@/features/dashboard/caja/hooks/useCajaSesion";
import {
  AbrirCajaForm,
  abrirCajaSchema,
  CerrarCajaForm,
  cerrarCajaSchema,
} from "@/features/dashboard/caja/caja.schema";
import { AbrirCajaSesionRequest, CerrarCajaSesionRequest, CajaSesion } from "@/features/dashboard/caja/caja.type";
import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { toastPromise } from "@/shared/utils/toast";

const pageSizeOptions = [20, 50, 100];

const monedaFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const formatMonto = (value?: number | null) => (value == null ? "—" : monedaFormatter.format(value));
const formatFecha = (value?: string | null) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—");

function estadoSesion(sesion: CajaSesion) {
  return sesion.estadoNombre ?? (sesion.fechaCierre ? "Cerrada" : "Abierta");
}

function isSesionAbierta(sesion: CajaSesion) {
  return !sesion.fechaCierre && (sesion.estadoNombre ? sesion.estadoNombre === "Abierta" : true);
}

function LoadingOverlay() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        zIndex: 1,
      }}
    >
      <CircularProgress size={32} />
    </Box>
  );
}

const historialColumns: GridColDef<CajaSesion>[] = [
  { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
  {
    field: "fechaApertura",
    headerName: "Fecha apertura",
    flex: 1,
    minWidth: 150,
    valueGetter: (_value, row) => formatFecha(row.fechaApertura ?? row.createdAt),
  },
  {
    field: "empleadoAperturaNombre",
    headerName: "Empleado",
    flex: 1,
    minWidth: 180,
    valueGetter: (_value, row) => row.empleadoAperturaNombre ?? "—",
  },
  {
    field: "montoApertura",
    headerName: "Monto apertura",
    flex: 1,
    minWidth: 140,
    valueGetter: (_value, row) => formatMonto(row.montoApertura),
  },
  {
    field: "montoCierreDeclarado",
    headerName: "Cierre declarado",
    flex: 1,
    minWidth: 140,
    valueGetter: (_value, row) => formatMonto(row.montoCierreDeclarado),
  },
  {
    field: "diferencia",
    headerName: "Diferencia",
    flex: 1,
    minWidth: 120,
    valueGetter: (_value, row) => formatMonto(row.diferencia),
  },
  {
    field: "fechaCierre",
    headerName: "Fecha cierre",
    flex: 1,
    minWidth: 150,
    valueGetter: (_value, row) => formatFecha(row.fechaCierre),
  },
  {
    field: "estado",
    headerName: "Estado",
    width: 130,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const abierta = isSesionAbierta(params.row);
      return (
        <Chip
          size="small"
          icon={abierta ? <CheckCircleIcon /> : <CancelIcon />}
          label={estadoSesion(params.row)}
          variant="filled"
          sx={(theme) => ({
            fontWeight: 500,
            border: "1px solid",
            "& .MuiChip-icon": {
              color: abierta
                ? theme.palette.mode === "dark"
                  ? "#49ef6d"
                  : "#02710497"
                : theme.palette.mode === "dark"
                  ? "#fbbf24"
                  : "#b45309",
            },
            ...(abierta
              ? {
                  color: theme.palette.mode === "dark" ? "#86efac" : "#347237",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(74, 222, 128, 0.15)" : "rgba(168, 226, 171, 0.2)",
                  borderColor: theme.palette.mode === "dark" ? "rgba(74, 222, 128, 0.3)" : "rgba(134, 197, 140, 0.5)",
                }
              : {
                  color: theme.palette.mode === "dark" ? "#fbbf24" : "#92400e",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(251, 191, 36, 0.15)" : "rgba(253, 230, 138, 0.4)",
                  borderColor: theme.palette.mode === "dark" ? "rgba(251, 191, 36, 0.3)" : "rgba(217, 119, 6, 0.35)",
                }),
          })}
        />
      );
    },
  },
];

export default function GestionCaja() {
  const mounted = useMounted();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarCajaSesiones) : false;
  const canAbrir = user ? hasPermission(user.rol, permissions.abrirCajaSesion) : false;
  const canCerrar = user ? hasPermission(user.rol, permissions.cerrarCajaSesion) : false;

  const [tiendaId, setTiendaId] = useState<number | null>(null);
  const [abrirOpen, setAbrirOpen] = useState(false);
  const [cerrarOpen, setCerrarOpen] = useState(false);

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const { sesion, loading: loadingSesion } = useCajaSesionActiva(tiendaId, canAccess);
  const { sesiones, loading: loadingSesiones } = useCajaSesionesPorTienda(tiendaId, canAccess);
  const abrirMutation = useAbrirCajaSesion();
  const cerrarMutation = useCerrarCajaSesion(tiendaId);

  const {
    control: controlAbrir,
    handleSubmit: handleSubmitAbrir,
    reset: resetAbrir,
    setValue: setValueAbrir,
    formState: { errors: errorsAbrir },
  } = useForm<AbrirCajaForm>({
    resolver: standardSchemaResolver(abrirCajaSchema),
    defaultValues: { tiendaId: 0, montoApertura: 0, observaciones: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const {
    control: controlCerrar,
    handleSubmit: handleSubmitCerrar,
    reset: resetCerrar,
    formState: { errors: errorsCerrar },
  } = useForm<CerrarCajaForm>({
    resolver: standardSchemaResolver(cerrarCajaSchema),
    defaultValues: {
      montoCierreDeclarado: 0,
      observaciones: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const handleOpenAbrir = () => {
    resetAbrir({
      tiendaId: tiendaId ?? 0,
      montoApertura: 0,
      observaciones: "",
    });
    setAbrirOpen(true);
  };

  const handleOpenCerrar = () => {
    resetCerrar({
      montoCierreDeclarado: 0,
      observaciones: "",
    });
    setCerrarOpen(true);
  };

  const onSubmitAbrir = async (data: AbrirCajaForm) => {
    try {
      const payload: AbrirCajaSesionRequest = {
        tiendaId: data.tiendaId,
        montoApertura: data.montoApertura,
        observaciones: data.observaciones,
      };

      console.log("[Caja] Abrir caja - payload:", payload);

      await toastPromise(abrirMutation.abrirCaja(payload), {
        loading: "Abriendo caja...",
        success: "Caja abierta correctamente.",
        error: (error) => error.message,
      });
      setAbrirOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitCerrar = async (data: CerrarCajaForm) => {
    if (!sesion?.id) {
      console.error("[Caja] No hay sesión activa para cerrar");
      return;
    }

    try {
      const payload: CerrarCajaSesionRequest = {
        cajaSesionId: sesion.id,
        montoCierreDeclarado: data.montoCierreDeclarado,
        observaciones: data.observaciones,
      };

      console.log("[Caja] Cerrar caja - sesion activa:", sesion);
      console.log("[Caja] Cerrar caja - payload:", payload);

      await toastPromise(cerrarMutation.cerrarCaja(payload), {
        loading: "Cerrando caja...",
        success: "Caja cerrada correctamente.",
        error: (error) => error.message,
      });
      setCerrarOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!canAccess) return <AccessDenied />;
  if (!mounted) return null;

  const tiendaNombre = tiendas.find((t) => t.id === tiendaId)?.nombre;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "16px",
          overflow: "hidden",
          mb: 2,
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 },
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <PointOfSaleIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  CAJA
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Apertura, cierre e historial de sesiones
                </Typography>
              </Box>
            </Stack>

            <FormControl size="small" sx={{ minWidth: 220 }} disabled={loadingTiendas}>
              <InputLabel id="tienda-select-label">Tienda</InputLabel>
              <Select
                labelId="tienda-select-label"
                label="Tienda"
                value={tiendaId != null ? String(tiendaId) : ""}
                onChange={(e) => setTiendaId(e.target.value ? Number(e.target.value) : null)}
              >
                {tiendas.map((t) => (
                  <MenuItem key={t.id} value={String(t.id)}>
                    {t.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: "1px solid", borderColor: "divider" }}>
          {!tiendaId ? (
            <Typography variant="body2" color="text.secondary">
              Seleccione una tienda para ver su sesión de caja.
            </Typography>
          ) : loadingSesion ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : sesion ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Chip size="small" color="success" icon={<CheckCircleIcon />} label={estadoSesion(sesion)} />
                <Typography variant="body2">
                  <strong>Sesión #{sesion.id}</strong>
                  {tiendaNombre ? ` — ${tiendaNombre}` : ""}
                </Typography>
                <Typography variant="body2">
                  <strong>Apertura:</strong> {formatMonto(sesion.montoApertura)}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha:</strong> {formatFecha(sesion.fechaApertura ?? sesion.createdAt)}
                </Typography>
                {sesion.empleadoAperturaNombre && (
                  <Typography variant="body2">
                    <strong>Empleado:</strong> {sesion.empleadoAperturaNombre}
                  </Typography>
                )}
              </Stack>
              {canCerrar && (
                <Button variant="contained" color="error" startIcon={<LockIcon />} onClick={handleOpenCerrar}>
                  Cerrar caja
                </Button>
              )}
            </Stack>
          ) : (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
            >
              <Typography variant="body2" color="text.secondary">
                No hay una sesión de caja abierta en esta tienda.
              </Typography>
              {canAbrir && (
                <Button variant="contained" startIcon={<LockOpenIcon />} onClick={handleOpenAbrir}>
                  Abrir caja
                </Button>
              )}
            </Stack>
          )}
        </Box>

        <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 2.5 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Historial de sesiones
          </Typography>
        </Box>
        <Paper sx={{ height: "auto", width: "100%", p: 2, borderRadius: 0 }}>
          <DataGrid
            rows={tiendaId ? sesiones : []}
            columns={historialColumns}
            loading={loadingSesiones}
            slots={{ loadingOverlay: LoadingOverlay }}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 20 } } }}
            pageSizeOptions={pageSizeOptions}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              border: 0,
              mx: 1,
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#e4eaeb",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
                color: "#006064",
                textTransform: "uppercase",
              },
            }}
          />
        </Paper>
      </Paper>

      <Dialog open={abrirOpen} onClose={() => setAbrirOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Abrir caja</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="tiendaId"
                control={controlAbrir}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errorsAbrir.tiendaId} disabled={loadingTiendas}>
                    <InputLabel id="abrir-tienda-label">Tienda *</InputLabel>
                    <Select
                      labelId="abrir-tienda-label"
                      label="Tienda *"
                      value={field.value ? String(field.value) : ""}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : 0;
                        field.onChange(value);
                        setTiendaId(value || null);
                        setValueAbrir("tiendaId", value);
                      }}
                    >
                      {tiendas.map((t) => (
                        <MenuItem key={t.id} value={String(t.id)}>
                          {t.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="montoApertura"
                control={controlAbrir}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Monto de apertura *"
                    type="number"
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    error={!!errorsAbrir.montoApertura}
                    helperText={errorsAbrir.montoApertura?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="observaciones"
                control={controlAbrir}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    fullWidth
                    size="small"
                    label="Observaciones"
                    multiline
                    minRows={2}
                    error={!!errorsAbrir.observaciones}
                    helperText={errorsAbrir.observaciones?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAbrirOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            disabled={abrirMutation.loading}
            onClick={handleSubmitAbrir(onSubmitAbrir)}
          >
            {abrirMutation.loading ? "Abriendo..." : "Abrir"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cerrarOpen} onClose={() => setCerrarOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cerrar caja — Sesión #{sesion?.id}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="montoCierreDeclarado"
                control={controlCerrar}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Monto cierre declarado (efectivo contado) *"
                    type="number"
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    error={!!errorsCerrar.montoCierreDeclarado}
                    helperText={errorsCerrar.montoCierreDeclarado?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="observaciones"
                control={controlCerrar}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    fullWidth
                    size="small"
                    label="Observaciones"
                    multiline
                    minRows={2}
                    error={!!errorsCerrar.observaciones}
                    helperText={errorsCerrar.observaciones?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCerrarOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<LockIcon />}
            disabled={cerrarMutation.loading}
            onClick={handleSubmitCerrar(onSubmitCerrar)}
          >
            {cerrarMutation.loading ? "Cerrando..." : "Cerrar caja"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
