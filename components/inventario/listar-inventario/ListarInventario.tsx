"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import { esES } from "@mui/x-data-grid/locales";

import { useInventarios } from "@/features/dashboard/inventario/hooks/useInventarios";
import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { ListarInventario as ListarInventarioItem } from "@/features/dashboard/inventario/inventario.type";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const pageSizeOptions = [20, 50, 100];

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

const columns: GridColDef<ListarInventarioItem>[] = [
  { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
  { field: "productoCodigoInterno", headerName: "Código", flex: 1, minWidth: 110 },
  { field: "productoNombre", headerName: "Producto", flex: 2, minWidth: 220 },
  { field: "tiendaNombre", headerName: "Tienda", flex: 1, minWidth: 160 },
  {
    field: "stockActual",
    headerName: "Stock actual",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <Typography
          variant="body2"
          sx={{ color: params.row.stockActual <= 0 ? "error.main" : "text.primary", fontWeight: 600 }}
        >
          {params.row.stockActual}
        </Typography>
      </Box>
    ),
  },
  {
    field: "stockReservado",
    headerName: "Reservado",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "stockDisponible",
    headerName: "Disponible",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <Typography
          variant="body2"
          sx={{ color: params.row.stockDisponible <= 0 ? "error.main" : "text.primary", fontWeight: 600 }}
        >
          {params.row.stockDisponible}
        </Typography>
      </Box>
    ),
  },
  {
    field: "ultimaActualizacion",
    headerName: "Última actualización",
    flex: 1,
    minWidth: 170,
    align: "center",
    headerAlign: "center",
    valueGetter: (_value, row) =>
      row.ultimaActualizacion ? dayjs(row.ultimaActualizacion).format("DD/MM/YYYY HH:mm") : "—",
  },
];

export default function ListarInventario() {
  const mounted = useMounted();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarInventario) : false;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params = useMemo(
    () => ({
      pagina: paginationModel.page + 1,
      tamanoPagina: paginationModel.pageSize,
      tiendaId: tiendaId ? Number(tiendaId) : undefined,
      busquedaProducto: debouncedSearch || undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [paginationModel.page, paginationModel.pageSize, tiendaId, debouncedSearch, fechaDesde, fechaHasta],
  );

  const { inventario, totalRegistros, loading } = useInventarios(params);

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
            <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <InventoryIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  INVENTARIO
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock de productos por tienda
                </Typography>
              </Box>
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
                placeholder="Buscar por nombre, código interno o de barras"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  },
                }}
                sx={{ minWidth: 280, flex: 1 }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }} disabled={loadingTiendas}>
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

              <DatePicker
                label="Actualizado desde"
                value={fechaDesde ? dayjs(fechaDesde) : null}
                onChange={(val) => {
                  setFechaDesde(val?.format("YYYY-MM-DD") ?? "");
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                slotProps={{ textField: { size: "small", sx: { minWidth: 170 } } }}
              />

              <DatePicker
                label="Actualizado hasta"
                value={fechaHasta ? dayjs(fechaHasta) : null}
                onChange={(val) => {
                  setFechaHasta(val?.format("YYYY-MM-DD") ?? "");
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                slotProps={{ textField: { size: "small", sx: { minWidth: 170 } } }}
              />
            </Stack>
          </Box>

          <Paper sx={{ height: "auto", width: "100%", p: 2, borderRadius: 0 }}>
            <DataGrid
              rows={inventario}
              columns={columns}
              loading={loading}
              slots={{ loadingOverlay: LoadingOverlay }}
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
      </Box>
    </LocalizationProvider>
  );
}
