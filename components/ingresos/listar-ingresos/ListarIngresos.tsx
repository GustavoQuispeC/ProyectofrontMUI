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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";
import { esES } from "@mui/x-data-grid/locales";

import { useIngresos } from "@/features/dashboard/Ingreso/hooks/useIngreso";
import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { ListarIngreso } from "@/features/dashboard/Ingreso/ingreso.type";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const pageSizeOptions = [20, 50, 100];

const tiposDocumento = [
  { id: 1, nombre: "Factura" },
  { id: 2, nombre: "Boleta" },
  { id: 3, nombre: "Nota de crédito" },
  { id: 4, nombre: "Guía de remisión" },
];

function nombreTipoDocumento(id: number) {
  return tiposDocumento.find((t) => t.id === id)?.nombre || `Tipo ${id}`;
}

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

function getColumns(onVer: (row: ListarIngreso) => void): GridColDef<ListarIngreso>[] {
  return [
    { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
    { field: "proveedorRazonSocial", headerName: "Proveedor", flex: 2, minWidth: 200 },
    { field: "tiendaNombre", headerName: "Tienda destino", flex: 1, minWidth: 160 },
    {
      field: "tipoDocumento",
      headerName: "Tipo doc.",
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row) => nombreTipoDocumento(row.tipoDocumento),
    },
    { field: "serieDocumento", headerName: "Serie", flex: 1, minWidth: 80 },
    { field: "numeroDocumento", headerName: "Número", flex: 1, minWidth: 120 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row) => dayjs(row.fecha).format("DD/MM/YYYY"),
    },
    {
      field: "montoTotal",
      headerName: "Monto total",
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row) => monedaFormatter.format(row.montoTotal || 0),
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1,
      minWidth: 140,
      valueGetter: (_value, row) => row.observaciones || "—",
    },
    { field: "createdByUserName", headerName: "Creado por", flex: 1, minWidth: 160 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 100,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ListarIngreso>) => (
        <Tooltip title="Ver detalle">
          <Box>
            <VisibilityOutlinedIcon
              fontSize="small"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => onVer(params.row)}
            />
          </Box>
        </Tooltip>
      ),
    },
  ];
}

export default function ListarIngresos() {
  const mounted = useMounted();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarIngresos) : false;
  const canCreate = user ? hasPermission(user.rol, permissions.registrarIngreso) : false;

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tiendaId, setTiendaId] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ListarIngreso | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params = useMemo(
    () => ({
      pagina: paginationModel.page + 1,
      tamanoPagina: paginationModel.pageSize,
      tiendaId: tiendaId ? Number(tiendaId) : undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
      busquedaProducto: debouncedSearch || undefined,
    }),
    [paginationModel.page, paginationModel.pageSize, tiendaId, fechaDesde, fechaHasta, debouncedSearch],
  );

  const { ingresos, totalRegistros, loading } = useIngresos(params);

  const handleVer = useCallback((row: ListarIngreso) => {
    setSelectedRow(row);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

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
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                    LISTA DE INGRESOS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Registros de ingreso de productos
                  </Typography>
                </Box>
              </Stack>

              {canCreate && (
                <Button
                  component={Link}
                  href="/dashboard/ingresos/registrar"
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
                placeholder="Buscar por producto"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  },
                }}
                sx={{ minWidth: 260, flex: 1 }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }} disabled={loadingTiendas}>
                <InputLabel id="tienda-filter-label">Tienda destino</InputLabel>
                <Select
                  labelId="tienda-filter-label"
                  label="Tienda destino"
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
              rows={ingresos}
              columns={getColumns(handleVer)}
              loading={loading}
              slots={{ loadingOverlay: LoadingOverlay }}
              onRowDoubleClick={(params) => handleVer(params.row as ListarIngreso)}
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
          <DialogTitle>Detalle del ingreso #{selectedRow?.id}</DialogTitle>
          <DialogContent dividers>
            {selectedRow && (
              <Stack sx={{ gap: 2 }}>
                <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
                  <Typography variant="body2">
                    <strong>Proveedor:</strong> {selectedRow.proveedorRazonSocial}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tienda:</strong> {selectedRow.tiendaNombre}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Documento:</strong> {nombreTipoDocumento(selectedRow.tipoDocumento)}{" "}
                    {selectedRow.serieDocumento}-{selectedRow.numeroDocumento}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fecha:</strong> {dayjs(selectedRow.fecha).format("DD/MM/YYYY")}
                  </Typography>
                </Stack>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRow.detalles.map((detalle) => (
                        <TableRow key={detalle.id}>
                          <TableCell>{detalle.productoNombre}</TableCell>
                          <TableCell align="right">{detalle.cantidad}</TableCell>
                        </TableRow>
                      ))}
                      {selectedRow.detalles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            Sin productos
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained" startIcon={<CloseIcon />}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
