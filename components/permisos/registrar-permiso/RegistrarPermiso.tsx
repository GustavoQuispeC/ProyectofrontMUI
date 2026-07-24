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
  Button,
  Avatar,
  FormHelperText,
  CircularProgress,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import {
  BeachAccess as PermisosIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  RestartAlt as RestartAltIcon,
  SaveRounded as SaveRoundedIcon,
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
import { useMounted } from "@/shared/hooks/useMounted";
import { useRouter } from "next/navigation";

const defaultValues: RegistrarPermisoForm = {
  empleadoId: 0,
  fecha: "",
  horaInicio: "",
  horaFin: "",
  motivo: "",
  lugar: "",
};

// ─── Utilidades ───────────────────────────────────────────────────────────────

const calcularDuracion = (inicio: string, fin: string): string => {
  if (!inicio || !fin) return "";
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = fin.split(":").map(Number);
  const totalMin = h2 * 60 + m2 - (h1 * 60 + m1);
  if (totalMin <= 0) return "Inválido";
  return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function RegistrarPermiso() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarPermiso) : false;
  const puedeAprobar = user?.rol === "Gerente" || user?.rol === "Administrador" || user?.rol === "SuperAdmin";
  const router = useRouter();

  const [selectedEmployee, setSelectedEmployee] = useState<EmpleadoAutocomplete | null>(null);
  const [saving, setSaving] = useState(false);
  const [condicion, setCondicion] = useState<Condicion>(Condicion.Pendiente);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const mounted = useMounted(); //? controla el estado de montaje
  const queryClient = useQueryClient();
  const { empleados, loading: loadingEmployees } = useEmpleadosAutocomplete();

  //!React Hook Form
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
  const horaInicio = watch("horaInicio");
  const horaFin = watch("horaFin");

  //! ── Calculado el tiempo de duracion
  const duracion = useMemo(() => calcularDuracion(horaInicio, horaFin), [horaInicio, horaFin]);

  //! Reseter form
  const resetForm = () => {
    reset(defaultValues);
    setSelectedEmployee(null);
    setCondicion(Condicion.Pendiente);
    setMotivoCancelacion("");
  };
  //! enviar form
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
          condicion: puedeAprobar ? condicion : undefined,
          motivoCancelacion: condicion === Condicion.Cancelado ? motivoCancelacion : undefined,
        }),
        {
          loading: "Registrando permiso...",
          success: "Permiso registrado correctamente",
          error: "Error al registrar el permiso",
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ["permisos", data.empleadoId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["permisosPendientes"],
      });

      resetForm();
    } finally {
      setSaving(false);
    }
  };

  //! ── Efecto de montaje ──
  if (!mounted) return null;
  //* Validando permiso de acceso
  if (!canAccess) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* ── Header ── */}
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 3,
          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, md: 3 },
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: { xs: 48, md: 52 },
                height: { xs: 48, md: 52 },
              }}
            >
              <PermisosIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Registro de Permisos
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Gestión y control de permisos de empleados
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

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
                  <FormControlLabel value={Condicion.Pendiente} control={<Radio color="warning" />} label="Pendiente" />
                  <FormControlLabel value={Condicion.Aprobado} control={<Radio color="success" />} label="Aprobado" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {condicion === Condicion.Cancelado && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Motivo de cancelación"
                  multiline
                  rows={2}
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Indique el motivo de la cancelación..."
                  color="error"
                />
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* ──  Botones ── */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Grid container sx={{ gap: 2 }}>
          {/* Filtros */}

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
                variant="outlined"
                color="inherit"
                startIcon={<KeyboardBackspaceIcon />}
                onClick={() => router.push("/dashboard/permisos/pendiente")}
                sx={{
                  minWidth: 120,
                  height: 44,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Volver
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RestartAltIcon />}
                onClick={resetForm}
                disabled={saving}
                sx={{
                  minWidth: 120,
                  height: 44,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
                color="primary"
                disabled={saving}
                onClick={handleSubmit(onSubmit)}
                sx={{
                  minWidth: 140,
                  height: 44,
                  boxShadow: "none",
                  borderRadius: 2,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
