"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
  TextField,
  Button,
  Autocomplete,
  Divider,
  CircularProgress,
  FormControl,
  FormHelperText,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useState } from "react";
import { EmpleadoAutocomplete } from "@/features/dashboard/empleado/empleado.types";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { RegistrarVacacionesForm, RegistrarVacacionesSchema } from "@/features/dashboard/vacaciones/vacaciones.schema";
import { toastPromise } from "@/shared/utils/toast";
import { registrarVacaciones } from "@/features/dashboard/vacaciones/vacaciones.logic";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
import { useQueryClient } from "@tanstack/react-query";
import { useMounted } from "@/shared/hooks/useMounted";
import { useEmpleadosAutocomplete } from "@/features/dashboard/empleado/hooks/useEmpleadosAutocomplete";
import { useRouter } from "next/navigation";

const defaultValues: RegistrarVacacionesForm = {
  empleadoId: 0,
  fechaInicio: "",
  fechaFin: "",
  observacion: "",
};

function calcularDias(inicio: string, fin: string): number | null {
  if (!inicio || !fin) return null;
  const d1 = dayjs(inicio);
  const d2 = dayjs(fin);
  if (!d1.isValid() || !d2.isValid() || d2.isBefore(d1)) return null;
  return d2.diff(d1, "day") + 1;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.25,
          bgcolor: "#F8F9FB",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", letterSpacing: "0.02em" }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Paper>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function RegistrarVacacion() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarVacaciones) : false;
  const [selectedEmployee, setSelectedEmployee] = useState<EmpleadoAutocomplete | null>(null);
  const [saving, setSaving] = useState(false);
  const mounted = useMounted();
  const queryClient = useQueryClient();
  const { empleados, loading: loadingEmployees } = useEmpleadosAutocomplete();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegistrarVacacionesForm>({
    resolver: standardSchemaResolver(RegistrarVacacionesSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");

  const diasCalculados = calcularDias(fechaInicio, fechaFin);

  const resetForm = () => {
    reset(defaultValues);
    setSelectedEmployee(null);
  };

  const onSubmit = async (data: RegistrarVacacionesForm) => {
    try {
      setSaving(true);
      await toastPromise(
        registrarVacaciones({
          empleadoId: data.empleadoId,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          observacion: data.observacion,
        }),
        {
          loading: "Registrando...",
          success: "Se ha registrado correctamente",
          error: "Error al registrar",
        },
      );
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box
        sx={{
          width: "50%",
          bgcolor: "background.default",
          minHeight: "100vh",
          mx: "auto",
          py: { xs: 2, md: 5 },
          px: 2,
        }}
      >
        {/* ── HEADER ── */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "#2458da", width: 40, height: 40 }}>
              <BeachAccessIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>Registro de Vacaciones</Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                Solicitud de días de descanso del empleado
              </Typography>
            </Box>
          </Stack>
          <Chip label="SuperAdmin" variant="outlined" size="small" sx={{ fontSize: 12 }} />
        </Paper>

        <Stack sx={{ gap: 2 }}>
          {/* ── SECCIÓN 1: EMPLEADO ── */}
          <Section title="Información del empleado">
            <Controller
              name="empleadoId"
              control={control}
              render={({ field }) => (
                <Autocomplete
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
                  mt: 1.5,
                  px: 1.5,
                  py: 1,
                  bgcolor: "#F0F4FF",
                  border: "1px solid #C7D7FD",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{selectedEmployee.nombreCompleto}</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{selectedEmployee.id}</Typography>
                </Box>
              </Box>
            )}
          </Section>

          {/* ── SECCIÓN 2: FECHAS ── */}
          <Section title="Datos de la vacación">
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "flex-start" },
              }}
            >
              {/* Fecha inicio — ✅ FIX 4: sin LocalizationProvider extra */}
              <Controller
                name="fechaInicio"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.fechaInicio}>
                    <DatePicker
                      label="Fecha de inicio"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) => field.onChange(val?.format("YYYY-MM-DD") ?? "")}
                      slotProps={{
                        textField: { size: "medium", fullWidth: true, error: !!errors.fechaInicio },
                      }}
                    />
                    <FormHelperText>{errors.fechaInicio?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              {/* Fecha fin — ✅ FIX 4: sin LocalizationProvider extra */}
              <Controller
                name="fechaFin"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.fechaFin}>
                    <DatePicker
                      label="Fecha de fin"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(val) => field.onChange(val?.format("YYYY-MM-DD") ?? "")}
                      slotProps={{
                        textField: { size: "medium", fullWidth: true, error: !!errors.fechaFin },
                      }}
                    />
                    <FormHelperText>{errors.fechaFin?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              {/* Días calculados */}
              <Box
                sx={{
                  minWidth: 110,
                  border: "1px solid",
                  borderColor: diasCalculados !== null ? "#BBF7D0" : "divider",
                  bgcolor: diasCalculados !== null ? "#F0FDF4" : "#F8F9FB",
                  borderRadius: "6px",
                  px: 1.5,
                  py: 0.75,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <Typography
                  sx={{
                    fontSize: diasCalculados !== null ? 22 : 14,
                    fontWeight: 700,
                    color: diasCalculados !== null ? "#15803D" : "text.disabled",
                    lineHeight: 1,
                  }}
                >
                  {diasCalculados !== null ? diasCalculados : "—"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: diasCalculados !== null ? "#4ADE80" : "text.disabled",
                    mt: 0.25,
                  }}
                >
                  {diasCalculados === 1 ? "día" : "días"}
                </Typography>
              </Box>
            </Stack>
          </Section>

          {/* ── SECCIÓN 3: DETALLES ── */}
          <Section title="Detalles de la vacación">
            <Controller
              name="observacion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observación"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Describa la observación..."
                  error={!!errors.observacion}
                  helperText={errors.observacion?.message}
                />
              )}
            />
          </Section>

          {/* ── DIVIDER + ACCIONES ── */}
          <Divider />

          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/dashboard/vacaciones/listar")}
              // ✅ FIX 2: usar "saving" consistentemente
              disabled={saving}
              sx={{
                borderColor: "divider",
                color: "text.secondary",
                "&:hover": { borderColor: "text.secondary" },
              }}
            >
              Volver
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={resetForm}
              disabled={saving}
              color="warning"
            >
              Limpiar
            </Button>

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              disableElevation
              sx={{ minWidth: 120 }}
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
