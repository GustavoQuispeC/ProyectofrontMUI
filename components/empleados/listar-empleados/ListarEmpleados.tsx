"use client";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
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
import CircularProgress from "@mui/material/CircularProgress";
import { EmpleadosListar } from "@/features/dashboard/empleado/empleado.types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useEliminarEmpleado } from "@/features/dashboard/empleado/hooks/useEliminarEmpleado";
import { useRouter } from "next/navigation";
//! Componente para mostrar la imagen con un loader mientras se carga
interface Props {
  src?: string;
  alt?: string;
}
//! Componente para mostrar la imagen con un loader mientras se carga
export function ImageWithLoader({ src, alt }: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        position: "relative",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.6)",
            borderRadius: "50%",
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}

      <Box
        component="img"
        src={src || "/Avatar.png"}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          objectFit: "cover",
          display: loading ? "none" : "block",
        }}
      />
    </Box>
  );
}

//! Función para obtener las columnas de la tabla de empleados
const getColumns = (
  onDelete: (row: EmpleadosListar) => void,
  onView: (row: EmpleadosListar) => void,
): GridColDef<EmpleadosListar>[] => [
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
    headerAlign: "center",
    renderCell: (params) => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageWithLoader src={params.value} alt="foto empleado" />
      </Box>
    ),
  },
  { field: "nombreCompleto", headerName: "NOMBRES Y APELLIDOS", flex: 2, minWidth: 200 },
  {
    field: "fechaNacimiento",
    headerName: "F. Nacimiento",
    minWidth: 120,
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
    renderCell: (params: GridRenderCellParams<EmpleadosListar>) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, height: "100%" }}>
        <Tooltip title="Ver">
          <IconButton size="small" color="info" onClick={() => onView(params.row)}>
            <RemoveRedEyeOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton size="small" color="inherit" onClick={() => console.log("Editar", params.row)}>
            <ModeEditOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={params.row.isActive ? "Eliminar" : "No se puede eliminar un empleado inactivo"}>
          <span>
            <IconButton size="small" color="error" disabled={!params.row.isActive} onClick={() => onDelete(params.row)}>
              <DeleteForeverOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    ),
  },
];

//! Componente principal para listar los empleados en una tabla
const paginationModel = { page: 0, pageSize: 20 };

//! Se define el estado inicial de la paginación para el DataGrid
const gridInitialState = { pagination: { paginationModel } };

export default function ListarEmpleadosDataTable() {
  const { empleados, loading } = useEmpleados();
  const [mounted, setMounted] = useState(false); // Estado para controlar el montaje del componente y evitar renderizados prematuros
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<EmpleadosListar | null>(null);
  const { eliminarEmpleado } = useEliminarEmpleado();
  const router = useRouter();

  const handleOpenDialog = (row: EmpleadosListar) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  //! useEffect para establecer el estado de montaje después del primer renderizado, utilizando requestAnimationFrame para asegurar que se ejecute después de que el componente esté completamente montado
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const localeText = useMemo(() => esES.components.MuiDataGrid.defaultProps.localeText, []);

  const columns = useMemo(() => getColumns(handleOpenDialog), []); //useMemo para memorizar las columnas y evitar que se vuelvan a crear en cada renderizado

  if (!mounted) return null;

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid<EmpleadosListar>
        rows={empleados}
        columns={columns}
        getRowId={(row) => row.numeroDocumento}
        loading={loading}
        initialState={gridInitialState}
        pageSizeOptions={[5, 10, 20]}
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>

        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar a <strong>{selectedRow?.nombreCompleto}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>

          <Button
            color="error"
            onClick={() => {
              if (!selectedRow) return;

              eliminarEmpleado(selectedRow.id);
              handleCloseDialog();
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
