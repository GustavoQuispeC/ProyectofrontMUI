"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { esES } from "@mui/x-data-grid/locales";
import AddIcon from "@mui/icons-material/Add";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProveedores, useCambiarEstadoProveedor } from "@/features/dashboard/proveedor/hooks/useProveedores";
import { ListarProveedor } from "@/features/dashboard/proveedor/proveedor.type";
import { formatDate } from "@/shared/utils/date";
import { getAuthUser } from "@/shared/auth/auth.service";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";
import { toastPromise } from "@/shared/utils/toast";

const getColumns = (
  onToggleEstado: (row: ListarProveedor) => void,
  onEdit: (row: ListarProveedor) => void,
  isToggling: boolean,
  canEdit: boolean,
): GridColDef<ListarProveedor>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 50,
  },
  {
    field: "razonSocial",
    headerName: "RAZÓN SOCIAL",
    flex: 2,
    minWidth: 220,
  },
  {
    field: "ruc",
    headerName: "RUC",
    minWidth: 120,
  },
  {
    field: "contacto",
    headerName: "CONTACTO",
    flex: 1,
    minWidth: 110,
    valueGetter: (_value, row) => row.contacto ?? "—",
  },
  {
    field: "telefono",
    headerName: "TELÉFONO",
    minWidth: 120,
    valueGetter: (_value, row) => row.telefono ?? "—",
  },
  {
    field: "correo",
    headerName: "CORREO",
    flex: 1,
    minWidth: 200,
    valueGetter: (_value, row) => row.correo ?? "—",
  },
  {
    field: "createdAt",
    headerName: "F. CREACIÓN",
    minWidth: 110,
    valueFormatter: (value) => formatDate(value),
  },
  {
    field: "createdByUserName",
    headerName: "CREADO POR",
    flex: 1,
    minWidth: 200,
    valueGetter: (_value, row) => row.createdByUserName ?? "—",
  },
  {
    field: "isActive",
    headerName: "ESTADO",
    width: 120,
    renderCell: (params: GridRenderCellParams<ListarProveedor>) => (
      <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Tooltip title={params.row.isActive ? "Desactivar" : "Activar"}>
          <Switch
            checked={params.row.isActive}
            onChange={() => onToggleEstado(params.row)}
            disabled={isToggling}
            size="small"
          />
        </Tooltip>
      </Box>
    ),
  },
  {
    field: "actions",
    headerName: "ACCIONES",
    width: 100,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<ListarProveedor>) => (
      <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Tooltip title={canEdit ? "Editar" : "No tienes permisos para editar proveedores"}>
          <span>
            <IconButton size="small" color="inherit" disabled={!canEdit} onClick={() => onEdit(params.row)}>
              <ModeEditOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    ),
  },
];

const paginationModel = { page: 0, pageSize: 20 };

const gridInitialState = { pagination: { paginationModel } };

export default function ListarProveedores() {
  const { proveedores, loading } = useProveedores(true);
  const { cambiarEstadoProveedor, loading: toggling } = useCambiarEstadoProveedor();
  const mounted = useMounted();
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarProveedores) : false;
  const canCreate = user ? hasPermission(user.rol, permissions.registrarProveedor) : false;
  const canEdit = user ? hasPermission(user.rol, permissions.registrarProveedor) : false;

  const handleToggleEstado = useCallback(
    async (row: ListarProveedor) => {
      const action = row.isActive ? "desactivar" : "activar";
      await toastPromise(cambiarEstadoProveedor(row), {
        loading: `Procesando...`,
        success: `Proveedor ${action === "activar" ? "activado" : "desactivado"} correctamente.`,
        error: (err) => err.message,
      });
    },
    [cambiarEstadoProveedor],
  );

  const handleEdit = useCallback(
    (row: ListarProveedor) => {
      router.push(`/dashboard/proveedores/${row.id}/editar`);
    },
    [router],
  );

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (!mounted) return null;

  return (
    <Box sx={{ p: 3, maxWidth: "100%", mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Proveedores
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!canCreate}
          onClick={() => router.push("/dashboard/proveedores/registrar")}
        >
          Agregar
        </Button>
      </Box>
      <Paper sx={{ height: 1100, width: "100%", p: 2 }}>
        <DataGrid
          rows={proveedores}
          columns={getColumns(handleToggleEstado, handleEdit, toggling, canEdit)}
          loading={loading}
          initialState={gridInitialState}
          pageSizeOptions={[20, 50, 100, 200]}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            border: 0,
            height: "100%",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "action.hover",
              fontWeight: 600,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
