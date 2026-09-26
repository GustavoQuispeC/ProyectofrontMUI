"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { esES } from "@mui/x-data-grid/locales";

import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { useCajaSesionesPorTienda } from "@/features/dashboard/caja/hooks/useCajaSesion";
import { useClientesListado } from "@/features/dashboard/cliente/hooks/useClientesListado";
import { useReporteCajaPagos } from "@/features/dashboard/reportecaja/hooks/useReporteCaja";
import { useVentaById } from "@/features/dashboard/venta/hooks/useVenta";
import { ReporteCajaPago, NotaAfectada } from "@/features/dashboard/reportecaja/reportecaja.type";
import { Venta } from "@/features/dashboard/venta/venta.type";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const pageSizeOptions = [20, 50, 100];

const monedaFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const formaPagoTexto: Record<number, string> = {
  1: "Efectivo",
  2: "Depósito bancario",
};

function LoadingOverlay() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        zIndex: 1,
      }}
    >
      <CircularProgress size={32} />
    </Box>
  );
}

function formatFecha(fecha: string | null | undefined) {
  if (!fecha) return "-";
  return dayjs(fecha).format("DD/MM/YYYY HH:mm");
}

function notasTexto(notas: NotaAfectada[]) {
  if (!notas || notas.length === 0) return "-";
  return notas.map((n) => n.ventaCodigo).join(", ");
}

interface NotasAfectadasModalProps {
  open: boolean;
  onClose: () => void;
  pago: ReporteCajaPago | null;
  onVerVenta: (ventaId: number) => void;
}

function NotasAfectadasModal({ open, onClose, pago, onVerVenta }: NotasAfectadasModalProps) {
  if (!pago) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Notas de venta afectadas por pago {pago.pagoCodigo}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código de nota</TableCell>
                <TableCell align="right">Monto aplicado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pago.notasAfectadas.map((nota) => (
                <TableRow
                  key={nota.ventaId}
                  hover
                  onDoubleClick={() => onVerVenta(nota.ventaId)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{nota.ventaCodigo}</TableCell>
                  <TableCell align="right">{monedaFormatter.format(nota.montoAplicado)}</TableCell>
                  <TableCell align="center">
                    <Button size="small" startIcon={<VisibilityIcon />} onClick={() => onVerVenta(nota.ventaId)}>
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface VentaDetalleModalProps {
  open: boolean;
  onClose: () => void;
  venta: Venta | undefined;
  loading: boolean;
}

function VentaDetalleModal({ open, onClose, venta, loading }: VentaDetalleModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle de nota de venta</DialogTitle>
      <DialogContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && !venta && <Typography color="text.secondary">No se encontró la venta.</Typography>}
        {!loading && venta && (
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Código
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venta.codigo}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Cliente
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venta.clienteNombre}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de confirmación
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formatFecha(venta.fechaConfirmacion)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Tienda
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venta.tiendaNombre}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Estado
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venta.estado}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Tipo de pago
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venta.tipoPago}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Modalidad de entrega
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {venta.modalidadEntrega ?? venta.modalidad ?? "-"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {monedaFormatter.format(venta.total)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Monto pagado
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {monedaFormatter.format(venta.montoPagado)}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Detalles de productos
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio unitario</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venta.detalles.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell>{detalle.productoNombre}</TableCell>
                      <TableCell align="right">{detalle.cantidad}</TableCell>
                      <TableCell align="right">{monedaFormatter.format(detalle.precioUnitario)}</TableCell>
                      <TableCell align="right">{monedaFormatter.format(detalle.subtotal)}</TableCell>
                      <TableCell align="right">{monedaFormatter.format(detalle.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function IngresosCaja() {
  const mounted = useMounted();
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarCajaSesiones) : false;

  const [tiendaId, setTiendaId] = useState<number | "">("");
  const [cajaSesionId, setCajaSesionId] = useState<number | "">("");
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [formaPago, setFormaPago] = useState<number | "">("");
  const [fechaDesde, setFechaDesde] = useState<dayjs.Dayjs | null>(dayjs());
  const [fechaHasta, setFechaHasta] = useState<dayjs.Dayjs | null>(dayjs());
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 50,
  });

  const [pagoSeleccionado, setPagoSeleccionado] = useState<ReporteCajaPago | null>(null);
  const [ventaIdSeleccionada, setVentaIdSeleccionada] = useState<number | null>(null);

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const { sesiones } = useCajaSesionesPorTienda(tiendaId ? Number(tiendaId) : null, canAccess);
  const { clientes, loading: loadingClientes } = useClientesListado({
    pagina: 1,
    tamanoPagina: 200,
  });
  const { pagos, totalRegistros, loading, refetch } = useReporteCajaPagos(
    {
      tiendaId: tiendaId ? Number(tiendaId) : null,
      cajaSesionId: cajaSesionId ? Number(cajaSesionId) : null,
      clienteId,
      formaPago: formaPago ? Number(formaPago) : null,
      fechaDesde: fechaDesde?.format("YYYY-MM-DD") ?? null,
      fechaHasta: fechaHasta?.format("YYYY-MM-DD") ?? null,
      pagina: paginationModel.page + 1,
      tamanoPagina: paginationModel.pageSize,
    },
    canAccess,
  );
  const { venta, loading: loadingVenta } = useVentaById(ventaIdSeleccionada, canAccess);

  const resumen = useMemo(() => {
    return pagos.reduce(
      (acc, pago) => {
        if (pago.formaPago === 1) acc.efectivo += pago.importe;
        if (pago.formaPago === 2) acc.depositos += pago.importe;
        acc.total += pago.importe;
        return acc;
      },
      { efectivo: 0, depositos: 0, total: 0 },
    );
  }, [pagos]);

  const columns: GridColDef<ReporteCajaPago>[] = [
    {
      field: "pagoCodigo",
      headerName: "Código de pago",
      width: 150,
    },
    {
      field: "fechaPago",
      headerName: "Fecha",
      width: 160,
      valueGetter: (_value, row) => formatFecha(row.fechaPago),
    },
    {
      field: "clienteNombre",
      headerName: "Cliente",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "notasAfectadas",
      headerName: "Nota(s) afectada(s)",
      flex: 1,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<ReporteCajaPago, NotaAfectada[]>) => (
        <Tooltip title="Doble clic para ver detalle">
          <Typography variant="body2" noWrap>
            {notasTexto(params.value ?? [])}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "formaPago",
      headerName: "Forma de pago",
      width: 150,
      valueGetter: (_value, row) => formaPagoTexto[row.formaPago] ?? "-",
    },
    {
      field: "banco",
      headerName: "Banco",
      width: 120,
      valueGetter: (_value, row) => row.banco ?? "-",
    },
    {
      field: "numeroOperacion",
      headerName: "N° Operación",
      width: 130,
      valueGetter: (_value, row) => row.numeroOperacion ?? "-",
    },
    {
      field: "importe",
      headerName: "Importe",
      width: 120,
      align: "right",
      headerAlign: "right",
      valueGetter: (_value, row) => monedaFormatter.format(row.importe),
    },
    {
      field: "tiendaNombre",
      headerName: "Tienda",
      width: 140,
    },
    {
      field: "cajaSesionId",
      headerName: "Caja",
      width: 100,
      valueGetter: (_value, row) => `Caja #${row.cajaSesionId}`,
    },
    {
      field: "usuarioNombre",
      headerName: "Usuario",
      width: 150,
    },
  ];

  const handleTiendaChange = (value: number | "") => {
    setTiendaId(value);
    setCajaSesionId("");
  };

  const handleBuscar = () => {
    refetch();
  };

  const handleRowDoubleClick = (pago: ReporteCajaPago) => {
    setPagoSeleccionado(pago);
  };

  const handleVerVenta = (ventaId: number) => {
    setVentaIdSeleccionada(ventaId);
  };

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ p: 3, maxWidth: 1600, mx: "auto" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Reporte de ingresos de caja
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 4, lg: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="tienda-label">Tienda</InputLabel>
                <Select
                  labelId="tienda-label"
                  label="Tienda"
                  value={tiendaId}
                  onChange={(e) => handleTiendaChange(e.target.value as number | "")}
                  disabled={loadingTiendas}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {tiendas.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="caja-label">Caja</InputLabel>
                <Select
                  labelId="caja-label"
                  label="Caja"
                  value={cajaSesionId}
                  onChange={(e) => setCajaSesionId(e.target.value as number | "")}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {sesiones.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      Caja #{s.id} - {s.empleadoAperturaNombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <Autocomplete
                size="small"
                options={clientes}
                loading={loadingClientes}
                getOptionLabel={(option) => `${option.nombre ?? ""} ${option.apellido ?? ""}`.trim() || `#${option.id}`}
                value={clientes.find((c) => c.id === clienteId) ?? null}
                onChange={(_e, value) => setClienteId(value?.id ?? null)}
                renderInput={(params) => <TextField {...params} label="Cliente" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="forma-pago-label">Forma de pago</InputLabel>
                <Select
                  labelId="forma-pago-label"
                  label="Forma de pago"
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value as number | "")}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value={1}>Efectivo</MenuItem>
                  <MenuItem value={2}>Depósito bancario</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 2 }}>
              <DatePicker
                label="Fecha desde"
                value={fechaDesde}
                onChange={setFechaDesde}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 2 }}>
              <DatePicker
                label="Fecha hasta"
                value={fechaHasta}
                onChange={setFechaHasta}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 2 }} sx={{ display: "flex", alignItems: "center" }}>
              <Button variant="contained" onClick={handleBuscar} fullWidth>
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Total efectivo
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {monedaFormatter.format(resumen.efectivo)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Total depósitos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {monedaFormatter.format(resumen.depositos)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Total ingresos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {monedaFormatter.format(resumen.total)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ height: 520 }} variant="outlined">
          <DataGrid
            rows={pagos}
            columns={columns}
            loading={loading}
            slots={{ loadingOverlay: LoadingOverlay }}
            onRowDoubleClick={(params) => handleRowDoubleClick(params.row as ReporteCajaPago)}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={pageSizeOptions}
            paginationMode="server"
            rowCount={totalRegistros}
            getRowId={(row) => row.pagoId}
            disableRowSelectionOnClick
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </Paper>

        <NotasAfectadasModal
          open={!!pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
          pago={pagoSeleccionado}
          onVerVenta={handleVerVenta}
        />

        <VentaDetalleModal
          open={!!ventaIdSeleccionada}
          onClose={() => setVentaIdSeleccionada(null)}
          venta={venta}
          loading={loadingVenta}
        />
      </Box>
    </LocalizationProvider>
  );
}
