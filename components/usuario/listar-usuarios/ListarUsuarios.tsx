"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { useUsuarios } from "@/components/features/dashboard/usuario/hooks/useUsuarios";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { esES } from "@mui/x-data-grid/locales";
import { useMemo } from "react";

const getColumns = (): GridColDef[] => [
  {
    field: "numeroDocumento",
    headerName: "N° Documento",
    width: 130,
  },
  {
    field: "nombreEmpleado",
    headerName: "Nombre",
    width: 220,
    flex: 1,
  },
  {
    field: "email",
    headerName: "Correo",
    width: 220,
    flex: 1,
  },
  {
    field: "roles",
    headerName: "Roles",
    width: 150,
    renderCell: (params) => params.value?.join(", "),
  },
  {
    field: "isActive",
    headerName: "Estado",
    width: 120,
    renderCell: (params) => (
      <Chip label={params.value ? "Activo" : "Inactivo"} color={params.value ? "success" : "error"} size="small" />
    ),
  },
  {
    field: "actions",
    headerName: "Acciones",
    width: 130,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, height: "100%" }}>
        <Tooltip title="Ver">
          <IconButton size="small" color="info" onClick={() => console.log("Ver", params.row)}>
            <RemoveRedEyeOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton size="small" color="inherit" onClick={() => console.log("Editar", params.row)}>
            <ModeEditOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton size="small" color="error" onClick={() => console.log("Eliminar", params.row)}>
            <DeleteForeverOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ListarUsuariosDataTable() {
  const { usuarios, loading } = useUsuarios();

  const localeText = useMemo(() => esES.components.MuiDataGrid.defaultProps.localeText, []);

  const columns = useMemo(() => getColumns(), []);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={usuarios}
        columns={columns}
        getRowId={(row) => row.numeroDocumento}
        loading={loading}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        localeText={localeText}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#e4eaeb",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: "#006064",
          },
        }}
      />
    </Paper>
  );
}
