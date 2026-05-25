import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as React from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Controller, useForm } from "react-hook-form";
import {
  Avatar,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PermisoMensualForm, PermisoMensualSchema } from "@/features/dashboard/permiso/permiso.schema";
import { useState } from "react";
import { Condicion, ListarPermisoMensual } from "@/features/dashboard/permiso/permiso.type";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
import { useMounted } from "@/shared/hooks/useMounted";
import { usePermisosMensuales } from "@/features/dashboard/permiso/hooks/usePermisosMensuales";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { AccessTime, CleaningServices, EventNote } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const meses = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];
const chipCondicion = (condicion: Condicion) => {
  const config: Record<Condicion, { color: "warning" | "success" | "error"; label: string }> = {
    Pendiente: { color: "warning", label: "Pendiente" },
    Aprobado: { color: "success", label: "Aprobado" },
    Rechazado: { color: "error", label: "Rechazado" },
  };
  return <Chip size="small" color={config[condicion].color} label={config[condicion].label} />;
};
// Iniciales para el avatar
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

// Color de avatar por empleadoId
const avatarColor = (id: number) => {
  const colors = ["#5C6BC0", "#26A69A", "#EF5350", "#AB47BC", "#FF7043", "#29B6F6", "#66BB6A"];
  return colors[id % colors.length];
};
interface RowProps {
  row: ListarPermisoMensual;
}

// Función para formatear horas a formato "Xh Ym"
const formatHoras = (horas: number): string => {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
};

function Row({ row }: RowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        hover
        sx={{
          cursor: "pointer",
          "& > td": { borderBottom: open ? 0 : undefined },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell width={52}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
            {row.codigoEmpleado}
          </Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" sx={{ spacing: 1.5, alignItems: "center" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 700,
                mr: 1,
                bgcolor: avatarColor(row.empleadoId),
              }}
            >
              {getInitials(row.nombreCompleto)}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.nombreCompleto}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="center">
          <Chip
            label={row.cantidadPermisos}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, minWidth: 36 }}
          />
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" sx={{ spacing: 0.5, justifyContent: "center", alignItems: "center" }}>
            <AccessTime sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatHoras(row.totalHorasPermisos)}
            </Typography>
          </Stack>
        </TableCell>
      </TableRow>

      {/* Detalle colapsable */}
      <TableRow>
        <TableCell colSpan={5} sx={{ py: 0, borderBottom: open ? undefined : 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ px: 3, py: 2, bgcolor: "action.hover", borderRadius: 1, mx: 1, mb: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}
              >
                Detalle de permisos — {row.nombreCompleto}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        fontWeight: 700,
                        fontSize: 12,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      },
                    }}
                  >
                    <TableCell>Fecha</TableCell>
                    <TableCell>Inicio</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Lugar</TableCell>
                    <TableCell align="center">Estado</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.permisos.map((permiso) => (
                    <TableRow key={permiso.id} hover>
                      <TableCell>
                        <Typography variant="body2">{permiso.fecha}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          {permiso.horaInicio}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          {permiso.horaFin}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={formatHoras(permiso.totalHoras)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: 11 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={permiso.motivo} placement="top">
                          <Typography
                            variant="body2"
                            sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {permiso.motivo}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {permiso.lugar}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{chipCondicion(permiso.condicion as Condicion)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const fechaActual = new Date();

const defaultValues: PermisoMensualForm = {
  anio: fechaActual.getFullYear(),
  mes: fechaActual.getMonth() + 1,
};
export default function ListarPermisosMensual() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarPermisosMensual) : false;
  const [filtros, setFiltros] = useState<PermisoMensualForm>(defaultValues);
  const mounted = useMounted();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermisoMensualForm>({
    resolver: standardSchemaResolver(PermisoMensualSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { permisosMensuales, loading: loadingPermisos } = usePermisosMensuales(canAccess, filtros.anio, filtros.mes);

  const onSubmit = (data: PermisoMensualForm) => setFiltros(data);

  const handleClear = () => {
    reset(defaultValues);
    setFiltros({ anio: 0, mes: 0 });
  };

  const rows = React.useMemo(() => {
    if (filtros.anio === 0 || filtros.mes === 0) return [];
    return permisosMensuales;
  }, [permisosMensuales, filtros]);

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  //! ── Efecto de montaje ──
  if (!mounted) return null;
  //* Validando permiso de acceso
  if (!canAccess) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, alignItems: "center", flexWrap: "wrap", gap: 1 }}>
        {/* Título */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <EventNote color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Reporte mensual de permisos
            </Typography>
          </Stack>
        </Grid>

        {/* Filtros */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1, alignItems: "flex-start" }}>
              <Controller
                name="anio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Año"
                    size="small"
                    sx={{ width: 90 }}
                    error={!!errors.anio}
                    helperText={errors.anio?.message}
                    slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 4 } }}
                    onChange={(e) => field.onChange(Number(e.target.value.replace(/\D/g, "").slice(0, 4)))}
                  />
                )}
              />

              <Controller
                name="mes"
                control={control}
                render={({ field }) => (
                  <FormControl size="small" error={!!errors.mes} sx={{ minWidth: 130 }}>
                    <InputLabel>Mes</InputLabel>
                    <Select {...field} label="Mes">
                      {meses.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                          {m.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Stack sx={{ flexDirection: "row", gap: 1, flexShrink: 0 }}>
                <Button type="submit" variant="contained" startIcon={<Search />} size="medium">
                  Buscar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CleaningServices />}
                  onClick={handleClear}
                  size="medium"
                >
                  Limpiar
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Box>

      {/* Tabla — FUERA del Box de flex para que ocupe todo el ancho */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "action.hover",
                "& th": {
                  fontWeight: 700,
                  fontSize: 12,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                },
              }}
            >
              <TableCell width={42} />
              <TableCell>Código</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell align="center">Permisos</TableCell>
              <TableCell align="center">Horas acumuladas</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loadingPermisos ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton height={44} />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Stack sx={{ spacing: 1, alignItems: "center" }}>
                    <AccessTime sx={{ fontSize: 40, color: "text.disabled" }} />
                    <Typography variant="body2" color="text.secondary">
                      {filtros.anio === 0
                        ? "Selecciona un año y mes para buscar"
                        : "No hay registros para el período seleccionado"}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => <Row key={row.empleadoId} row={row} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
