"use client";

import { useCallback, useMemo, useState } from "react";
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
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { esES } from "@mui/x-data-grid/locales";

import { useSalidas } from "@/features/dashboard/salida/hooks/useSalidas";
import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { ListarSalida } from "@/features/dashboard/salida/salida.type";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const pageSizeOptions = [20, 50, 100];

const origenes = [
  { id: 1, nombre: "Venta" },
  { id: 2, nombre: "Uso interno" },
];

function nombreOrigen(id: number) {
  return origenes.find((o) => o.id === id)?.nombre || `Origen ${id}`;
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

function getColumns(onVer: (row: ListarSalida) => void): GridColDef<ListarSalida>[] {
  return [
    { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
    { field: "tiendaOrigenNombre", headerName: "Tienda origen", minWidth: 200 },
    {
      field: "origenDescripcion",
      headerName: "Origen",
      minWidth: 140,
      valueGetter: (_value, row) => row.origenDescripcion || nombreOrigen(row.origen),
    },
    {
      field: "empleadoSolicitaNombre",
      headerName: "Solicitante",
      minWidth: 400,
      valueGetter: (_value, row) => row.empleadoSolicitaNombre || "—",
    },
    {
      field: "motivo",
      headerName: "Motivo",
      flex: 1,
      minWidth: 320,
      valueGetter: (_value, row) => row.motivo || "—",
    },
    {
      field: "fecha",
      headerName: "Fecha",
      minWidth: 170,
      valueGetter: (_value, row) => dayjs(row.fecha).format("DD/MM/YYYY - HH:mm"),
    },
    {
      field: "createdByUserName",
      headerName: "Creado por",
      minWidth: 220,
      valueGetter: (_value, row) => row.createdByUserName || "—",
    },
    {
      field: "updatedByUserName",
      headerName: "Actualizado por",
      minWidth: 220,
      valueGetter: (_value, row) => row.updatedByUserName || "—",
    },
    {
      field: "isActive",
      headerName: "Estado",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          size="small"
          icon={params.row.isActive ? <CheckCircleIcon /> : <CancelIcon />}
          label={params.row.isActive ? "Realizado" : "Cancelado"}
          variant="filled"
          sx={(theme) => ({
            fontWeight: 500,
            border: "1px solid",
            "& .MuiChip-icon": {
              color: params.row.isActive
                ? theme.palette.mode === "dark"
                  ? "#86efac"
                  : "#2e7d32"
                : theme.palette.mode === "dark"
                  ? "#fbbf24"
                  : "#b45309",
            },
            ...(params.row.isActive
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
          })}
        />
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 100,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ListarSalida>) => (
        <Box>
          <VisibilityIcon
            fontSize="small"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={() => onVer(params.row)}
          />
        </Box>
      ),
    },
  ];
}

export default function ListarSalidas() {
  const mounted = useMounted();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarSalidas) : false;
  const canCreate = user ? hasPermission(user.rol, permissions.registrarSalida) : false;

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);

  const [tiendaOrigenId, setTiendaOrigenId] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ListarSalida | null>(null);

  const params = useMemo(
    () => ({
      pagina: paginationModel.page + 1,
      tamanoPagina: paginationModel.pageSize,
      tiendaOrigenId: tiendaOrigenId ? Number(tiendaOrigenId) : undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [paginationModel.page, paginationModel.pageSize, tiendaOrigenId, fechaDesde, fechaHasta],
  );

  const { salidas, totalRegistros, loading } = useSalidas(params);

  const handleVer = useCallback((row: ListarSalida) => {
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
                  <ArrowOutwardIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                    LISTA DE SALIDAS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Registros de salida de productos
                  </Typography>
                </Box>
              </Stack>

              {canCreate && (
                <Button
                  component={Link}
                  href="/dashboard/salidas/registrar"
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
              <FormControl size="small" sx={{ minWidth: 200 }} disabled={loadingTiendas}>
                <InputLabel id="tienda-origen-filter-label">Tienda origen</InputLabel>
                <Select
                  labelId="tienda-origen-filter-label"
                  label="Tienda origen"
                  value={tiendaOrigenId}
                  onChange={(e) => {
                    setTiendaOrigenId(e.target.value);
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
              rows={salidas}
              columns={getColumns(handleVer)}
              loading={loading}
              slots={{ loadingOverlay: LoadingOverlay }}
              onRowDoubleClick={(params) => handleVer(params.row as ListarSalida)}
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
          <DialogTitle>Detalle de la salida #{selectedRow?.id}</DialogTitle>
          <DialogContent dividers>
            {selectedRow && (
              <Stack sx={{ gap: 2 }}>
                <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
                  <Typography variant="body2">
                    <strong>Tienda origen:</strong> {selectedRow.tiendaOrigenNombre}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Origen:</strong> {selectedRow.origenDescripcion || nombreOrigen(selectedRow.origen)}
                  </Typography>
                  {selectedRow.origen === 2 && selectedRow.empleadoSolicitaNombre && (
                    <Typography variant="body2">
                      <strong>Solicitante:</strong> {selectedRow.empleadoSolicitaNombre}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Fecha:</strong> {dayjs(selectedRow.fecha).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Stack>

                {selectedRow.motivo && (
                  <Typography variant="body2">
                    <strong>Motivo:</strong> {selectedRow.motivo}
                  </Typography>
                )}

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
