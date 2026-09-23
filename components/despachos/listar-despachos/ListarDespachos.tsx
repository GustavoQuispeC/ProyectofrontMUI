"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  useAsignarConductorVehiculo,
  useCompletarDespacho,
  useConductoresDespacho,
  useDespacharEnTienda,
  useDespachosPorVenta,
  useEstadosDespacho,
  useMarcarDespachoEnRuta,
} from "@/features/dashboard/despacho/hooks/useDespachos";
import { Despacho } from "@/features/dashboard/despacho/despacho.type";
import { esEnvioDomicilio } from "@/features/dashboard/despacho/despacho.logic";
import { imprimirTicketDespacho, ProductoPendienteDespacho } from "@/features/dashboard/despacho/despacho.ticket";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useVehiculos } from "@/features/dashboard/vehiculo/hooks/useVehiculos";
import { toastPromise } from "@/shared/utils/toast";

const estadoFallback: Record<number, string> = {
  1: "Pendiente",
  2: "En ruta",
  3: "Entregado",
  4: "Cancelado",
};

const estadoColor: Record<number, "warning" | "info" | "success" | "error"> = {
  1: "warning",
  2: "info",
  3: "success",
  4: "error",
};

function fecha(value: string | null) {
  return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—";
}

function DespachoCard({
  despacho,
  estadoNombre,
  canAssign,
  completando,
  onAsignar,
  onEnRuta,
  onCompletar,
  onImprimir,
}: {
  despacho: Despacho;
  estadoNombre: string;
  canAssign: boolean;
  completando: boolean;
  onAsignar: (despacho: Despacho) => void;
  onEnRuta: (despacho: Despacho) => void;
  onCompletar: (despacho: Despacho) => void;
  onImprimir: (despacho: Despacho) => void;
}) {
  const tienePendientes = despacho.detalles.some((detalle) => Number(detalle.cantidadPendiente) > 0);
  const envioDomicilio = esEnvioDomicilio(despacho.modalidad);
  const tieneAsignacion = Boolean(despacho.conductorEmpleadoId && despacho.vehiculoId);
  const puedeSalir = tieneAsignacion;

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden", borderRadius: 2 }}>
      <Box sx={{ px: 2.5, py: 2, bgcolor: "action.hover" }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", gap: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {despacho.codigo}
            </Typography>
            <Chip size="small" label={estadoNombre} color={estadoColor[despacho.estado] ?? "info"} />
            <Chip size="small" variant="outlined" label={envioDomicilio ? "Envío a domicilio" : "Recojo en tienda"} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Programado: {fecha(despacho.fechaProgramada)}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" sx={{ gap: 3, flexWrap: "wrap", mb: 2 }}>
          <Typography variant="body2">
            <strong>Venta:</strong> {despacho.ventaCodigo}
          </Typography>
          <Typography variant="body2">
            <strong>Tienda:</strong> {despacho.tiendaNombre}
          </Typography>
          <Typography variant="body2">
            <strong>Conductor:</strong> {despacho.conductorNombre || "Sin asignar"}
          </Typography>
          <Typography variant="body2">
            <strong>Vehículo:</strong> {despacho.vehiculoPlaca || "Sin asignar"}
          </Typography>
          <Typography variant="body2">
            <strong>Fecha de entrega:</strong> {fecha(despacho.fechaEntrega)}
          </Typography>
        </Stack>

        {despacho.direccionEntrega && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Dirección:</strong> {despacho.direccionEntrega}
          </Typography>
        )}
        {despacho.observaciones && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Observaciones:</strong> {despacho.observaciones}
          </Typography>
        )}

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell>Producto</TableCell>
                <TableCell align="right">A despachar</TableCell>
                <TableCell align="right">Total venta</TableCell>
                <TableCell align="right">Ya despachado</TableCell>
                <TableCell align="right">Pendiente</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {despacho.detalles.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell>
                    {detalle.productoCodigo} - {detalle.productoNombre}
                  </TableCell>
                  <TableCell align="right">{detalle.cantidad}</TableCell>
                  <TableCell align="right">{detalle.cantidadTotalVenta}</TableCell>
                  <TableCell align="right">{detalle.cantidadYaDespachada}</TableCell>
                  <TableCell align="right">
                    <Typography
                      component="span"
                      variant="body2"
                      color={Number(detalle.cantidadPendiente) > 0 ? "warning.main" : "success.main"}
                      sx={{ fontWeight: 700 }}
                    >
                      {detalle.cantidadPendiente}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {despacho.detalles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Sin productos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />
        <Stack direction="row" sx={{ justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
          <Tooltip title="Imprimir ticket de despacho">
            <Button
              size="small"
              variant="outlined"
              startIcon={<LocalPrintshopOutlinedIcon />}
              onClick={() => onImprimir(despacho)}
            >
              Ticket
            </Button>
          </Tooltip>
          {!tienePendientes && (
            <Chip size="small" color="success" icon={<CheckCircleOutlineIcon />} label="Despacho completo" />
          )}
          {despacho.estado === 1 && (
            <>
              {envioDomicilio && (
                <Tooltip title={canAssign ? "" : "No tienes permisos para consultar conductores y vehículos"}>
                  <span>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AssignmentIndIcon />}
                      disabled={!canAssign}
                      onClick={() => onAsignar(despacho)}
                    >
                      Asignar conductor/vehículo
                    </Button>
                  </span>
                </Tooltip>
              )}
              <Tooltip
                title={
                  envioDomicilio && !puedeSalir ? "Asigne conductor y vehículo antes de poner el despacho en ruta" : ""
                }
              >
                <span>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<LocalShippingOutlinedIcon />}
                    disabled={envioDomicilio && !puedeSalir}
                    onClick={() => onEnRuta(despacho)}
                  >
                    Completar despacho
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
          {despacho.estado === 2 && (
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={completando}
              onClick={() => onCompletar(despacho)}
              startIcon={completando ? <CircularProgress size={16} color="inherit" /> : <CheckCircleOutlineIcon />}
            >
              Marcar como entregado
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}

export default function ListarDespachos() {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const ventaIdParam = searchParams.get("ventaId");
  const ventaId = ventaIdParam && /^\d+$/.test(ventaIdParam) && Number(ventaIdParam) > 0 ? Number(ventaIdParam) : null;
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarVentas) : false;
  const canAssign = user ? hasPermission(user.rol, permissions.listarVehiculos) : false;
  const { despachos, loading, error } = useDespachosPorVenta(ventaId);
  const { estados } = useEstadosDespacho();
  const { conductores, loading: loadingConductores, error: errorConductores } = useConductoresDespacho(canAssign);
  const { vehiculos, loading: loadingVehiculos, error: errorVehiculos } = useVehiculos(canAssign);
  const asignarMutation = useAsignarConductorVehiculo(ventaId);
  const enRutaMutation = useMarcarDespachoEnRuta(ventaId);
  const despacharMutation = useDespacharEnTienda(ventaId);
  const completarMutation = useCompletarDespacho(ventaId);
  const [despachoAsignar, setDespachoAsignar] = useState<Despacho | null>(null);
  const [despachoEnRuta, setDespachoEnRuta] = useState<Despacho | null>(null);
  const [cantidadesEnRuta, setCantidadesEnRuta] = useState<Record<number, string>>({});
  const [errorEnRuta, setErrorEnRuta] = useState<string | null>(null);
  const [conductorId, setConductorId] = useState<number | null>(null);
  const [vehiculoId, setVehiculoId] = useState<number | null>(null);
  const [fechaProgramada, setFechaProgramada] = useState<Dayjs | null>(null);
  const vehiculosActivos = useMemo(() => vehiculos.filter((vehiculo) => vehiculo.isActive), [vehiculos]);
  const estadoNombre = (estado: number) =>
    estados.find((item) => item.id === estado)?.nombre ?? estadoFallback[estado] ?? `#${estado}`;

  const imprimirDespacho = (despacho: Despacho) => {
    const pendientes = new Map<number, ProductoPendienteDespacho>();

    despachos
      .filter((item) => item.id !== despacho.id)
      .forEach((item) => {
        item.detalles.forEach((detalle) => {
          const cantidad = Number(detalle.cantidadPendiente);
          if (cantidad <= 0) return;

          const key = detalle.detalleVentaId || detalle.productoId;
          const actual = pendientes.get(key);
          if (!actual || cantidad > actual.cantidad) {
            pendientes.set(key, {
              productoCodigo: detalle.productoCodigo,
              productoNombre: detalle.productoNombre,
              cantidad,
            });
          }
        });
      });

    void imprimirTicketDespacho(despacho, Array.from(pendientes.values()));
  };

  const abrirAsignacion = (despacho: Despacho) => {
    setDespachoAsignar(despacho);
    setConductorId(despacho.conductorEmpleadoId);
    setVehiculoId(despacho.vehiculoId);
    setFechaProgramada(despacho.fechaProgramada ? dayjs(despacho.fechaProgramada) : dayjs());
  };

  const cerrarAsignacion = () => {
    if (asignarMutation.loading) return;
    setDespachoAsignar(null);
  };

  const abrirEnRuta = (despacho: Despacho) => {
    const cantidades = Object.fromEntries(despacho.detalles.map((detalle) => [detalle.id, String(detalle.cantidad)]));
    setDespachoEnRuta(despacho);
    setCantidadesEnRuta(cantidades);
    setErrorEnRuta(null);
  };

  const cerrarEnRuta = () => {
    if (enRutaMutation.loading || despacharMutation.loading) return;
    setDespachoEnRuta(null);
    setErrorEnRuta(null);
  };

  const actualizarCantidadEnRuta = (detalleId: number, value: string, maximo: number) => {
    const cantidad = Math.floor(Number(value));
    setCantidadesEnRuta((prev) => ({
      ...prev,
      [detalleId]: Number.isFinite(cantidad) ? String(Math.max(0, Math.min(cantidad, maximo))) : "0",
    }));
  };

  const confirmarEnRuta = async () => {
    if (!despachoEnRuta) return;

    const detalles = despachoEnRuta.detalles.map((detalle) => {
      const cantidad = Number(cantidadesEnRuta[detalle.id] ?? detalle.cantidad);
      return { despachoDetalleId: detalle.id, cantidad, maximo: Number(detalle.cantidad) };
    });

    const invalido = detalles.find(
      (detalle) =>
        !Number.isFinite(detalle.cantidad) ||
        detalle.cantidad < 0 ||
        detalle.cantidad > detalle.maximo ||
        !Number.isInteger(detalle.cantidad),
    );

    if (invalido) {
      setErrorEnRuta("Cada cantidad debe ser un número entero entre 0 y la cantidad del detalle.");
      return;
    }

    if (!detalles.some((detalle) => detalle.cantidad > 0)) {
      setErrorEnRuta("Al menos un producto debe tener cantidad mayor que cero.");
      return;
    }

    const esParcial = detalles.some((detalle) => detalle.cantidad !== detalle.maximo);
    const data = {
      detalles: detalles.map(({ despachoDetalleId, cantidad }) => ({
        despachoDetalleId,
        cantidad,
      })),
    };

    const esDomicilio = esEnvioDomicilio(despachoEnRuta.modalidad);

    try {
      await toastPromise(
        esDomicilio
          ? enRutaMutation.marcarEnRuta({ despacho: despachoEnRuta, data: esParcial ? data : undefined })
          : despacharMutation.despachar({ despacho: despachoEnRuta, data }),
        {
          loading: esParcial
            ? "Procesando despacho parcial..."
            : esDomicilio
              ? "Poniendo despacho en ruta..."
              : "Completando despacho...",
          success: esParcial
            ? "Despacho parcial procesado. Se creó el despacho pendiente complementario."
            : esDomicilio
              ? "Despacho puesto en ruta correctamente"
              : "Despacho marcado como entregado",
          error: (error) =>
            error.message ||
            (esDomicilio ? "No se pudo poner el despacho en ruta" : "No se pudo completar el despacho"),
        },
      );
      setDespachoEnRuta(null);
      setErrorEnRuta(null);
    } catch {
      return;
    }
  };

  const completarDespacho = async (despacho: Despacho) => {
    try {
      await toastPromise(completarMutation.completar({ despacho }), {
        loading: `Completando despacho ${despacho.codigo}...`,
        success: "Despacho marcado como entregado",
        error: (error) => error.message || "No se pudo completar el despacho",
      });
    } catch {
      return;
    }
  };

  const guardarAsignacion = async () => {
    if (!despachoAsignar || !conductorId || !vehiculoId || !fechaProgramada?.isValid()) return;

    try {
      await toastPromise(
        asignarMutation.asignar({
          id: despachoAsignar.id,
          data: {
            conductorEmpleadoId: conductorId,
            vehiculoId,
            fechaProgramada: fechaProgramada.toISOString(),
          },
        }),
        {
          loading: "Asignando conductor y vehículo...",
          success: "Conductor y vehículo asignados correctamente",
          error: (error) => error.message || "No se pudo asignar el despacho",
        },
      );
      setDespachoAsignar(null);
    } catch {
      return;
    }
  };

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <>
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <LocalShippingOutlinedIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  DESPACHOS DE LA VENTA
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {despachos[0]?.ventaCodigo
                    ? `Venta ${despachos[0].ventaCodigo}`
                    : ventaId
                      ? `Venta #${ventaId}`
                      : "Seleccione una venta"}
                </Typography>
              </Box>
            </Stack>
            <Button component={Link} href="/dashboard/ventas/listar" variant="outlined" startIcon={<ArrowBackIcon />}>
              Volver a ventas
            </Button>
          </Stack>
        </Box>

        <Stack sx={{ p: { xs: 2, md: 3 }, gap: 2 }}>
          {!ventaId && <Alert severity="warning">El identificador de la venta no es válido.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          {loading && (
            <Stack sx={{ alignItems: "center", py: 6 }}>
              <CircularProgress size={32} />
            </Stack>
          )}
          {!loading && !error && ventaId && despachos.length === 0 && (
            <Alert severity="info">Esta venta todavía no tiene despachos registrados.</Alert>
          )}
          {despachos.map((despacho) => (
            <DespachoCard
              key={despacho.id}
              despacho={despacho}
              estadoNombre={estadoNombre(despacho.estado)}
              canAssign={canAssign}
              completando={completarMutation.completandoId === despacho.id}
              onAsignar={abrirAsignacion}
              onEnRuta={abrirEnRuta}
              onCompletar={(value) => void completarDespacho(value)}
              onImprimir={imprimirDespacho}
            />
          ))}
        </Stack>
      </Paper>

      <Dialog open={Boolean(despachoAsignar)} onClose={cerrarAsignacion} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar conductor y vehículo</DialogTitle>
        <DialogContent dividers>
          <Stack sx={{ gap: 2, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Despacho: <strong>{despachoAsignar?.codigo}</strong>
            </Typography>
            {(errorConductores || errorVehiculos || asignarMutation.error) && (
              <Alert severity="error">{errorConductores || errorVehiculos || asignarMutation.error}</Alert>
            )}
            {!loadingConductores && conductores.length === 0 && (
              <Alert severity="warning">No se encontraron conductores disponibles.</Alert>
            )}
            <Autocomplete
              size="small"
              options={conductores}
              loading={loadingConductores}
              value={conductores.find((conductor) => Number(conductor.id) === conductorId) ?? null}
              getOptionLabel={(conductor) =>
                conductor.codigoEmpleado
                  ? `${conductor.nombreCompleto} - ${conductor.codigoEmpleado}`
                  : conductor.nombreCompleto
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_event, value) => setConductorId(value ? Number(value.id) : null)}
              renderInput={(params) => <TextField {...params} label="Conductor" required />}
            />
            <Autocomplete
              size="small"
              options={vehiculosActivos}
              loading={loadingVehiculos}
              value={vehiculosActivos.find((vehiculo) => vehiculo.id === vehiculoId) ?? null}
              getOptionLabel={(vehiculo) => `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_event, value) => setVehiculoId(value?.id ?? null)}
              renderInput={(params) => <TextField {...params} label="Vehículo" required />}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Fecha programada"
                value={fechaProgramada}
                onChange={setFechaProgramada}
                ampm={false}
                format="DD/MM/YYYY HH:mm"
                slotProps={{ textField: { size: "small", required: true } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={cerrarAsignacion} disabled={asignarMutation.loading}>
            Cancelar
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => void guardarAsignacion()}
            disabled={
              asignarMutation.loading ||
              loadingConductores ||
              loadingVehiculos ||
              !conductorId ||
              !vehiculoId ||
              !fechaProgramada?.isValid()
            }
            startIcon={asignarMutation.loading ? <CircularProgress size={16} color="inherit" /> : <AssignmentIndIcon />}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(despachoEnRuta)} onClose={cerrarEnRuta} maxWidth="md" fullWidth>
        <DialogTitle>Completar despacho {despachoEnRuta?.codigo}</DialogTitle>
        <DialogContent dividers>
          <Stack sx={{ gap: 2 }}>
            <Alert severity="info">
              Confirme las cantidades que salen en este despacho. Si reduce alguna cantidad, el restante quedará en un
              nuevo despacho pendiente.
            </Alert>
            {(errorEnRuta || enRutaMutation.error || despacharMutation.error) && (
              <Alert severity="error">{errorEnRuta || enRutaMutation.error || despacharMutation.error}</Alert>
            )}
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cant. venta</TableCell>
                    <TableCell align="right">Cant. despacho</TableCell>
                    <TableCell align="right" sx={{ width: 170 }}>
                      A despachar
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {despachoEnRuta?.detalles.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell>
                        {detalle.productoCodigo} - {detalle.productoNombre}
                      </TableCell>
                      <TableCell align="right">{detalle.cantidadTotalVenta}</TableCell>
                      <TableCell align="right">{detalle.cantidad}</TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={cantidadesEnRuta[detalle.id] ?? String(detalle.cantidad)}
                          onChange={(event) =>
                            actualizarCantidadEnRuta(detalle.id, event.target.value, Number(detalle.cantidad))
                          }
                          onFocus={(event) => event.target.select()}
                          slotProps={{
                            htmlInput: { min: 0, max: Number(detalle.cantidad), step: 1 },
                          }}
                          sx={{ width: 130 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {despachoEnRuta?.detalles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Sin productos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={cerrarEnRuta} disabled={enRutaMutation.loading || despacharMutation.loading}>
            Cancelar
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => void confirmarEnRuta()}
            disabled={enRutaMutation.loading || despacharMutation.loading || despachoEnRuta?.detalles.length === 0}
            startIcon={
              enRutaMutation.loading || despacharMutation.loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : despachoEnRuta && esEnvioDomicilio(despachoEnRuta.modalidad) ? (
                <LocalShippingOutlinedIcon />
              ) : (
                <CheckCircleOutlineIcon />
              )
            }
          >
            {despachoEnRuta && esEnvioDomicilio(despachoEnRuta.modalidad) ? "Poner en ruta" : "Completar despacho"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
