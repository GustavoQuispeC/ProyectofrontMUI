import { usePermisosPendientes } from "@/features/dashboard/permiso/hooks/usePermisosPendientes";
import { Condicion } from "@/features/dashboard/permiso/permiso.type";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { getAuthUser } from "@/shared/auth/auth.service";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";
import { useState } from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useRechazarPermiso } from "@/features/dashboard/permiso/hooks/useRechazarPermiso";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useAprobarPermiso } from "@/features/dashboard/permiso/hooks/useAprobarPermiso";
import AssessmentIcon from "@mui/icons-material/Assessment";

const chipCondicion = (condicion: Condicion) => {
  const config: Record<Condicion, { color: "warning" | "success" | "error"; label: string }> = {
    Pendiente: { color: "warning", label: "Pendiente" },
    Aprobado: { color: "success", label: "Aprobado" },
    Rechazado: { color: "error", label: "Rechazado" },
  };
  return <Chip size="small" color={config[condicion].color} label={config[condicion].label} />;
};

export default function ListarPermisosPendientes() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarPermisosPendientes) : false;
  const puedeAprobar = user?.rol === "Gerente" || user?.rol === "Administrador" || user?.rol === "SuperAdmin";
  const mounted = useMounted(); //? controla el estado de montaje
  const { permisosPendientes, loading: loadingPermisos } = usePermisosPendientes(canAccess);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { rechazarPermiso, loading: rechazando } = useRechazarPermiso();
  const { aprobarPermiso, loading: aprobando } = useAprobarPermiso();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{ id: number; nombreEmpleado: string } | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  const handleOpenDialog = (id: number, nombreEmpleado: string) => {
    setSelectedRow({ id, nombreEmpleado });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    setMotivoRechazo("");
  };

  //! guarda el rechazo del permiso
  const handleRechazar = () => {
    if (!selectedRow) return;
    rechazarPermiso({ id: selectedRow.id, motivoRechazo });
    handleCloseDialog();
  };

  //! controla el renderizado
  if (!mounted) return null;

  if (!canAccess) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button component={Link} href="/dashboard/permisos/registrar" variant="contained" startIcon={<GroupAddIcon />}>
          Gestionar Permisos
        </Button>
        <Button
          component={Link}
          href="/dashboard/permisos/mensual"
          variant="contained"
          sx={{ ml: 1 }}
          color="success"
          startIcon={<AssessmentIcon />}
        >
          Ver todos
        </Button>
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ width: "100%" }}>
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              {["N°", "Empleado", "Fecha", "Horario", "Duración", "Motivo", "Lugar", "Estado", "Acciones"].map(
                (col) => (
                  <TableCell key={col} align={col === "Acciones" ? "center" : "left"}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {col}
                    </Typography>
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingPermisos ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cargando...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : permisosPendientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay permisos pendientes.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              permisosPendientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((permiso, idx) => {
                return (
                  <TableRow key={permiso.id} hover>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                        {permiso.nombreEmpleado}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{permiso.fecha}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {permiso.horaInicio} - {permiso.horaFin}
                      </Typography>
                    </TableCell>
                    {/* ✅ permiso.duracionMin en lugar de permisosPendientes.duracionMin */}
                    <TableCell>{`${Math.floor(permiso.duracionMin / 60)}h ${permiso.duracionMin % 60}m`}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {permiso.motivo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {permiso.lugar}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={permiso.motivoRechazo || ""} arrow>
                        <span>{chipCondicion(permiso.condicion as Condicion)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalle">
                        <IconButton size="small" color="info">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Aprobar">
                        <span>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => aprobarPermiso(permiso.id)}
                            disabled={aprobando}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Rechazar">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDialog(permiso.id, permiso.nombreEmpleado)}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={permisosPendientes.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Rechazar permiso</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Está seguro que desea rechazar el permiso de <strong>{selectedRow?.nombreEmpleado}</strong>?
          </Typography>
          <TextField
            fullWidth
            label="Motivo de rechazo"
            multiline
            rows={3}
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            placeholder="Indique el motivo del rechazo..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={rechazando}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleRechazar} disabled={rechazando}>
            {rechazando ? "Rechazando..." : "Rechazar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
