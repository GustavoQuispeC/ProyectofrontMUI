"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { esES } from "@mui/x-data-grid/locales";

import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { useClientesListado } from "@/features/dashboard/cliente/hooks/useClientesListado";
import { useReporteCajaPagos } from "@/features/dashboard/reportecaja/hooks/useReporteCaja";
import { useVentaById } from "@/features/dashboard/venta/hooks/useVenta";
import { ReporteCajaPago } from "@/features/dashboard/reportecaja/reportecaja.type";
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

const estadoVentaTexto: Record<number, string> = {
  1: "Confirmada",
  2: "Anulada",
};

const tipoPagoTexto: Record<number, string> = {
  1: "Contado",
  2: "Crédito",
};

const modalidadEntregaTexto: Record<number, string> = {
  1: "Recojo en tienda",
  2: "Envío a domicilio",
  3: "Entrega inmediata",
};

function catalogoTexto(valor: string | number | null | undefined, opciones: Record<number, string>) {
  if (valor === null || valor === undefined || valor === "") return "-";
  return opciones[Number(valor)] ?? String(valor).replaceAll("_", " ");
}

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

function formatCliente(cliente: { id: number; nombre?: string; apellido?: string; razonSocial?: string | null }) {
  return (
    cliente.razonSocial?.trim() ||
    `${cliente.nombre ?? ""} ${cliente.apellido ?? ""}`.trim() ||
    `Cliente #${cliente.id}`
  );
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
              {pago.notasAfectadas.map((nota, index) => (
                <TableRow
                  key={`${pago.pagoMedioId}-${nota.ventaId}-${index}`}
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
                <Chip
                  size="small"
                  color={Number(venta.estado) === 1 ? "success" : "warning"}
                  label={catalogoTexto(venta.estado, estadoVentaTexto)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Tipo de pago
                </Typography>
                <Chip
                  size="small"
                  color={Number(venta.tipoPago) === 2 ? "warning" : "primary"}
                  label={catalogoTexto(venta.tipoPago, tipoPagoTexto)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Modalidad de entrega
                </Typography>
                <Chip
                  size="small"
                  variant="outlined"
                  color="info"
                  label={catalogoTexto(venta.modalidadEntrega ?? venta.modalidad, modalidadEntregaTexto)}
                />
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
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [clienteBusqueda, setClienteBusqueda] = useState("");
  const [clienteBusquedaDebounced, setClienteBusquedaDebounced] = useState("");
  const [formaPago, setFormaPago] = useState<number | "">("");
  const [fechaDesde, setFechaDesde] = useState<dayjs.Dayjs | null>(dayjs());
  const [fechaHasta, setFechaHasta] = useState<dayjs.Dayjs | null>(dayjs());
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const [pagoSeleccionado, setPagoSeleccionado] = useState<ReporteCajaPago | null>(null);
  const [ventaIdSeleccionada, setVentaIdSeleccionada] = useState<number | null>(null);

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  useEffect(() => {
    const timer = setTimeout(() => setClienteBusquedaDebounced(clienteBusqueda.trim()), 400);
    return () => clearTimeout(timer);
  }, [clienteBusqueda]);

  const { clientes, loading: loadingClientes } = useClientesListado({
    busqueda: clienteBusquedaDebounced || undefined,
    pagina: 1,
    tamanoPagina: 200,
  });
  const { pagos, totalRegistros, loading, refetch } = useReporteCajaPagos(
    {
      tiendaId: tiendaId ? Number(tiendaId) : null,
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
      field: "tiendaNombre",
      headerName: "Tienda",
      width: 160,
    },

    {
      field: "formaPago",
      headerName: "Forma de pago",
      width: 150,
      valueGetter: (_value, row) => formaPagoTexto[row.formaPago] ?? "-",
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
      field: "banco",
      headerName: "Banco",
      width: 120,
      valueGetter: (_value, row) => row.banco ?? "-",
    },
    {
      field: "numeroOperacion",
      headerName: "N° Operación",
      width: 120,
      valueGetter: (_value, row) => row.numeroOperacion ?? "-",
    },
    {
      field: "usuarioNombre",
      headerName: "Amortizado por:",
      width: 240,
    },
  ];

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
      <Box sx={{ width: "100%" }}>
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
                  onChange={(e) => {
                    setTiendaId(e.target.value as number | "");
                    setPaginationModel((prev) => ({ ...prev, page: 0 }));
                  }}
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

            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <Autocomplete
                size="small"
                options={clientes}
                loading={loadingClientes}
                filterOptions={(options) => options}
                getOptionLabel={formatCliente}
                getOptionKey={(option) => option.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={clientes.find((cliente) => cliente.id === clienteId) ?? null}
                inputValue={clienteBusqueda}
                onInputChange={(_event, value, reason) => {
                  if (reason !== "reset") setClienteBusqueda(value);
                }}
                onChange={(_event, value) => {
                  setClienteId(value?.id ?? null);
                  setClienteBusqueda(value ? formatCliente(value) : "");
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                renderInput={(params) => <TextField {...params} label="Buscar cliente" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="forma-pago-label">Forma de pago</InputLabel>
                <Select
                  labelId="forma-pago-label"
                  label="Forma de pago"
                  value={formaPago}
                  onChange={(e) => {
                    setFormaPago(e.target.value as number | "");
                    setPaginationModel((prev) => ({ ...prev, page: 0 }));
                  }}
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
                onChange={(value) => {
                  setFechaDesde(value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 2 }}>
              <DatePicker
                label="Fecha hasta"
                value={fechaHasta}
                onChange={(value) => {
                  setFechaHasta(value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
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
            <Card sx={{ bgcolor: "success.main", color: "success.contrastText" }}>
              <CardContent>
                <Typography sx={{ opacity: 0.85 }} variant="body2">
                  Total efectivo
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {monedaFormatter.format(resumen.efectivo)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: "info.main", color: "info.contrastText" }}>
              <CardContent>
                <Typography sx={{ opacity: 0.85 }} variant="body2">
                  Total depósitos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {monedaFormatter.format(resumen.depositos)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ bgcolor: "warning.main", color: "warning.contrastText" }}>
              <CardContent>
                <Typography sx={{ opacity: 0.85 }} variant="body2">
                  Total ingresos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {monedaFormatter.format(resumen.total)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ height: "auto", width: "100%", p: 2, borderRadius: 0 }}>
          <DataGrid
            rows={pagos}
            columns={columns}
            rowHeight={38}
            columnHeaderHeight={42}
            loading={loading}
            slots={{ loadingOverlay: LoadingOverlay }}
            onRowDoubleClick={(params) => handleRowDoubleClick(params.row as ReporteCajaPago)}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={pageSizeOptions}
            paginationMode="server"
            rowCount={totalRegistros}
            getRowId={(row) => row.pagoMedioId}
            disableRowSelectionOnClick
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              border: 0,
              mx: 1,
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#e4eaeb",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
                color: "#006064",
                textTransform: "uppercase",
              },
            }}
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
