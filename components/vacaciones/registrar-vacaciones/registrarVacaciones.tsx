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
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

// ─── Tipos locales ────────────────────────────────────────────────────────────

interface EmpleadoOption {
  empleadoId: number;
  nombreCompleto: string;
  codigoEmpleado: string;
}

interface RegistrarVacacionForm {
  empleado: EmpleadoOption | null;
  fechaInicio: Dayjs | null;
  fechaFin: Dayjs | null;
  observacion: string;
}

const EMPTY_FORM: RegistrarVacacionForm = {
  empleado: null,
  fechaInicio: null,
  fechaFin: null,
  observacion: "",
};

// ─── Datos de ejemplo (reemplazar con hook real) ──────────────────────────────

const EMPLEADOS_MOCK: EmpleadoOption[] = [
  { empleadoId: 21, nombreCompleto: "Ana García López", codigoEmpleado: "EMP-021" },
  { empleadoId: 22, nombreCompleto: "Carlos Mendoza Ríos", codigoEmpleado: "EMP-022" },
  { empleadoId: 23, nombreCompleto: "Lucía Torres Vega", codigoEmpleado: "EMP-023" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const avatarPalette = [
  { bg: "#2458da", color: "#ffffff" },
  { bg: "#15a167", color: "#ffffff" },
  { bg: "#621cb1", color: "#ffffff" },
  { bg: "#842910", color: "#ffffff" },
  { bg: "#125393", color: "#ffffff" },
];
const avatarStyle = (id: number) => avatarPalette[id % avatarPalette.length];

function calcDias(inicio: Dayjs | null, fin: Dayjs | null): number | null {
  if (!inicio || !fin || fin.isBefore(inicio)) return null;
  return fin.diff(inicio, "day") + 1;
}

// ─── SECCIÓN WRAPPER ──────────────────────────────────────────────────────────

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
  const [form, setForm] = React.useState<RegistrarVacacionForm>(EMPTY_FORM);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof RegistrarVacacionForm, string>>>({});

  const diasCalculados = calcDias(form.fechaInicio, form.fechaFin);

  // ── Validación ───────────────────────────────────────────────────────────────
  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.empleado) next.empleado = "Selecciona un empleado";
    if (!form.fechaInicio) next.fechaInicio = "Fecha de inicio requerida";
    if (!form.fechaFin) next.fechaFin = "Fecha de fin requerida";
    if (form.fechaInicio && form.fechaFin && form.fechaFin.isBefore(form.fechaInicio)) {
      next.fechaFin = "La fecha fin no puede ser anterior al inicio";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Guardar ──────────────────────────────────────────────────────────────────
  async function handleGuardar() {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        empleadoId: form.empleado!.empleadoId,
        fechaInicio: form.fechaInicio!.format("YYYY-MM-DDTHH:mm:ss"),
        fechaFin: form.fechaFin!.format("YYYY-MM-DDTHH:mm:ss"),
        observacion: form.observacion.trim(),
      };
      // TODO: reemplazar con llamada real al API
      console.log("Payload →", payload);
      await new Promise((r) => setTimeout(r, 1000)); // simulación
    } finally {
      setLoading(false);
    }
  }

  // ── Limpiar ──────────────────────────────────────────────────────────────────
  function handleLimpiar() {
    setForm(EMPTY_FORM);
    setErrors({});
  }

  // ── Volver ───────────────────────────────────────────────────────────────────
  function handleVolver() {
    // TODO: reemplazar con router.back() o navegación real
    console.log("Volver");
  }

  const palette = form.empleado ? avatarStyle(form.empleado.empleadoId) : null;

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
            <Autocomplete
              options={EMPLEADOS_MOCK}
              getOptionLabel={(o) => `${o.codigoEmpleado} — ${o.nombreCompleto}`}
              value={form.empleado}
              onChange={(_, value) => {
                setForm((prev) => ({ ...prev, empleado: value }));
                setErrors((prev) => ({ ...prev, empleado: undefined }));
              }}
              renderOption={(props, option) => {
                const p = avatarStyle(option.empleadoId);
                return (
                  <Box component="li" {...props} key={option.empleadoId}>
                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.25 }}>
                      <Avatar
                        sx={{ width: 26, height: 26, fontSize: 10, fontWeight: 700, bgcolor: p.bg, color: p.color }}
                      >
                        {getInitials(option.nombreCompleto)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{option.nombreCompleto}</Typography>
                        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{option.codigoEmpleado}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar empleado"
                  error={!!errors.empleado}
                  helperText={errors.empleado}
                  size="small"
                />
              )}
              noOptionsText="Sin coincidencias"
              fullWidth
            />

            {/* Preview del empleado seleccionado */}
            {form.empleado && palette && (
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
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: palette.bg,
                    color: palette.color,
                  }}
                >
                  {getInitials(form.empleado.nombreCompleto)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{form.empleado.nombreCompleto}</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{form.empleado.codigoEmpleado}</Typography>
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
              {/* Fecha inicio */}
              <DatePicker
                label="Fecha de inicio"
                value={form.fechaInicio}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, fechaInicio: value }));
                  setErrors((prev) => ({ ...prev, fechaInicio: undefined }));
                }}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!errors.fechaInicio,
                    helperText: errors.fechaInicio,
                  },
                }}
              />

              {/* Fecha fin */}
              <DatePicker
                label="Fecha de fin"
                value={form.fechaFin}
                minDate={form.fechaInicio ?? undefined}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, fechaFin: value }));
                  setErrors((prev) => ({ ...prev, fechaFin: undefined }));
                }}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!errors.fechaFin,
                    helperText: errors.fechaFin,
                  },
                }}
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
                  sx={{ fontSize: 10, color: diasCalculados !== null ? "#4ADE80" : "text.disabled", mt: 0.25 }}
                >
                  {diasCalculados === 1 ? "día" : "días"}
                </Typography>
              </Box>
            </Stack>
          </Section>

          {/* ── SECCIÓN 3: DETALLES ── */}
          <Section title="Detalles de la vacación">
            <TextField
              label="Observación"
              placeholder="Motivo o detalle adicional de las vacaciones..."
              value={form.observacion}
              onChange={(e) => setForm((prev) => ({ ...prev, observacion: e.target.value }))}
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              size="small"
              helperText={`${form.observacion.length}/500`}
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
              onClick={handleVolver}
              disabled={loading}
              sx={{ borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "text.secondary" } }}
            >
              Volver
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleLimpiar}
              disabled={loading}
              color="warning"
            >
              Limpiar
            </Button>

            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              onClick={handleGuardar}
              disabled={loading}
              disableElevation
              sx={{ minWidth: 120 }}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
