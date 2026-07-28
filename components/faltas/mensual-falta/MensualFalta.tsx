"use client";

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
import { Controller, useForm } from "react-hook-form";
import {
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { FaltaMensualForm, FaltaMensualSchema } from "@/features/dashboard/falta/falta.schema";
import { useState } from "react";
import { ListarFaltaMensual } from "@/features/dashboard/falta/falta.type";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
import { useMounted } from "@/shared/hooks/useMounted";
import { useFaltasMensuales } from "@/features/dashboard/falta/hooks/useFaltasMensuales";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { AccessTime, EventNote } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import { useCancelarFalta } from "@/features/dashboard/falta/hooks/useCancelarFalta";
import { CondicionFalta, Justificacion } from "@/features/dashboard/falta/falta.constants";
import { formatDate } from "@/shared/utils/date";
import { avatarStyle, getInitials } from "@/shared/utils/avatar";

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

const condicionConfig: Record<CondicionFalta, { color: "warning" | "success" | "error"; label: string }> = {
  [CondicionFalta.Pendiente]: { color: "warning", label: "Pendiente" },
  [CondicionFalta.Aprobado]: { color: "success", label: "Aprobado" },
  [CondicionFalta.Cancelado]: { color: "error", label: "Cancelado" },
};

const justificaConfig: Record<Justificacion, { color: "success" | "default"; label: string }> = {
  [Justificacion.Si]: { color: "success", label: "Sí" },
  [Justificacion.No]: { color: "default", label: "No" },
};

interface RowProps {
  row: ListarFaltaMensual;
  puedeCancelar: boolean;
  onCancelar: (id: number, nombreCompleto: string) => void;
}

function Row({ row, puedeCancelar, onCancelar }: RowProps) {
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
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 700,
                mr: 1,
                bgcolor: avatarStyle(row.empleadoId).bg,
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
          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}>
            {row.cantidadFaltas}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Stack sx={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 15, color: "primary.main" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.totalDiasFaltas} día{row.totalDiasFaltas !== 1 ? "s" : ""}
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
                Detalle de faltas — {row.nombreCompleto}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "background.default",
                      "& th": {
                        fontWeight: 700,
                        fontSize: 12,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      },
                    }}
                  >
                    <TableCell>Inicio</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell align="center">Días</TableCell>
                    <TableCell align="center">Justificada</TableCell>
                    <TableCell>Observación</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.faltas.map((falta) => {
                    const justifica = justificaConfig[falta.justifica];
                    const estado = condicionConfig[falta.condicion];
                    return (
                      <TableRow key={falta.id} hover>
                        <TableCell>
                          <Typography variant="body2">{formatDate(falta.fechaInicio)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatDate(falta.fechaFin)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 500, color: "primary.main" }}>
                            {falta.totalDias}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={justifica.label} size="small" color={justifica.color} />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={falta.observacion || "—"} placement="top">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            >
                              {falta.observacion || "—"}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={estado.label} color={estado.color} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          {puedeCancelar && (
                            <Tooltip title="Cancelar falta">
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelar(falta.id, row.nombreCompleto);
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

//! Funcion fecha actual
const fechaActual = new Date();

//! Valores por defecto del formulario
const defaultValues: FaltaMensualForm = {
  anio: fechaActual.getFullYear(),
  mes: fechaActual.getMonth() + 1,
};

export default function ListarFaltasMensual() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarFaltaMensual) : false;
  const puedeCancelar = user ? hasPermission(user.rol, permissions.cancelarFalta) : false;
  const [filtros, setFiltros] = useState<FaltaMensualForm>(defaultValues);
  const { cancelarFalta, loading: cancelando } = useCancelarFalta();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{ id: number; nombreCompleto: string } | null>(null);
  const { faltasMensuales, loading: loadingFaltas } = useFaltasMensuales(canAccess, filtros.anio, filtros.mes);
  const mounted = useMounted();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaltaMensualForm>({
    resolver: standardSchemaResolver(FaltaMensualSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = (data: FaltaMensualForm) => setFiltros(data);

  const handleClear = () => {
    reset(defaultValues);
    setFiltros({ anio: 0, mes: 0 });
  };

  const handleOpenDialog = (id: number, nombreCompleto: string) => {
    setSelectedRow({ id, nombreCompleto });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleCancelar = () => {
    if (!selectedRow) return;
    cancelarFalta(selectedRow.id);
    handleCloseDialog();
  };

  const rows = React.useMemo(() => {
    if (filtros.anio === 0 || filtros.mes === 0) return [];
    return faltasMensuales;
  }, [faltasMensuales, filtros]);

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
      <Stack
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
          <EventNote color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            REPORTE MENSUAL DE FALTAS
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: { xs: "100%", md: "auto" } }}>
          <Stack
            sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1, alignItems: { xs: "stretch", sm: "center" } }}
          >
            <Controller
              name="anio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Año"
                  size="small"
                  sx={{ width: { xs: "100%", sm: 90 } }}
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
                <FormControl
                  size="small"
                  error={!!errors.mes}
                  sx={{ minWidth: { xs: "100%", sm: 140 }, width: { xs: "100%", sm: "auto" } }}
                >
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

            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                flexShrink: 0,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                startIcon={<Search />}
                sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<KeyboardBackspaceIcon />}
                onClick={() => router.push("/dashboard/faltas/pendientes")}
                sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
              >
                Volver
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RestartAltIcon />}
                onClick={handleClear}
                sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
              >
                Limpiar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, bgcolor: "background.paper" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "background.default",
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
              <TableCell align="center">Solicitudes</TableCell>
              <TableCell align="center">Días acumulados</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loadingFaltas ? (
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
                  <Stack sx={{ spacing: 1, alignItems: "center", gap: 1 }}>
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
              rows.map((row) => (
                <Row key={row.empleadoId} row={row} puedeCancelar={puedeCancelar} onCancelar={handleOpenDialog} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Cancelar falta</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Está seguro que desea cancelar la falta de <strong>{selectedRow?.nombreCompleto}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={cancelando}>
            Cerrar
          </Button>
          <Button variant="contained" color="error" onClick={handleCancelar} disabled={cancelando}>
            {cancelando ? "Cancelando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
