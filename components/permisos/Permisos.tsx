"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Divider,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Avatar,
  FormHelperText,
} from "@mui/material";
import {
  BeachAccess as PermisosIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { useEmpleadosAutocomplete } from "@/features/dashboard/empleado/hooks/useEmpleadosAutocomplete";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PermisoForm, PermisoSchema } from "@/features/dashboard/permiso/permiso.schema";
import { EmpleadoAutocomplete } from "@/features/dashboard/empleado/empleado.types";
import { Condicion, RegistrarPermiso } from "@/features/dashboard/permiso/permiso.type";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

//TODO: falta implementar otros datos
const defaultValues: PermisoForm = {
  empleadoId: "",
  nombreCompleto: "",
  fechaPermiso: "",
};

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Rol = "gerente" | "administrador" | "jefe_almacen";

const anios = ["2023", "2024", "2025", "2026"];
const meses = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

// ─── Utilidades ──────────────────────────────────────────────────────────────

const calcularDuracion = (inicio: string, fin: string): string => {
  if (!inicio || !fin) return "";
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);
  const totalMin = h2 * 60 + m2 - (h1 * 60 + m1);
  if (totalMin <= 0) return "Inválido";
  return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
};

const chipCondicion = (condicion: Condicion) => {
  const config: Record<Condicion, { color: "warning" | "success" | "error"; label: string }> = {
    Pendiente: { color: "warning", label: "Pendiente" },
    Aprobado: { color: "success", label: "Aprobado" },
    Rechazado: { color: "error", label: "Rechazado" },
  };
  return <Chip size="small" color={config[condicion].color} label={config[condicion].label} />;
};

// ─── Componente principal ────────────────────────────────────────────────────

const rolActual: Rol = "gerente"; // Cambiar para simular roles: "gerente" | "administrador" | "jefe_almacen"
const puedeAprobar = rolActual === "gerente" || rolActual === "administrador";

export default function PermisosEmpleados() {
  const { empleados, loading: loadingEmployees } = useEmpleadosAutocomplete();
  const [selectedEmployee, setSelectedEmployee] = useState<EmpleadoAutocomplete | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Estado del formulario

  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [motivo, setMotivo] = useState("");
  const [lugar, setLugar] = useState("");
  const [condicion, setCondicion] = useState<Condicion>("Pendiente");
  const [motivoRechazo, setMotivoRechazo] = useState("");

  // Filtros datatable
  const [anioFiltro, setAnioFiltro] = useState("2025");
  const [mesFiltro, setMesFiltro] = useState("05");

  // Tabla
  //const [permisos, setPermisos] = useState<RegistrarPermiso[]>(permisosIniciales);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // UI
  const [snackbar, setSnackbar] = useState<{ open: boolean; mensaje: string; tipo: "success" | "error" }>({
    open: false,
    mensaje: "",
    tipo: "success",
  });

  const duracion = useMemo(() => calcularDuracion(horaInicio, horaFin), [horaInicio, horaFin]);

  // const permisosFiltraods = useMemo(() => {
  //   return permisos.filter((p) => {
  //     const coincideEmpleado = selectedEmployee ? p.empleado === selectedEmployee.nombreCompleto : true;
  //     const coincidePeriodo = p.periodo === `${anioFiltro}-${mesFiltro}`;
  //     return coincideEmpleado && coincidePeriodo;
  //   });
  // }, [permisos, selectedEmployee, anioFiltro, mesFiltro]);

  // const handleGuardar = () => {
  //   if (!selectedEmployee || !fecha || !horaInicio || !horaFin || !motivo || !lugar) {
  //     setSnackbar({ open: true, mensaje: "Complete todos los campos obligatorios.", tipo: "error" });
  //     return;
  //   }
  //   if (duracion === "Inválido" || !duracion) {
  //     setSnackbar({ open: true, mensaje: "La hora fin debe ser mayor a la hora inicio.", tipo: "error" });
  //     return;
  //   }
  //   const nuevo: RegistrarPermiso = {
  //     id: permisos.length + 1,
  //     empleado: selectedEmployee.nombreCompleto,
  //     fecha,
  //     horaInicio,
  //     horaFin,
  //     duracion,
  //     motivo,
  //     lugar,
  //     condicion: puedeAprobar ? condicion : "Pendiente",
  //     motivoRechazo: condicion === "Rechazado" ? motivoRechazo : undefined,
  //     periodo: `${anioFiltro}-${mesFiltro}`,
  //   };
  //   setPermisos((prev) => [nuevo, ...prev]);
  //   setSnackbar({ open: true, mensaje: "Permiso registrado correctamente.", tipo: "success" });
  //   handleLimpiar();
  // };

  const handleLimpiar = () => {
    setFecha("");
    setHoraInicio("");
    setHoraFin("");
    setMotivo("");
    setLugar("");
    setCondicion("Pendiente");
    setMotivoRechazo("");
  };

  //! usando react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PermisoForm>({
    resolver: standardSchemaResolver(PermisoSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  //! Reset form
  const resetForm = () => {
    reset(defaultValues);
    setSelectedEmployee(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* ── Header ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <PermisosIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Registro de Permisos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión y control de permisos de empleados
          </Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <Chip
            label={
              rolActual === "gerente" ? "Gerente" : rolActual === "administrador" ? "Administrador" : "Jefe de Almacén"
            }
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      </Paper>

      {/* ── Sección: Información del Empleado ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Información del empleado
        </Typography>

        <Controller
          name="empleadoId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              disablePortal
              options={empleados ?? []}
              loading={loadingEmployees}
              value={empleados.find((x) => x.id.toString() === field.value) ?? null}
              onChange={(_, value) => {
                field.onChange(value?.id?.toString() ?? "");

                setSelectedEmployee(value);

                setValue("nombreCompleto", value?.nombreCompleto ?? "");
              }}
              getOptionLabel={(option) => option.nombreCompleto ?? ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText="Sin resultados"
              loadingText="Cargando..."
              size="medium"
              sx={{ mb: 2 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar empleado"
                  placeholder="Seleccione un empleado"
                  error={!!errors.empleadoId}
                  helperText={errors.empleadoId?.message}
                  fullWidth
                />
              )}
            />
          )}
        />

        {/* Chip de datos del empleado */}
        {selectedEmployee && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              p: 2,
              bgcolor: "primary.50",
              border: "1px solid",
              borderColor: "primary.200",
              borderRadius: 2,
            }}
          >
            <Chip icon={<PersonIcon />} label={selectedEmployee.nombreCompleto} color="primary" variant="outlined" />
            <Chip icon={<WorkIcon />} label={selectedEmployee.correo} variant="outlined" />
            {/* <Chip icon={<BadgeIcon />} label={empleadoSeleccionado.area} variant="outlined" />
            <Chip label={empleadoSeleccionado.email} variant="outlined" size="small" sx={{ alignSelf: "center" }} /> */}
          </Box>
        )}
      </Paper>

      {/* ── Sección: Datos del Permiso ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Datos del permiso
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              {" "}
              <Controller
                name="fechaPermiso"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.fechaPermiso}>
                    {" "}
                    <DatePicker
                      key={resetKey}
                      label="Fecha de Permiso"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) => field.onChange(val?.format("YYYY-MM-DD") ?? "")}
                      slotProps={{
                        textField: {
                          size: "medium",
                          fullWidth: true,
                          error: !!errors.fechaPermiso,
                        },
                      }}
                    />
                    <FormHelperText>{errors.fechaPermiso?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label="Hora inicio"
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              label="Hora fin"
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField
              fullWidth
              label="Duración"
              value={duracion}
              slotProps={{ input: { readOnly: true } }}
              helperText="Calculado"
              color={duracion === "Inválido" ? "error" : "primary"}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ── Sección: Detalles ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Detalles del permiso
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Motivo del permiso"
              multiline
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Describa el motivo del permiso..."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Lugar de destino"
              multiline
              rows={3}
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Indique el lugar al que se dirige..."
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ── Sección condicional: Aprobación (solo Gerente/Admin) ── */}
      {puedeAprobar && (
        <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderColor: "primary.main" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }} color="primary">
            Configuración de aprobación
          </Typography>

          <Grid container sx={{ spacing: 2, alignItems: "flex-start" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Condición del permiso</FormLabel>
                <RadioGroup row value={condicion} onChange={(e) => setCondicion(e.target.value as Condicion)}>
                  <FormControlLabel value="pendiente" control={<Radio color="warning" />} label="Pendiente" />
                  <FormControlLabel value="aprobado" control={<Radio color="success" />} label="Aprobado" />
                  <FormControlLabel value="rechazado" control={<Radio color="error" />} label="Rechazado" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {condicion === "Rechazado" && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Motivo de rechazo"
                  multiline
                  rows={2}
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Indique el motivo del rechazo..."
                  color="error"
                />
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* ── Fila inferior: Filtros + Botones ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Grid container sx={{ spacing: 2, alignItems: "center" }}>
          {/* Selectores periodo */}
          <Grid size={{ xs: 6, sm: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Año</InputLabel>
              <Select value={anioFiltro} label="Año" onChange={(e) => setAnioFiltro(e.target.value)}>
                {anios.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Mes</InputLabel>
              <Select value={mesFiltro} label="Mes" onChange={(e) => setMesFiltro(e.target.value)}>
                {meses.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Spacer */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} color="inherit">
                Volver
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} color="warning" onClick={handleLimpiar}>
                Limpiar
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} color="primary">
                Guardar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ── Historial de permisos ── */}
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          HISTORIAL DE PERMISOS
        </Typography>
      </Divider>

      {selectedEmployee && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Mostrando permisos de <strong>{selectedEmployee.nombreCompleto}</strong> —{" "}
          {meses.find((m) => m.value === mesFiltro)?.label} {anioFiltro}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  N°
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Empleado
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Fecha
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Horario
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Duración
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Motivo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Lugar
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Estado
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Acciones
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {permisosFiltraods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron permisos para el periodo seleccionado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              permisosFiltraods.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((permiso, idx) => {
                const yaDefinido = permiso.condicion === "aprobado" || permiso.condicion === "rechazado";
                const puedeEditar = !yaDefinido || puedeAprobar;

                return (
                  <TableRow key={permiso.id} hover>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                        {permiso.empleado}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{permiso.fecha}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {permiso.horaInicio} - {permiso.horaFin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{permiso.duracion}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {permiso.motivo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {permiso.lugar}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={permiso.motivoRechazo || ""} arrow>
                        <span>{chipCondicion(permiso.condicion)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalle">
                        <IconButton size="small" color="info">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={!puedeEditar ? "No puede editar un permiso ya procesado" : "Editar"}>
                        <span>
                          <IconButton size="small" color="warning" disabled={!puedeEditar}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )} */}
          </TableBody>
        </Table>

        {/* <TablePagination
          component="div"
          count={permisosFiltraods.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        /> */}
      </TableContainer>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.tipo} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} variant="filled">
          {snackbar.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}
