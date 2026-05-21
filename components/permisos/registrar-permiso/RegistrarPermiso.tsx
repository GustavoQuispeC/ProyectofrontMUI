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
} from "@mui/icons-material";
import { useEmpleadosAutocomplete } from "@/features/dashboard/empleado/hooks/useEmpleadosAutocomplete";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { EmpleadoAutocomplete } from "@/features/dashboard/empleado/empleado.types";
import { Condicion } from "@/features/dashboard/permiso/permiso.type";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { RegistrarPermisoForm, RegistrarPermisoSchema } from "@/features/dashboard/permiso/permiso.schema";
import { toastPromise } from "@/shared/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { registrarPermiso } from "@/features/dashboard/permiso/permiso.logic";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { usePermisos } from "@/features/dashboard/permiso/hooks/usePermiso";
import { useMounted } from "@/shared/hooks/useMounted";

const defaultValues: RegistrarPermisoForm = {
  empleadoId: 0,
  fecha: "",
  horaInicio: "",
  horaFin: "",
  motivo: "",
  lugar: "",
};

const anios = ["2024", "2025", "2026", "2027", "2028"];
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

// ─── Utilidades ───────────────────────────────────────────────────────────────

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

// ─── Componente ───────────────────────────────────────────────────────────────

export default function RegistrarPermiso() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarUsuarios) : false;
  const puedeAprobar = user?.rol === "Gerente" || user?.rol === "Administrador" || user?.rol === "SuperAdmin";

  const [selectedEmployee, setSelectedEmployee] = useState<EmpleadoAutocomplete | null>(null);
  const [saving, setSaving] = useState(false);
  const [condicion, setCondicion] = useState<Condicion>("Pendiente");
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("2025");
  const [mesFiltro, setMesFiltro] = useState("05");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const mounted = useMounted(); //? controla el estado de montaje
  // ── Hooks ──
  const queryClient = useQueryClient();
  const { empleados, loading: loadingEmployees } = useEmpleadosAutocomplete();

  // ── React Hook Form ──
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegistrarPermisoForm>({
    resolver: standardSchemaResolver(RegistrarPermisoSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const empleadoId = watch("empleadoId");
  const horaInicio = watch("horaInicio");
  const horaFin = watch("horaFin");

  // ── Queries ──
  const { permisos, loading: loadingPermisos } = usePermisos(
    canAccess,
    empleadoId,
    parseInt(anioFiltro),
    parseInt(mesFiltro),
  );

  // ── Calculado ──
  const duracion = useMemo(() => calcularDuracion(horaInicio, horaFin), [horaInicio, horaFin]);

  // ── Handlers ──
  const resetForm = () => {
    reset(defaultValues);
    setSelectedEmployee(null);
    setCondicion("Pendiente");
    setMotivoRechazo("");
  };

  const onSubmit = async (data: RegistrarPermisoForm) => {
    try {
      setSaving(true);
      await toastPromise(
        registrarPermiso({
          empleadoId: data.empleadoId,
          fecha: data.fecha,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          motivo: data.motivo,
          lugar: data.lugar,
          condicion: puedeAprobar ? condicion : undefined, // ← solo si puede aprobar
          motivoRechazo: condicion === "Rechazado" ? motivoRechazo : undefined,
        }),
        {
          loading: "Registrando permiso...",
          success: "Permiso registrado correctamente",
          error: "Error al registrar el permiso",
        },
      );
      await queryClient.invalidateQueries({ queryKey: ["permisos", data.empleadoId] });
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  //! ── Efecto de montaje ──
  if (!mounted) return null;
  if (!canAccess) {
    return <AccessDenied />;
  }

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
          <Chip label={user?.rol ?? "Sin rol"} color="primary" variant="outlined" size="small" />
        </Box>
      </Paper>

      {/* ── Información del Empleado ── */}
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
              value={empleados.find((x) => x.id === field.value) ?? null}
              onChange={(_, value) => {
                field.onChange(value?.id ?? 0);
                setSelectedEmployee(value);
              }}
              getOptionLabel={(option) => option.nombreCompleto ?? ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText="Sin resultados"
              loadingText="Cargando..."
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
          </Box>
        )}
      </Paper>

      {/* ── Datos del Permiso ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Datos del permiso
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.fecha}>
                    <DatePicker
                      label="Fecha de Permiso"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) => field.onChange(val?.format("YYYY-MM-DD") ?? "")}
                      slotProps={{
                        textField: { size: "medium", fullWidth: true, error: !!errors.fecha },
                      }}
                    />
                    <FormHelperText>{errors.fecha?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <Controller
              name="horaInicio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Hora inicio"
                  type="time"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.horaInicio}
                  helperText={errors.horaInicio?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <Controller
              name="horaFin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Hora fin"
                  type="time"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.horaFin}
                  helperText={errors.horaFin?.message}
                />
              )}
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

      {/* ── Detalles ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Detalles del permiso
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="motivo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Motivo del permiso"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Describa el motivo del permiso..."
                  error={!!errors.motivo}
                  helperText={errors.motivo?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="lugar"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Lugar de destino"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Indique el lugar al que se dirige..."
                  error={!!errors.lugar}
                  helperText={errors.lugar?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ── Aprobación (solo Gerente/Admin) ── */}
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
                  <FormControlLabel value="Pendiente" control={<Radio color="warning" />} label="Pendiente" />
                  <FormControlLabel value="Aprobado" control={<Radio color="success" />} label="Aprobado" />
                  <FormControlLabel value="Rechazado" control={<Radio color="error" />} label="Rechazado" />
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

      {/* ── Filtros + Botones ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Grid container sx={{ gap: 2 }}>
          {/* Filtros */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
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
            </Box>
          </Grid>

          {/* Botones */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                justifyContent: { sm: "flex-end" },
              }}
            >
              <Button
                fullWidth={false}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                color="inherit"
                sx={{ flex: { xs: 1, sm: "unset" } }}
              >
                Volver
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                color="warning"
                onClick={resetForm}
                sx={{ flex: { xs: 1, sm: "unset" } }}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                color="primary"
                disabled={saving}
                onClick={handleSubmit(onSubmit)}
                sx={{ flex: { xs: 1, sm: "unset" } }}
              >
                Guardar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ── Historial ── */}
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
              {["N°", "Empleado", "Fecha", "Horario", "Duración", "Motivo", "Lugar", "Estado", "Acciones"].map(
                (col) => (
                  <TableCell key={col} align={col === "Acciones" ? "center" : "left"}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {col}
                    </Typography>
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingPermisos ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cargando...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : permisos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron permisos para el periodo seleccionado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              permisos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((permiso, idx) => {
                const yaDefinido = permiso.condicion === "Aprobado" || permiso.condicion === "Rechazado";
                const puedeEditar = !yaDefinido || puedeAprobar;

                return (
                  <TableRow key={permiso.id} hover>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                        {permiso.nombreEmpleado}
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
                    <TableCell>{`${Math.floor(permiso.duracionMin / 60)}h ${permiso.duracionMin % 60}m`}</TableCell>
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
                        <span>{chipCondicion(permiso.condicion as Condicion)}</span>
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
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={permisos.length}
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
        />
      </TableContainer>
    </Box>
  );
}
