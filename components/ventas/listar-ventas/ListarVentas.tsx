"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import {
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
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import SellIcon from "@mui/icons-material/Sell";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { esES } from "@mui/x-data-grid/locales";

import {
  useVentas,
  useEstadosVenta,
  useEstadosPago,
  useTiposPago,
  useTiposDocumento,
} from "@/features/dashboard/venta/hooks/useVenta";
import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { Venta } from "@/features/dashboard/venta/venta.type";
import { generarNotaVentaPdf, imprimirTicketVenta } from "@/features/dashboard/venta/helpers/ventaPdf";
import { CatalogoItem } from "@/features/dashboard/catalogo/catalogo.type";
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

function catalogoNombre(items: CatalogoItem[], id: number): string {
  return items.find((i) => i.id === id)?.nombre ?? `#${id}`;
}

function estadoChipSx(positivo: boolean) {
  return (theme: { palette: { mode: string } }) => ({
    fontWeight: 500,
    border: "1px solid",
    "& .MuiChip-icon": {
      color: positivo
        ? theme.palette.mode === "dark"
          ? "#86efac"
          : "#2e7d32"
        : theme.palette.mode === "dark"
          ? "#fbbf24"
          : "#b45309",
    },
    ...(positivo
      ? {
          color: theme.palette.mode === "dark" ? "#86efac" : "#347237",
          bgcolor: theme.palette.mode === "dark" ? "rgba(74, 222, 128, 0.15)" : "rgba(168, 226, 171, 0.2)",
          borderColor: theme.palette.mode === "dark" ? "rgba(74, 222, 128, 0.3)" : "rgba(134, 197, 140, 0.5)",
        }
      : {
          color: theme.palette.mode === "dark" ? "#fbbf24" : "#92400e",
          bgcolor: theme.palette.mode === "dark" ? "rgba(251, 191, 36, 0.15)" : "rgba(253, 230, 138, 0.4)",
          borderColor: theme.palette.mode === "dark" ? "rgba(251, 191, 36, 0.3)" : "rgba(217, 119, 6, 0.35)",
        }),
  });
}

interface ColumnsContext {
  tiposPago: CatalogoItem[];
  estadosVenta: CatalogoItem[];
  estadosPago: CatalogoItem[];
  tiposDocumento: CatalogoItem[];
}

function getColumns(
  ctx: ColumnsContext,
  onVer: (row: Venta) => void,
  onTicket: (row: Venta) => void,
  onPdf: (row: Venta) => void,
): GridColDef<Venta>[] {
  return [
    { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
    {
      field: "codigo",
      headerName: "Código",
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.row.codigo}
          </Typography>
        </Box>
      ),
    },
    {
      field: "clienteNombre",
      headerName: "Cliente",
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row) => row.clienteNombre || "—",
    },
    {
      field: "clienteTipoDocumento",
      headerName: "Tipo doc.",
      width: 110,
      align: "center",
      headerAlign: "center",
      valueGetter: (_value, row) =>
        row.clienteTipoDocumento ? catalogoNombre(ctx.tiposDocumento, row.clienteTipoDocumento) : "—",
    },
    {
      field: "clienteNumeroDocumento",
      headerName: "Documento",
      width: 130,
      align: "center",
      headerAlign: "center",
      valueGetter: (_value, row) => row.clienteNumeroDocumento || "—",
    },
    {
      field: "tiendaNombre",
      headerName: "Tienda",
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            bgcolor: "rgba(135, 196, 198, 0.08)",
            px: 1,
          }}
        >
          <Typography variant="body2">{params.row.tiendaNombre}</Typography>
        </Box>
      ),
    },
    {
      field: "tipoPago",
      headerName: "Tipo pago",
      width: 110,
      align: "center",
      headerAlign: "center",
      valueGetter: (_value, row) => catalogoNombre(ctx.tiposPago, row.tipoPago),
    },
    {
      field: "estadoPago",
      headerName: "Pago",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const nombre = catalogoNombre(ctx.estadosPago, params.row.estadoPago);
        const pagado = nombre.toLowerCase().includes("pagado") && !nombre.toLowerCase().includes("sin");
        return (
          <Chip
            size="small"
            icon={pagado ? <CheckCircleIcon /> : <HourglassTopIcon />}
            label={nombre}
            variant="filled"
            sx={estadoChipSx(pagado)}
          />
        );
      },
    },
    {
      field: "total",
      headerName: "Total",
      width: 110,
      align: "right",
      headerAlign: "center",
      valueGetter: (_value, row) => monedaFormatter.format(row.total),
    },
    {
      field: "montoPagado",
      headerName: "Pagado",
      width: 110,
      align: "right",
      headerAlign: "center",
      valueGetter: (_value, row) => monedaFormatter.format(row.montoPagado),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const nombre = catalogoNombre(ctx.estadosVenta, params.row.estado);
        const confirmada = !nombre.toLowerCase().includes("anul");
        return (
          <Chip
            size="small"
            icon={confirmada ? <CheckCircleIcon /> : <CancelIcon />}
            label={nombre}
            variant="filled"
            sx={estadoChipSx(confirmada)}
          />
        );
      },
    },
    {
      field: "fechaConfirmacion",
      headerName: "Fecha",
      minWidth: 160,
      valueGetter: (_value, row) =>
        row.fechaConfirmacion ? dayjs(row.fechaConfirmacion).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      field: "empleadoAtiendeNombre",
      headerName: "Atendido por",
      minWidth: 180,
      valueGetter: (_value, row) => row.empleadoAtiendeNombre || "—",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 140,
      minWidth: 140,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Venta>) => (
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center", gap: 1, height: "100%" }}>
          <Tooltip title="Ver detalle">
            <VisibilityIcon
              fontSize="small"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => onVer(params.row)}
            />
          </Tooltip>
          <Tooltip title="Imprimir ticket">
            <LocalPrintshopOutlinedIcon
              fontSize="small"
              color="action"
              sx={{ cursor: "pointer" }}
              onClick={() => onTicket(params.row)}
            />
          </Tooltip>
          <Tooltip title="Descargar nota de venta (PDF)">
            <PictureAsPdfOutlinedIcon
              fontSize="small"
              color="error"
              sx={{ cursor: "pointer" }}
              onClick={() => onPdf(params.row)}
            />
          </Tooltip>
        </Stack>
      ),
    },
  ];
}

export default function ListarVentas() {
  const mounted = useMounted();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarVentas) : false;
  const canCreate = user ? hasPermission(user.rol, permissions.registrarVenta) : false;

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const { items: estadosVenta } = useEstadosVenta();
  const { items: estadosPago } = useEstadosPago();
  const { items: tiposPago } = useTiposPago();
  const { items: tiposDocumento } = useTiposDocumento();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tiendaId, setTiendaId] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [estadoPago, setEstadoPago] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Venta | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params = useMemo(
    () => ({
      pagina: paginationModel.page + 1,
      tamanoPagina: paginationModel.pageSize,
      tiendaId: tiendaId ? Number(tiendaId) : undefined,
      estado: estado ? Number(estado) : undefined,
      estadoPago: estadoPago ? Number(estadoPago) : undefined,
      codigo: debouncedSearch || undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [
      paginationModel.page,
      paginationModel.pageSize,
      tiendaId,
      estado,
      estadoPago,
      debouncedSearch,
      fechaDesde,
      fechaHasta,
    ],
  );

  const { ventas, totalRegistros, loading } = useVentas(params);

  const handleVer = useCallback((row: Venta) => {
    setSelectedRow(row);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const extrasVenta = useCallback(
    (row: Venta) => {
      const tienda = tiendas.find((t) => t.id === row.tiendaId);
      return {
        tipoPagoNombre: catalogoNombre(tiposPago, row.tipoPago),
        estadoVentaNombre: catalogoNombre(estadosVenta, row.estado),
        estadoPagoNombre: catalogoNombre(estadosPago, row.estadoPago),
        clienteTipoDocumentoNombre: row.clienteTipoDocumento
          ? catalogoNombre(tiposDocumento, row.clienteTipoDocumento)
          : undefined,
        tiendaDireccion: tienda?.direccion,
        tiendaTelefono: tienda?.telefono,
      };
    },
    [tiposPago, estadosVenta, estadosPago, tiposDocumento, tiendas],
  );

  const handleTicket = useCallback(
    (row: Venta) => {
      void imprimirTicketVenta(row, extrasVenta(row));
    },
    [extrasVenta],
  );

  const handlePdf = useCallback(
    (row: Venta) => {
      void generarNotaVentaPdf(row, extrasVenta(row));
    },
    [extrasVenta],
  );

  const columns = useMemo(
    () => getColumns({ tiposPago, estadosVenta, estadosPago, tiposDocumento }, handleVer, handleTicket, handlePdf),
    [tiposPago, estadosVenta, estadosPago, tiposDocumento, handleVer, handleTicket, handlePdf],
  );

  if (!canAccess) return <AccessDenied />;
  if (!mounted) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ width: "100%" }}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "16px",
            overflow: "hidden",
            mb: 2,
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 2.5 },
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <SellIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                    LISTA DE VENTAS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ventas registradas del día por defecto; use los filtros para ampliar el rango
                  </Typography>
                </Box>
              </Stack>

              {canCreate && (
                <Button
                  component={Link}
                  href="/dashboard/ventas/registrar"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ height: 40 }}
                >
                  Agregar
                </Button>
              )}
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack
              direction="row"
              sx={{
                gap: 2,
                flexWrap: "wrap",
                alignItems: { xs: "stretch", sm: "flex-start" },
              }}
            >
              <TextField
                placeholder="Buscar por código"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  },
                }}
                sx={{ minWidth: 220, flex: 1 }}
              />

              <FormControl size="small" sx={{ minWidth: 160 }} disabled={loadingTiendas}>
                <InputLabel id="tienda-filter-label">Tienda</InputLabel>
                <Select
                  labelId="tienda-filter-label"
                  label="Tienda"
                  value={tiendaId}
                  onChange={(e) => {
                    setTiendaId(e.target.value);
                    setPaginationModel((prev) => ({ ...prev, page: 0 }));
                  }}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {tiendas.map((t) => (
                    <MenuItem key={t.id} value={String(t.id)}>
                      {t.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="estado-filter-label">Estado</InputLabel>
                <Select
                  labelId="estado-filter-label"
                  label="Estado"
                  value={estado}
                  onChange={(e) => {
                    setEstado(e.target.value);
                    setPaginationModel((prev) => ({ ...prev, page: 0 }));
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {estadosVenta.map((e) => (
                    <MenuItem key={e.id} value={String(e.id)}>
                      {e.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="estado-pago-filter-label">Estado pago</InputLabel>
                <Select
                  labelId="estado-pago-filter-label"
                  label="Estado pago"
                  value={estadoPago}
                  onChange={(e) => {
                    setEstadoPago(e.target.value);
                    setPaginationModel((prev) => ({ ...prev, page: 0 }));
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {estadosPago.map((e) => (
                    <MenuItem key={e.id} value={String(e.id)}>
                      {e.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label="Fecha desde"
                value={fechaDesde ? dayjs(fechaDesde) : null}
                onChange={(val) => {
                  setFechaDesde(val?.format("YYYY-MM-DD") ?? "");
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
              />

              <DatePicker
                label="Fecha hasta"
                value={fechaHasta ? dayjs(fechaHasta) : null}
                onChange={(val) => {
                  setFechaHasta(val?.format("YYYY-MM-DD") ?? "");
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
              />
            </Stack>
          </Box>

          <Paper sx={{ height: "auto", width: "100%", p: 2, borderRadius: 0 }}>
            <DataGrid
              rows={ventas}
              columns={columns}
              loading={loading}
              slots={{ loadingOverlay: LoadingOverlay }}
              onRowDoubleClick={(params) => handleVer(params.row as Venta)}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={pageSizeOptions}
              paginationMode="server"
              rowCount={totalRegistros}
              getRowId={(row) => row.id}
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
        </Paper>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Detalle de la venta {selectedRow?.codigo}</DialogTitle>
          <DialogContent dividers>
            {selectedRow && (
              <Stack sx={{ gap: 2 }}>
                <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
                  <Typography variant="body2">
                    <strong>Cliente:</strong> {selectedRow.clienteNombre}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Documento:</strong>{" "}
                    {selectedRow.clienteTipoDocumento
                      ? `${catalogoNombre(tiposDocumento, selectedRow.clienteTipoDocumento)} ${selectedRow.clienteNumeroDocumento ?? ""}`
                      : "—"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tienda:</strong> {selectedRow.tiendaNombre}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tipo pago:</strong> {catalogoNombre(tiposPago, selectedRow.tipoPago)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Estado:</strong> {catalogoNombre(estadosVenta, selectedRow.estado)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Estado pago:</strong> {catalogoNombre(estadosPago, selectedRow.estadoPago)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Atendido por:</strong> {selectedRow.empleadoAtiendeNombre || "—"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fecha:</strong>{" "}
                    {selectedRow.fechaConfirmacion
                      ? dayjs(selectedRow.fechaConfirmacion).format("DD/MM/YYYY HH:mm")
                      : "—"}
                  </Typography>
                </Stack>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">P. Unit.</TableCell>
                        <TableCell align="right">Desc.</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right">Impuesto</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRow.detalles.map((detalle) => (
                        <TableRow key={detalle.id}>
                          <TableCell>
                            {detalle.productoCodigo} - {detalle.productoNombre}
                          </TableCell>
                          <TableCell align="right">{detalle.cantidad}</TableCell>
                          <TableCell align="right">{monedaFormatter.format(detalle.precioUnitario)}</TableCell>
                          <TableCell align="right">{monedaFormatter.format(detalle.descuentoUnitario)}</TableCell>
                          <TableCell align="right">{monedaFormatter.format(detalle.subtotal)}</TableCell>
                          <TableCell align="right">{monedaFormatter.format(detalle.impuesto)}</TableCell>
                          <TableCell align="right">{monedaFormatter.format(detalle.total)}</TableCell>
                        </TableRow>
                      ))}
                      {selectedRow.detalles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            Sin productos
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider />
                <Stack direction="row" sx={{ gap: 3, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Typography variant="body2">
                    <strong>Descuento:</strong> {monedaFormatter.format(selectedRow.descuento)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total:</strong> {monedaFormatter.format(selectedRow.total)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pagado:</strong> {monedaFormatter.format(selectedRow.montoPagado)}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            {selectedRow && (
              <>
                <Button
                  onClick={() => handleTicket(selectedRow)}
                  variant="outlined"
                  startIcon={<LocalPrintshopOutlinedIcon />}
                >
                  Imprimir ticket
                </Button>
                <Button
                  onClick={() => handlePdf(selectedRow)}
                  variant="outlined"
                  color="error"
                  startIcon={<PictureAsPdfOutlinedIcon />}
                >
                  Descargar PDF
                </Button>
              </>
            )}
            <Button onClick={handleCloseDialog} variant="contained" startIcon={<CloseIcon />}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
