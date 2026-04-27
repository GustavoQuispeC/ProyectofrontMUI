"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { esES } from "@mui/x-data-grid/locales";
import { useEffect, useMemo, useState } from "react";
import { useEmpleados } from "@/features/dashboard/empleado/hooks/useEmpleados";
import Image from "next/image";
const getColumns = (): GridColDef[] => [
  {
    field: "codigoEmpleado",
    headerName: "CÓDIGO",
    width: 100,
  },
  {
    field: "fotoUrl",
    headerName: "FOTO",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box
        sx={{
          width: 40,
          height: 40,
          position: "relative", // 👈 necesario para fill
        }}
      >
        <Image
          src={params.value || "/Avatar.png"}
          alt="foto empleado"
          fill // ocupa todo el contenedor
          sizes="40px"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </Box>
    ),
  },
  { field: "nombreCompleto", headerName: "NOMBRES Y APELLIDOS", flex: 2, minWidth: 200 },
  {
    field: "fechaNacimiento",
    headerName: "F. Nacimiento",
    minWidth: 120,
    //flex: 1,
  },
  {
    field: "edad",
    headerName: "EDAD",
    minWidth: 80,
    headerAlign: "center",
    renderCell: (params) => <Box sx={{ width: "100%", textAlign: "center" }}>{params.value}</Box>,
  },
  { field: "cargoActual", headerName: "CARGO", flex: 1, minWidth: 150 },
  {
    field: "isActive",
    headerName: "ESTADO",
    width: 120,
    renderCell: (params) => {
      const isActive = params.value;

      return (
        <Chip
          label={isActive ? "Activo" : "Inactivo"}
          size="small"
          sx={{
            width: 90,
            justifyContent: "center",
            fontWeight: 500,

            // estilo tipo Alert
            bgcolor: isActive ? "success.light" : "error.light",
            color: isActive ? "success.contrastText" : "error.contrastText",
          }}
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "ACCIONES",
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

const paginationModel = { page: 0, pageSize: 10 };
const gridInitialState = { pagination: { paginationModel } };

export default function ListarEmpleadosDataTable() {
  const { empleados, loading } = useEmpleados();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const localeText = useMemo(() => esES.components.MuiDataGrid.defaultProps.localeText, []);

  const columns = useMemo(() => getColumns(), []);

  if (!mounted) return null;

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={empleados}
        columns={columns}
        getRowId={(row) => row.numeroDocumento}
        loading={loading}
        initialState={gridInitialState}
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
