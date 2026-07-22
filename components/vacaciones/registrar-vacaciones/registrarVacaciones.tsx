"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  TextField,
  Button,
  Autocomplete,
  Divider,
  CircularProgress,
  FormControl,
  FormHelperText,
  Card,
  CardContent,
} from "@mui/material";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { RegistrarVacacionesForm, RegistrarVacacionesSchema } from "@/features/dashboard/vacaciones/vacaciones.schema";
import { toastPromise } from "@/shared/utils/toast";
import { registrarVacaciones } from "@/features/dashboard/vacaciones/vacaciones.logic";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
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
          bgcolor: "action.hover",
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
  const [saving, setSaving] = useState(false);
  const mounted = useMounted();
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
          error: (error) => error.message,
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
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
        {/* ── HEADER ── */}
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
                <BeachAccessIcon />
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
                  Registro de Vacaciones
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Solicitud de días de descanso del empleado.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

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
                  minWidth: { xs: 80, sm: 110 },
                  width: { xs: "100%", sm: "auto" },
                  border: "1px solid",
                  borderColor: diasCalculados !== null ? "success.main" : "divider",
                  bgcolor: diasCalculados !== null ? "success.50" : "action.hover",
                  borderRadius: "6px",
                  px: { xs: 1, sm: 1.5 },
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
                    color: diasCalculados !== null ? "success.main" : "text.disabled",
                    lineHeight: 1,
                  }}
                >
                  {diasCalculados !== null ? diasCalculados : "—"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: diasCalculados !== null ? "success.main" : "text.disabled",
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
                  sx={{ "& .MuiInputBase-input": { textTransform: "uppercase" } }}
                />
              )}
            />
          </Section>
          {/* Botones de acción */}
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "stretch", sm: "flex-end" },
              gap: { xs: 1, sm: 1.5 },
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={() => router.push("/dashboard/vacaciones/resumen")}
              disabled={saving}
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
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
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
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
