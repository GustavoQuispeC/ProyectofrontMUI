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
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { esES } from "@mui/x-data-grid/locales";
import { useCallback, useMemo, useState } from "react";
import { useEmpleados } from "@/features/dashboard/empleado/hooks/useEmpleados";
import { useCatalogos } from "@/features/dashboard/catalogo";
import { useCargos } from "@/features/dashboard/cargo/hooks/useCargos";
import { formatDate } from "@/shared/utils/date";
import CircularProgress from "@mui/material/CircularProgress";
import { EmpleadosListar } from "@/features/dashboard/empleado/empleado.types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useDesactivarEmpleado } from "@/features/dashboard/empleado/hooks/useDesactivarEmpleado";
import { useReactivarEmpleado } from "@/features/dashboard/empleado/hooks/useReactivarEmpleado";
import { useRouter } from "next/navigation";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Link from "next/link";
import { getAuthUser } from "@/shared/auth/auth.service";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";

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
  onEdit: (row: EmpleadosListar) => void,
  onReactivate: (row: EmpleadosListar) => void,
  canDelete: boolean,
  canEdit: boolean,
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
    valueFormatter: (value) => formatDate(value),
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
        <Tooltip title={canEdit ? "Editar" : "No tienes permisos para editar empleados"}>
          <span>
            <IconButton size="small" color="inherit" disabled={!canEdit} onClick={() => onEdit(params.row)}>
              <ModeEditOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip
          title={
            !canDelete
              ? "No tienes permisos para eliminar empleados"
              : params.row.isActive
                ? "Eliminar"
                : "No se puede eliminar un empleado inactivo"
          }
        >
          <span>
            <IconButton
              size="small"
              color="error"
              disabled={!params.row.isActive || !canDelete}
              onClick={() => onDelete(params.row)}
              sx={{ display: params.row.isActive ? "flex" : "none" }}
            >
              <DeleteForeverOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip
          title={
            !canEdit
              ? "No tienes permisos para reactivar empleados"
              : params.row.isActive
                ? "No se puede reactivar un empleado activo"
                : "Reactivar"
          }
        >
          <span>
            <IconButton
              size="small"
              color="success"
              disabled={params.row.isActive || !canEdit}
              onClick={() => onReactivate(params.row)}
              sx={{ display: !params.row.isActive ? "flex" : "none" }}
            >
              <RestartAltIcon fontSize="small" />
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
  const mounted = useMounted();
  const [openDialog, setOpenDialog] = useState(false);
  const [openReactivateDialog, setOpenReactivateDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<EmpleadosListar | null>(null);
  const [motivoEgreso, setMotivoEgreso] = useState<number | null>(null);
  const [reactivateData, setReactivateData] = useState({
    cargoId: 0,
    salarioBase: 0,
    tipoContrato: 0,
    tipoJornada: 0,
    fechaIngreso: "",
    observaciones: "",
  });
  const { catalogos } = useCatalogos();
  const { cargos } = useCargos();
  const { desactivarEmpleado, loading: desactivarLoading } = useDesactivarEmpleado();
  const { reactivarEmpleado, loading: reactivarLoading } = useReactivarEmpleado();
  const router = useRouter();

  //!Validando permisos
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarEmpleados) : false;
  const canDelete = user ? hasPermission(user.rol, permissions.eliminarEmpleado) : false;
  const canEdit = user ? hasPermission(user.rol, permissions.editarEmpleado) : false;

  const handleOpenDialog = useCallback((row: EmpleadosListar) => {
    setSelectedRow(row);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    setMotivoEgreso(null);
  };

  const handleCloseReactivateDialog = () => {
    setOpenReactivateDialog(false);
    setSelectedRow(null);
    setReactivateData({
      cargoId: 0,
      salarioBase: 0,
      tipoContrato: 0,
      tipoJornada: 0,
      fechaIngreso: "",
      observaciones: "",
    });
  };

  const handleReactivateSubmit = () => {
    if (!selectedRow) return;
    reactivarEmpleado({
      id: selectedRow.id,
      payload: {
        ...reactivateData,
        fechaIngreso: new Date(reactivateData.fechaIngreso).toISOString(),
      },
    });
    handleCloseReactivateDialog();
  };

  const handleView = useCallback(
    (row: EmpleadosListar) => {
      router.push(`/dashboard/empleados/${row.id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (row: EmpleadosListar) => {
      router.push(`/dashboard/empleados/${row.id}/editar`);
    },
    [router],
  );

  const handleReactivate = useCallback((row: EmpleadosListar) => {
    setSelectedRow(row);
    setOpenReactivateDialog(true);
  }, []);

  const localeText = useMemo(() => esES.components.MuiDataGrid.defaultProps.localeText, []);

  const columns = useMemo(
    () => getColumns(handleOpenDialog, handleView, handleEdit, handleReactivate, canDelete, canEdit),
    [handleOpenDialog, handleView, handleEdit, handleReactivate, canDelete, canEdit],
  );

  //! controla el renderizado
  if (!mounted) return null;

  if (!canAccess) {
    return <AccessDenied />;
  }

  return (
    <Paper sx={{ height: "100%", width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Button
          component={Link}
          href="/dashboard/empleados/registrar"
          variant="contained"
          startIcon={<GroupAddIcon />}
          sx={{ height: 44, width: { xs: "100%", sm: "auto" } }}
        >
          Nuevo Empleado
        </Button>
      </Box>

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
          mx: 1,
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
        <DialogTitle>Confirmar desactivación</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            ¿Seguro que deseas desactivar a <strong>{selectedRow?.nombreCompleto}</strong>?
          </DialogContentText>
          <FormControl fullWidth size="small">
            <InputLabel>Motivo de egreso</InputLabel>
            <Select
              autoFocus
              value={motivoEgreso ?? ""}
              label="Motivo de egreso"
              onChange={(e) => setMotivoEgreso(Number(e.target.value))}
            >
              <MenuItem value="">
                <em>Seleccione...</em>
              </MenuItem>
              {catalogos.motivosEgreso.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>

          <Button
            color="error"
            disabled={desactivarLoading}
            onClick={() => {
              if (!selectedRow) return;

              desactivarEmpleado({ id: selectedRow.id, payload: { motivoEgreso: motivoEgreso ?? 0 } });
              handleCloseDialog();
            }}
          >
            {desactivarLoading ? "Desactivando..." : "Desactivar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReactivateDialog} onClose={handleCloseReactivateDialog} maxWidth="md" fullWidth>
        <DialogTitle>Confirmar reactivación</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            ¿Seguro que deseas reactivar a <strong>{selectedRow?.nombreCompleto}</strong>? Completa los datos laborales:
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Cargo</InputLabel>
                <Select
                  value={reactivateData.cargoId || ""}
                  label="Cargo"
                  onChange={(e) => setReactivateData({ ...reactivateData, cargoId: Number(e.target.value) })}
                >
                  <MenuItem value="">
                    <em>Seleccione...</em>
                  </MenuItem>
                  {cargos.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Salario Base"
                type="number"
                value={reactivateData.salarioBase}
                onChange={(e) => setReactivateData({ ...reactivateData, salarioBase: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Contrato</InputLabel>
                <Select
                  value={reactivateData.tipoContrato || ""}
                  label="Tipo de Contrato"
                  onChange={(e) => setReactivateData({ ...reactivateData, tipoContrato: Number(e.target.value) })}
                >
                  <MenuItem value="">
                    <em>Seleccione...</em>
                  </MenuItem>
                  {catalogos.tiposContrato.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Jornada</InputLabel>
                <Select
                  value={reactivateData.tipoJornada || ""}
                  label="Tipo de Jornada"
                  onChange={(e) => setReactivateData({ ...reactivateData, tipoJornada: Number(e.target.value) })}
                >
                  <MenuItem value="">
                    <em>Seleccione...</em>
                  </MenuItem>
                  {catalogos.tiposJornada.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                  label="Fecha de Ingreso"
                  value={reactivateData.fechaIngreso ? dayjs(reactivateData.fechaIngreso) : null}
                  onChange={(val) =>
                    setReactivateData({ ...reactivateData, fechaIngreso: val?.format("YYYY-MM-DD") ?? "" })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Observaciones"
                multiline
                rows={3}
                value={reactivateData.observaciones}
                onChange={(e) => setReactivateData({ ...reactivateData, observaciones: e.target.value.toUpperCase() })}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseReactivateDialog}>Cancelar</Button>
          <Button color="success" disabled={reactivarLoading} onClick={handleReactivateSubmit}>
            {reactivarLoading ? "Reactivando..." : "Reactivar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
