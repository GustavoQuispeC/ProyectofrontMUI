"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
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
  FormControl,
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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloseIcon from "@mui/icons-material/Close";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import {
  useAmortizarCliente,
  useAmortizarVenta,
  useDeudaCliente,
  useVentasCredito,
} from "@/features/dashboard/amortizacion/hooks/useAmortizaciones";
import { VentaCredito } from "@/features/dashboard/amortizacion/amortizacion.type";
import { useClientesListado } from "@/features/dashboard/cliente/hooks/useClientesListado";
import { ListarCliente } from "@/features/dashboard/cliente/cliente.type";
import { useEstadosPago, useMediosPago } from "@/features/dashboard/venta/hooks/useVenta";
import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { CatalogoItem } from "@/features/dashboard/catalogo/catalogo.type";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { toastPromise } from "@/shared/utils/toast";

const monedaFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const mediosPagoFallback: CatalogoItem[] = [
  { id: 1, nombre: "Efectivo" },
  { id: 2, nombre: "Depósito" },
];

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

function catalogoNombre(items: CatalogoItem[], id: number) {
  return items.find((item) => item.id === id)?.nombre ?? `#${id}`;
}

function pendienteVenta(venta: VentaCredito | null) {
  if (!venta) return 0;
  return Math.max(0, Number(venta.total) - Number(venta.montoPagado));
}

function esDeposito(medio: CatalogoItem | undefined) {
  if (!medio) return false;
  if (medio.id === 2) return true;

  return medio.nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .includes("deposito");
}

function clienteNombre(cliente: ListarCliente) {
  return cliente.nombreCompleto || cliente.razonSocial || `${cliente.nombre} ${cliente.apellido}`.trim();
}

function getColumns(estadosPago: CatalogoItem[], onVer: (row: VentaCredito) => void): GridColDef<VentaCredito>[] {
  return [
    {
      field: "tiendaNombre",
      headerName: "Tienda",
      minWidth: 170,
      flex: 0.9,
    },
    {
      field: "codigo",
      headerName: "Nota de venta",
      minWidth: 150,
      display: "flex",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {params.row.codigo}
        </Typography>
      ),
    },
    {
      field: "clienteNombre",
      headerName: "Cliente",
      minWidth: 220,
      flex: 1.2,
      valueGetter: (_value, row) => row.clienteNombre || "—",
    },
    {
      field: "total",
      headerName: "Importe",
      width: 125,
      align: "right",
      headerAlign: "center",
      valueGetter: (_value, row) => monedaFormatter.format(Number(row.total)),
    },
    {
      field: "pendiente",
      headerName: "Saldo",
      width: 125,
      align: "right",
      headerAlign: "center",
      sortable: false,
      display: "flex",
      renderCell: (params) => (
        <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
          {monedaFormatter.format(pendienteVenta(params.row))}
        </Typography>
      ),
    },
    {
      field: "estadoPago",
      headerName: "Estado pago",
      width: 125,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const nombre = catalogoNombre(estadosPago, params.row.estadoPago);
        return <Chip size="small" color={params.row.estadoPago === 2 ? "warning" : "error"} label={nombre} />;
      },
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      width: 150,
      valueGetter: (_value, row) => (row.createdAt ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 90,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<VentaCredito>) => (
        <Tooltip title="Ver detalle">
          <VisibilityIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={(event) => {
              event.stopPropagation();
              onVer(params.row);
            }}
          />
        </Tooltip>
      ),
    },
  ];
}

export default function ListarAmortizaciones() {
  const mounted = useMounted();
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarAmortizaciones) : false;
  const canAmortizar = user ? hasPermission(user.rol, permissions.registrarAmortizacion) : false;

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const { items: estadosPago } = useEstadosPago();
  const { items: mediosPagoApi } = useMediosPago();
  const mediosPagoCatalogo = mediosPagoApi.filter((medio) => medio.id === 1 || medio.id === 2);
  const mediosPago = mediosPagoCatalogo.length > 0 ? mediosPagoCatalogo : mediosPagoFallback;

  const [tiendaId, setTiendaId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [clienteBusqueda, setClienteBusqueda] = useState("");
  const [clienteBusquedaDebounced, setClienteBusquedaDebounced] = useState("");
  const [estadoPago, setEstadoPago] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 15 });
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });
  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaCredito | null>(null);
  const [ventaDetalle, setVentaDetalle] = useState<VentaCredito | null>(null);
  const [tipoAmortizacion, setTipoAmortizacion] = useState<"venta" | "cliente" | null>(null);
  const [tipoMedio, setTipoMedio] = useState("1");
  const [monto, setMonto] = useState("");
  const [banco, setBanco] = useState("");
  const [numeroOperacion, setNumeroOperacion] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [errorAmortizacion, setErrorAmortizacion] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setClienteBusquedaDebounced(clienteBusqueda), 400);
    return () => clearTimeout(timer);
  }, [clienteBusqueda]);

  const { clientes, loading: loadingClientes } = useClientesListado({
    pagina: 1,
    tamanoPagina: 50,
    busqueda: clienteBusquedaDebounced || undefined,
    isActive: true,
  });

  const params = useMemo(
    () => ({
      pagina: paginationModel.page + 1,
      tamanoPagina: paginationModel.pageSize,
      tiendaId: tiendaId ? Number(tiendaId) : undefined,
      clienteId: clienteId ? Number(clienteId) : undefined,
      estadoPago: estadoPago ? Number(estadoPago) : undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [paginationModel.page, paginationModel.pageSize, tiendaId, clienteId, estadoPago, fechaDesde, fechaHasta],
  );

  const { ventas, totalRegistros, loading, error } = useVentasCredito(params, canAccess);
  const amortizarVentaMutation = useAmortizarVenta();
  const amortizarClienteMutation = useAmortizarCliente();
  const {
    totalDeuda: deudaTotalCliente,
    loading: loadingDeudaCliente,
    error: errorDeudaCliente,
  } = useDeudaCliente(
    ventaSeleccionada?.clienteId ?? null,
    canAccess && tipoAmortizacion === "cliente" && Boolean(ventaSeleccionada?.clienteId),
  );
  const amortizando = amortizarVentaMutation.loading || amortizarClienteMutation.loading;
  const estadosPagoCredito = estadosPago.filter((item) => item.id === 1 || item.id === 2);
  const medioSeleccionado = mediosPago.find((medio) => medio.id === Number(tipoMedio));
  const requiereBanco = esDeposito(medioSeleccionado);
  const puedeAmortizarCliente = Boolean(ventaSeleccionada?.clienteId && ventaSeleccionada?.tiendaId);

  const resetPagina = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleVer = useCallback((row: VentaCredito) => {
    setVentaDetalle(row);
  }, []);

  const handleSeleccion = (model: GridRowSelectionModel) => {
    setRowSelectionModel(model);
    const id = Array.from(model.ids)[0];
    setVentaSeleccionada(ventas.find((venta) => venta.id === Number(id)) ?? null);
  };

  const limpiarSeleccion = () => {
    setVentaSeleccionada(null);
    setRowSelectionModel({ type: "include", ids: new Set() });
  };

  const abrirAmortizacion = (tipo: "venta" | "cliente") => {
    if (!ventaSeleccionada) return;

    setTipoAmortizacion(tipo);
    setTipoMedio("1");
    setMonto(tipo === "venta" ? pendienteVenta(ventaSeleccionada).toFixed(2) : "");
    setBanco("");
    setNumeroOperacion("");
    setFechaPago("");
    setErrorAmortizacion(null);
  };

  const cerrarAmortizacion = () => {
    if (amortizando) return;
    setTipoAmortizacion(null);
    setErrorAmortizacion(null);
  };

  const guardarAmortizacion = async () => {
    if (!ventaSeleccionada || !tipoAmortizacion) return;

    const montoNumero = Number(monto);
    if (!Number.isFinite(montoNumero) || montoNumero <= 0) {
      setErrorAmortizacion("Ingrese un monto mayor que cero.");
      return;
    }

    if (tipoAmortizacion === "venta" && montoNumero > pendienteVenta(ventaSeleccionada) + 0.005) {
      setErrorAmortizacion("El monto no puede ser mayor que la deuda pendiente.");
      return;
    }

    if (requiereBanco && !banco.trim()) {
      setErrorAmortizacion("El banco es obligatorio cuando el medio de pago es depósito.");
      return;
    }

    const pago = {
      tipoMedio: Number(tipoMedio),
      monto: Number(montoNumero.toFixed(2)),
      banco: banco.trim() || null,
      numeroOperacion: numeroOperacion.trim() || null,
      ...(tipoAmortizacion === "cliente" && requiereBanco && fechaPago ? { fechaPago } : {}),
    };

    try {
      if (tipoAmortizacion === "venta") {
        await toastPromise(
          amortizarVentaMutation.amortizar({ ventaId: ventaSeleccionada.id, data: { pagos: [pago] } }),
          {
            loading: "Registrando amortización de la nota de venta...",
            success: "Amortización registrada correctamente",
            error: (error) => error.message || "No se pudo registrar la amortización",
          },
        );
      } else {
        if (!ventaSeleccionada.clienteId || !ventaSeleccionada.tiendaId) {
          setErrorAmortizacion("La venta seleccionada no contiene clienteId y tiendaId para amortizar por cliente.");
          return;
        }

        await toastPromise(
          amortizarClienteMutation.amortizar({
            clienteId: ventaSeleccionada.clienteId,
            data: { tiendaId: ventaSeleccionada.tiendaId, pagos: [pago] },
          }),
          {
            loading: "Registrando amortización del cliente...",
            success: "Amortización del cliente registrada correctamente",
            error: (error) => error.message || "No se pudo registrar la amortización",
          },
        );
      }

      setTipoAmortizacion(null);
      limpiarSeleccion();
    } catch {
      return;
    }
  };

  const columns = useMemo(() => getColumns(estadosPago, handleVer), [estadosPago, handleVer]);

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ width: "100%" }}>
        <Paper
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: "16px", overflow: "hidden", mb: 2 }}
        >
          <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <AccountBalanceWalletIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  AMORTIZACIONES
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ventas a crédito con deuda o pagos parciales
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap", alignItems: { xs: "stretch", sm: "flex-start" } }}>
              <FormControl size="small" sx={{ minWidth: 170 }} disabled={loadingTiendas}>
                <InputLabel id="tienda-amortizacion-label">Tienda</InputLabel>
                <Select
                  labelId="tienda-amortizacion-label"
                  label="Tienda"
                  value={tiendaId}
                  onChange={(event) => {
                    setTiendaId(event.target.value);
                    resetPagina();
                  }}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {tiendas.map((tienda) => (
                    <MenuItem key={tienda.id} value={String(tienda.id)}>
                      {tienda.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                size="small"
                options={clientes}
                loading={loadingClientes}
                value={clientes.find((cliente) => cliente.id === Number(clienteId)) ?? null}
                inputValue={clienteBusqueda}
                getOptionLabel={clienteNombre}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onInputChange={(_event, value) => setClienteBusqueda(value)}
                onChange={(_event, value) => {
                  setClienteId(value ? String(value.id) : "");
                  resetPagina();
                }}
                sx={{ minWidth: 260, flex: 1 }}
                renderInput={(params) => <TextField {...params} label="Cliente" />}
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="estado-pago-amortizacion-label">Estado pago</InputLabel>
                <Select
                  labelId="estado-pago-amortizacion-label"
                  label="Estado pago"
                  value={estadoPago}
                  onChange={(event) => {
                    setEstadoPago(event.target.value);
                    resetPagina();
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {estadosPagoCredito.map((estado) => (
                    <MenuItem key={estado.id} value={String(estado.id)}>
                      {estado.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label="Fecha desde"
                value={fechaDesde ? dayjs(fechaDesde) : null}
                onChange={(value) => {
                  setFechaDesde(value?.format("YYYY-MM-DD") ?? "");
                  resetPagina();
                }}
                slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
              />
              <DatePicker
                label="Fecha hasta"
                value={fechaHasta ? dayjs(fechaHasta) : null}
                onChange={(value) => {
                  setFechaHasta(value?.format("YYYY-MM-DD") ?? "");
                  resetPagina();
                }}
                slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
              />
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Paper sx={{ height: 720, width: "100%", p: 2 }} variant="outlined">
              <DataGrid
                rows={ventas}
                columns={columns}
                loading={loading}
                slots={{ loadingOverlay: LoadingOverlay }}
                onRowClick={(params) => setVentaSeleccionada(params.row)}
                onRowDoubleClick={(params) => handleVer(params.row)}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[15]}
                paginationMode="server"
                rowCount={totalRegistros}
                getRowId={(row) => row.id}
                rowHeight={40}
                columnHeaderHeight={44}
                checkboxSelection
                disableMultipleRowSelection
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={handleSeleccion}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                sx={{
                  border: 0,
                  mx: 1,
                  "& .MuiDataGrid-columnHeader": { backgroundColor: "#e4eaeb" },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 700,
                    color: "#006064",
                    textTransform: "uppercase",
                  },
                }}
              />
            </Paper>

            <Stack direction="row" sx={{ justifyContent: "flex-end", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
              <Tooltip title={ventaSeleccionada ? "Amortizar la nota seleccionada" : "Seleccione una nota de venta"}>
                <span>
                  <Button
                    variant="contained"
                    startIcon={<ReceiptLongIcon />}
                    disabled={!ventaSeleccionada || !canAmortizar}
                    onClick={() => abrirAmortizacion("venta")}
                  >
                    Amortizar por nota de venta
                  </Button>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  !ventaSeleccionada
                    ? "Seleccione una nota de venta"
                    : puedeAmortizarCliente
                      ? "Amortizar la deuda total del cliente"
                      : "La API no devolvió clienteId y tiendaId para esta venta"
                }
              >
                <span>
                  <Button
                    variant="outlined"
                    startIcon={<PersonIcon />}
                    disabled={!ventaSeleccionada || !canAmortizar || !puedeAmortizarCliente}
                    onClick={() => abrirAmortizacion("cliente")}
                  >
                    Amortizar por cliente
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Box>
        </Paper>

        <Dialog open={Boolean(ventaDetalle)} onClose={() => setVentaDetalle(null)} maxWidth="md" fullWidth>
          <DialogTitle>Detalle de la nota de venta {ventaDetalle?.codigo}</DialogTitle>
          <DialogContent dividers>
            {ventaDetalle && (
              <Stack sx={{ gap: 2 }}>
                <Stack direction="row" sx={{ gap: 3, flexWrap: "wrap" }}>
                  <Typography variant="body2">
                    <strong>Cliente:</strong> {ventaDetalle.clienteNombre}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tienda:</strong> {ventaDetalle.tiendaNombre}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Estado pago:</strong> {catalogoNombre(estadosPago, ventaDetalle.estadoPago)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fecha:</strong> {dayjs(ventaDetalle.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Stack>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">P. Unit.</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ventaDetalle.detalles.map((detalle, index) => (
                        <TableRow key={`${detalle.productoCodigo}-${index}`}>
                          <TableCell>
                            {detalle.productoCodigo} - {detalle.productoNombre}
                          </TableCell>
                          <TableCell align="right">{detalle.cantidad}</TableCell>
                          <TableCell align="right">{monedaFormatter.format(detalle.precioUnitario)}</TableCell>
                          <TableCell align="right">{monedaFormatter.format(detalle.total)}</TableCell>
                        </TableRow>
                      ))}
                      {ventaDetalle.detalles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            Sin productos
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider />
                <Stack direction="row" sx={{ gap: 3, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <Typography variant="body2">
                    <strong>Total:</strong> {monedaFormatter.format(ventaDetalle.total)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pagado:</strong> {monedaFormatter.format(ventaDetalle.montoPagado)}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    <strong>Deuda:</strong> {monedaFormatter.format(pendienteVenta(ventaDetalle))}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVentaDetalle(null)} variant="contained" startIcon={<CloseIcon />}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(tipoAmortizacion)} onClose={cerrarAmortizacion} maxWidth="sm" fullWidth>
          <DialogTitle>
            {tipoAmortizacion === "venta" ? "Amortizar por nota de venta" : "Amortizar por cliente"}
          </DialogTitle>
          <DialogContent dividers>
            <Stack sx={{ gap: 2, pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {tipoAmortizacion === "venta" ? (
                  <>
                    Nota: <strong>{ventaSeleccionada?.codigo}</strong> · Pendiente:{" "}
                    <strong>{monedaFormatter.format(pendienteVenta(ventaSeleccionada))}</strong>
                  </>
                ) : (
                  <>
                    Cliente: <strong>{ventaSeleccionada?.clienteNombre}</strong> · Deuda total en todas las tiendas:{" "}
                    <strong>{loadingDeudaCliente ? "Calculando..." : monedaFormatter.format(deudaTotalCliente)}</strong>
                  </>
                )}
              </Typography>
              {(errorAmortizacion ||
                errorDeudaCliente ||
                amortizarVentaMutation.error ||
                amortizarClienteMutation.error) && (
                <Alert severity="error">
                  {errorAmortizacion ||
                    errorDeudaCliente ||
                    amortizarVentaMutation.error ||
                    amortizarClienteMutation.error}
                </Alert>
              )}
              <TextField
                size="small"
                label="Monto ingresado"
                type="number"
                required
                value={monto}
                onChange={(event) => setMonto(event.target.value)}
                onFocus={(event) => event.target.select()}
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
              />
              <FormControl size="small" required>
                <InputLabel id="medio-pago-amortizacion-label">Medio de pago</InputLabel>
                <Select
                  labelId="medio-pago-amortizacion-label"
                  label="Medio de pago"
                  value={tipoMedio}
                  onChange={(event) => setTipoMedio(event.target.value)}
                >
                  {mediosPago.map((medio) => (
                    <MenuItem key={medio.id} value={String(medio.id)}>
                      {medio.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {tipoAmortizacion === "cliente" && requiereBanco && (
                <DatePicker
                  label="Fecha de pago (opcional)"
                  value={fechaPago ? dayjs(fechaPago) : null}
                  onChange={(value) => setFechaPago(value?.format("YYYY-MM-DD") ?? "")}
                  slotProps={{ textField: { size: "small" } }}
                />
              )}
              {requiereBanco && (
                <>
                  <TextField
                    size="small"
                    label="Banco"
                    required
                    value={banco}
                    onChange={(event) => setBanco(event.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Número de operación"
                    value={numeroOperacion}
                    onChange={(event) => setNumeroOperacion(event.target.value)}
                  />
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button size="small" onClick={cerrarAmortizacion} disabled={amortizando}>
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => void guardarAmortizacion()}
              disabled={amortizando || !monto}
              startIcon={amortizando ? <CircularProgress size={16} color="inherit" /> : <PaymentsIcon />}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
