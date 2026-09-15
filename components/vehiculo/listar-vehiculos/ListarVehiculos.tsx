"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { esES } from "@mui/x-data-grid/locales";
import { useRouter } from "next/navigation";

import { useVehiculos, useEliminarVehiculo } from "@/features/dashboard/vehiculo/hooks/useVehiculos";
import { ListarVehiculo } from "@/features/dashboard/vehiculo/vehiculo.type";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { toastPromise } from "@/shared/utils/toast";

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

function getColumns(
  onVer: (row: ListarVehiculo) => void,
  onEdit: (row: ListarVehiculo) => void,
  onDelete: (row: ListarVehiculo) => void,
  canEdit: boolean,
  canDelete: boolean,
): GridColDef<ListarVehiculo>[] {
  return [
    { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
    { field: "placa", headerName: "Placa", flex: 1, minWidth: 120 },
    { field: "marca", headerName: "Marca", flex: 1, minWidth: 150 },
    { field: "modelo", headerName: "Modelo", flex: 1, minWidth: 150 },
    { field: "anio", headerName: "Año", width: 100, align: "center", headerAlign: "center" },
    {
      field: "createdAt",
      headerName: "Fecha de creación",
      flex: 1,
      minWidth: 150,
      valueGetter: (_value, row) => dayjs(row.createdAt).format("DD/MM/YYYY HH:mm"),
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
          label={params.row.isActive ? "Activo" : "Inactivo"}
          variant="filled"
          sx={(theme) => ({
            fontWeight: 500,
            border: "1px solid",
            "& .MuiChip-icon": {
              color: params.row.isActive
                ? theme.palette.mode === "dark"
                  ? "#49ef6d"
                  : "#02710497"
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
      width: 130,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ListarVehiculo>) => (
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center", gap: 1, height: "100%" }}>
          <Tooltip title="Ver detalle">
            <Box>
              <VisibilityIcon
                fontSize="small"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={() => onVer(params.row)}
              />
            </Box>
          </Tooltip>
          <Tooltip title={canEdit ? "Editar" : "No tienes permisos para editar vehículos"}>
            <Box>
              <ModeEditOutlineOutlinedIcon
                fontSize="small"
                color={canEdit ? "primary" : "disabled"}
                sx={{ cursor: canEdit ? "pointer" : "not-allowed" }}
                onClick={() => canEdit && onEdit(params.row)}
              />
            </Box>
          </Tooltip>
          <Tooltip title={canDelete ? "Eliminar" : "No tienes permisos para eliminar vehículos"}>
            <Box>
              <DeleteForeverOutlinedIcon
                fontSize="small"
                color={canDelete && params.row.isActive ? "error" : "disabled"}
                sx={{ cursor: canDelete && params.row.isActive ? "pointer" : "not-allowed" }}
                onClick={() => canDelete && params.row.isActive && onDelete(params.row)}
              />
            </Box>
          </Tooltip>
        </Stack>
      ),
    },
  ];
}

export default function ListarVehiculos() {
  const mounted = useMounted();
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarVehiculos) : false;
  const canCreate = user ? hasPermission(user.rol, permissions.registrarVehiculo) : false;
  const canEdit = user ? hasPermission(user.rol, permissions.editarVehiculo) : false;
  const canDelete = user ? hasPermission(user.rol, permissions.eliminarVehiculo) : false;

  const { vehiculos, loading } = useVehiculos(canAccess);
  const eliminarVehiculoMutation = useEliminarVehiculo();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [estado, setEstado] = useState<string>("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ListarVehiculo | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<ListarVehiculo | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const vehiculosFiltrados = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return vehiculos.filter((v) => {
      const matchSearch =
        !term ||
        v.placa.toLowerCase().includes(term) ||
        v.marca.toLowerCase().includes(term) ||
        v.modelo.toLowerCase().includes(term);

      const matchEstado = estado === "" || v.isActive === (estado === "activos");

      return matchSearch && matchEstado;
    });
  }, [vehiculos, debouncedSearch, estado]);

  const handleVer = useCallback((row: ListarVehiculo) => {
    setSelectedRow(row);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = useCallback(
    (row: ListarVehiculo) => {
      router.push(`/dashboard/vehiculo/${row.id}/editar`);
    },
    [router],
  );

  const handleDelete = useCallback((row: ListarVehiculo) => {
    setVehiculoAEliminar(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setVehiculoAEliminar(null);
  };

  const handleConfirmDelete = async () => {
    if (!vehiculoAEliminar) return;

    try {
      await toastPromise(eliminarVehiculoMutation.eliminarVehiculo(vehiculoAEliminar.id), {
        loading: "Eliminando vehículo...",
        success: "Vehículo eliminado correctamente.",
        error: (error) => error.message,
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error(error);
    }
  };

  if (!canAccess) return <AccessDenied />;
  if (!mounted) return null;

  return (
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
                <DirectionsCarIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  LISTA DE VEHÍCULOS
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registros de vehículos
                </Typography>
              </Box>
            </Stack>

            {canCreate && (
              <Button
                component={Link}
                href="/dashboard/vehiculo/registrar"
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
              placeholder="Buscar por placa, marca o modelo"
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

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="estado-filter-label">Estado</InputLabel>
              <Select
                labelId="estado-filter-label"
                label="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="activos">Activos</MenuItem>
                <MenuItem value="inactivos">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Paper sx={{ height: "auto", width: "100%", p: 2, borderRadius: 0 }}>
          <DataGrid
            rows={vehiculosFiltrados}
            columns={getColumns(handleVer, handleEdit, handleDelete, canEdit, canDelete)}
            loading={loading}
            slots={{ loadingOverlay: LoadingOverlay }}
            onRowDoubleClick={(params) => handleVer(params.row as ListarVehiculo)}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 20 } } }}
            pageSizeOptions={pageSizeOptions}
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle del vehículo #{selectedRow?.id}</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Stack sx={{ gap: 2 }}>
              <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap" }}>
                <Typography variant="body2">
                  <strong>Placa:</strong> {selectedRow.placa}
                </Typography>
                <Typography variant="body2">
                  <strong>Marca:</strong> {selectedRow.marca}
                </Typography>
                <Typography variant="body2">
                  <strong>Modelo:</strong> {selectedRow.modelo}
                </Typography>
                <Typography variant="body2">
                  <strong>Año:</strong> {selectedRow.anio}
                </Typography>
                <Typography variant="body2">
                  <strong>Estado:</strong> {selectedRow.isActive ? "Activo" : "Inactivo"}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha de creación:</strong> {dayjs(selectedRow.createdAt).format("DD/MM/YYYY HH:mm")}
                </Typography>
                {selectedRow.updatedAt && (
                  <Typography variant="body2">
                    <strong>Última actualización:</strong> {dayjs(selectedRow.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                )}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" startIcon={<CloseIcon />}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            ¿Estás seguro de que deseas eliminar el vehículo{" "}
            <strong>
              {vehiculoAEliminar?.marca} {vehiculoAEliminar?.modelo} ({vehiculoAEliminar?.placa})
            </strong>
            ? El vehículo quedará inactivo.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            disabled={eliminarVehiculoMutation.loading}
            onClick={handleConfirmDelete}
          >
            {eliminarVehiculoMutation.loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
