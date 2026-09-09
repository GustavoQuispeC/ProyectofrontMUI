"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
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
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import EditIcon from "@mui/icons-material/Edit";
import { esES } from "@mui/x-data-grid/locales";

import { useClientesListado } from "@/features/dashboard/cliente/hooks/useClientesListado";
import { ListarCliente } from "@/features/dashboard/cliente/cliente.type";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import RegistrarCliente from "@/components/clientes/registrar-cliente/RegistrarCliente";
import EditarCliente from "@/components/clientes/editar-cliente/EditarCliente";

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

export default function ListarClientes() {
  const mounted = useMounted();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarClientes) : false;
  const canCreate = user ? hasPermission(user.rol, permissions.registrarCliente) : false;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isActive, setIsActive] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ListarCliente | null>(null);
  const [modalDireccionesOpen, setModalDireccionesOpen] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<ListarCliente | null>(null);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

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
      busqueda: debouncedSearch || undefined,
      isActive: isActive === "" ? undefined : isActive === "true",
    }),
    [paginationModel.page, paginationModel.pageSize, debouncedSearch, isActive],
  );

  const { clientes, totalRegistros, loading, refetch } = useClientesListado(params);

  const handleClienteCreado = async () => {
    await refetch();
    setModalOpen(false);
  };

  const handleCloseEditar = async () => {
    setClienteEditar(null);
    setModalEditarOpen(false);
    await refetch();
  };

  const columns = useMemo<GridColDef<ListarCliente>[]>(
    () => [
      { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
      {
        field: "nombreCompleto",
        headerName: "Cliente",
        flex: 2,
        minWidth: 240,
      },
      {
        field: "numeroDni",
        headerName: "DNI",
        flex: 1,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
        valueGetter: (_value, row) => row.numeroDni || "—",
      },
      {
        field: "numeroRuc",
        headerName: "RUC",
        flex: 1,
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        valueGetter: (_value, row) => row.numeroRuc || "—",
      },
      {
        field: "correo",
        headerName: "Correo",
        flex: 1,
        minWidth: 220,
        valueGetter: (_value, row) => row.correo || "—",
      },
      {
        field: "telefono",
        headerName: "Teléfono",
        flex: 1,
        minWidth: 130,
        valueGetter: (_value, row) => row.telefono || "—",
      },
      {
        field: "direcciones",
        headerName: "Direcciones",
        width: 120,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
          <IconButton
            color="warning"
            size="small"
            onClick={() => {
              setClienteSeleccionado(params.row);
              setModalDireccionesOpen(true);
            }}
            title="Ver direcciones"
          >
            <LocationOnIcon />
          </IconButton>
        ),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 100,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setClienteEditar(params.row);
              setModalEditarOpen(true);
            }}
            title="Editar cliente"
          >
            <EditIcon />
          </IconButton>
        ),
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
            icon={params.row.isActive ? <CheckCircleOutlinedIcon /> : <CancelOutlinedIcon />}
            label={params.row.isActive ? "Activo" : "Inactivo"}
            color={params.row.isActive ? "success" : "error"}
            variant="filled"
          />
        ),
      },
      {
        field: "createdAt",
        headerName: "Fecha de registro",
        flex: 1,
        minWidth: 170,
        align: "center",
        headerAlign: "center",
        valueGetter: (_value, row) => (row.createdAt ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm") : "—"),
      },
    ],
    [],
  );

  const direcciones = clienteSeleccionado?.direcciones ?? [];

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
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  LISTA DE CLIENTES
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clientes registrados en el sistema
                </Typography>
              </Box>
            </Stack>

            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setModalOpen(true)}
                sx={{ height: 40 }}
              >
                Nuevo cliente
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
              placeholder="Buscar por nombre, DNI o RUC"
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

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="estado-filter-label">Estado</InputLabel>
              <Select
                labelId="estado-filter-label"
                label="Estado"
                value={isActive}
                onChange={(e) => {
                  setIsActive(e.target.value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Paper sx={{ height: "auto", width: "100%", p: 2, borderRadius: 0 }}>
          <DataGrid
            rows={clientes}
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

      <RegistrarCliente open={modalOpen} onClose={() => setModalOpen(false)} onClienteCreado={handleClienteCreado} />

      <EditarCliente open={modalEditarOpen} onClose={handleCloseEditar} cliente={clienteEditar} />

      <Dialog open={modalDireccionesOpen} onClose={() => setModalDireccionesOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon color="warning" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Direcciones de {clienteSeleccionado?.nombreCompleto || "cliente"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {direcciones.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No hay direcciones registradas.
            </Typography>
          ) : (
            <List dense>
              {direcciones.map((d, index) => (
                <ListItem key={d.id} divider={index < direcciones.length - 1}>
                  <ListItemIcon>
                    <HomeWorkIcon color={d.esPrincipal ? "primary" : "action"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {d.direccion}
                        </Typography>
                        {d.esPrincipal && <Chip size="small" color="secondary" label="Principal" />}
                      </Box>
                    }
                    secondary={
                      [d.referencia, d.distrito, d.provincia, d.departamento].filter(Boolean).join(" • ") || ""
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalDireccionesOpen(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
