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
import { PermisoMensualForm, PermisoMensualSchema } from "@/features/dashboard/permiso/permiso.schema";
import { useState } from "react";
import { ListarPermisoMensual } from "@/features/dashboard/permiso/permiso.type";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
import { useMounted } from "@/shared/hooks/useMounted";
import { usePermisosMensuales } from "@/features/dashboard/permiso/hooks/usePermisosMensuales";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { AccessTime, EventNote } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import { useCancelarPermiso } from "@/features/dashboard/permiso/hooks/useCancelarPermiso";
import {
  avatarStyle,
  getInitials,
  formatHoras,
  CondicionPermisoColor,
  CondicionPermisoLabel,
} from "@/features/dashboard/permiso/permisos.constants";

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

//! Props para las filas
interface RowProps {
  row: ListarPermisoMensual;

  onRechazar: (id: number, nombreEmpleado: string) => void;
}

//! Fila de la tabla con detalle
function Row({ row, onRechazar }: RowProps) {
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
          <Chip
            label={row.cantidadPermisos}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, minWidth: 36 }}
          />
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 15, color: "primary.main" }} />
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
                    <TableCell>Fecha</TableCell>
                    <TableCell>Inicio</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Lugar</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
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
                          color="primary"
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
                      <TableCell align="center">
                        <Chip
                          label={CondicionPermisoLabel[permiso.condicion]}
                          color={CondicionPermisoColor[permiso.condicion]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Rechazar">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRechazar(permiso.id, row.nombreCompleto);
                              }}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
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

//! Funcion fecha actual
const fechaActual = new Date();

//! Valores por defecto del formulario
const defaultValues: PermisoMensualForm = {
  anio: fechaActual.getFullYear(),
  mes: fechaActual.getMonth() + 1,
};

export default function ListarPermisosMensual() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarPermisosMensual) : false;
  const [filtros, setFiltros] = useState<PermisoMensualForm>(defaultValues);
  const { cancelarPermiso, loading: cancelando } = useCancelarPermiso();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{ id: number; nombreEmpleado: string } | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const { permisosMensuales, loading: loadingPermisos } = usePermisosMensuales(canAccess, filtros.anio, filtros.mes);
  const mounted = useMounted();
  const router = useRouter();
  //! Formulario y validación
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
  //! Manejo de envío del formulario
  const onSubmit = (data: PermisoMensualForm) => setFiltros(data);

  //! Limpia los filtros y resultados
  const handleClear = () => {
    reset(defaultValues);
    setFiltros({ anio: 0, mes: 0 });
  };

  //! Abre el diálogo de rechazo
  const handleOpenDialog = (id: number, nombreEmpleado: string) => {
    setSelectedRow({ id, nombreEmpleado });
    setOpenDialog(true);
  };

  //! Cierra el diálogo de rechazo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    setMotivoCancelacion("");
  };

  //! guarda el rechazo del permiso
  const handleCancelar = () => {
    if (!selectedRow) return;
    if (!motivoCancelacion.trim()) return; // ← falta esta validación
    cancelarPermiso({ id: selectedRow.id, motivoCancelacion });
    handleCloseDialog();
  };

  //! Memoriza las filas
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
            Reporte mensual de permisos
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
                sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<KeyboardBackspaceIcon />}
                onClick={() => router.push("/dashboard/permisos/pendiente")}
                sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
              >
                Volver
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RestartAltIcon />}
                onClick={handleClear}
                sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
              >
                Limpiar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      {/* Tabla — FUERA del Box de flex para que ocupe todo el ancho */}
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
              rows.map((row) => <Row key={row.empleadoId} row={row} onRechazar={handleOpenDialog} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Rechazar permiso</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Está seguro que desea cancelar el permiso de <strong>{selectedRow?.nombreEmpleado}</strong>?
          </Typography>
          <TextField
            fullWidth
            label="Motivo de cancelación"
            multiline
            rows={3}
            value={motivoCancelacion}
            onChange={(e) => setMotivoCancelacion(e.target.value)}
            placeholder="Indique el motivo de la cancelación..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={cancelando} sx={{ minWidth: 120 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelar}
            disabled={cancelando || !motivoCancelacion.trim()}
            sx={{ minWidth: 140 }}
          >
            {cancelando ? "Cancelando..." : "Cancelar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
