import { usePermisosPendientes } from "@/features/dashboard/permiso/hooks/usePermisosPendientes";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { getAuthUser } from "@/shared/auth/auth.service";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";
import { useState } from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useCancelarPermiso } from "@/features/dashboard/permiso/hooks/useCancelarPermiso";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useAprobarPermiso } from "@/features/dashboard/permiso/hooks/useAprobarPermiso";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { chipCondicion } from "@/features/dashboard/permiso/permiso.ui";
import { formatDate } from "@/shared/utils/date";
import { formatTime } from "@/shared/utils/time";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

export default function ListarPermisosPendientes() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarPermisosPendientes) : false;
  const canAprobar = user ? hasPermission(user.rol, permissions.aprobarPermiso) : false;
  const canCancelar = user ? hasPermission(user.rol, permissions.cancelarPermiso) : false;
  const mounted = useMounted();
  const { permisosPendientes, loading: loadingPermisos } = usePermisosPendientes(canAccess);
  const [page, setPage] = useState(0);
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
  const rowsPerPage = isLargeScreen ? 20 : 10;
  const maxPage = Math.max(0, Math.ceil(permisosPendientes.length / rowsPerPage) - 1);
  const safePage = Math.min(page, maxPage);
  const paginatedRows = permisosPendientes.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
  const { cancelarPermiso, loading: cancelando } = useCancelarPermiso();
  const { aprobarPermiso, loading: aprobando } = useAprobarPermiso();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{ id: number; nombreEmpleado: string } | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  const handleOpenDialog = (id: number, nombreEmpleado: string) => {
    setSelectedRow({ id, nombreEmpleado });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    setMotivoCancelacion("");
  };

  //! guarda la cancelación del permiso
  const handleCancelar = () => {
    if (!selectedRow) return;
    cancelarPermiso({ id: selectedRow.id, motivoCancelacion: motivoCancelacion });
    handleCloseDialog();
  };

  //! controla el renderizado
  if (!mounted) return null;

  if (!canAccess) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Título */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <AccessAlarmIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              PERMISOS PENDIENTES
            </Typography>
          </Stack>
        </Grid>

        {/* Botones */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            sx={{
              flexDirection: { xs: "column", md: "row" },
              gap: 1,
              justifyContent: { xs: "stretch", md: "flex-end" },
              alignItems: "stretch",
            }}
          >
            <Button
              component={Link}
              href="/dashboard/permisos/registrar"
              variant="contained"
              startIcon={<AccessAlarmIcon />}
            >
              Programar
            </Button>
            <Button
              component={Link}
              href="/dashboard/permisos/mensual"
              variant="contained"
              color="success"
              startIcon={<ChecklistIcon />}
            >
              Aprobados
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <TableContainer component={Paper} variant="outlined" sx={{ width: "100%" }}>
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e4e2e2" }}>
              {["N°", "EMPLEADO", "FECHA", "HORARIO", "DURACIÓN", "MOTIVO", "LUGAR", "ESTADO", "ACCIONES"].map(
                (col) => (
                  <TableCell key={col} align={col === "ACCIONES" ? "center" : "left"}>
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
              paginatedRows.map((permiso, idx) => (
                <TableRow key={permiso.id} hover>
                  <TableCell>{safePage * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                      {permiso.nombreEmpleado}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 100 }}>
                      {formatDate(permiso.fecha)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 100 }}>
                      {formatTime(permiso.horaInicio)} - {formatTime(permiso.horaFin)}
                    </Typography>
                  </TableCell>
                  {/*permiso.duracionMin en lugar de permisosPendientes.duracionMin */}
                  <TableCell>{`${Math.floor(permiso.duracionMin / 60)}h ${permiso.duracionMin % 60}m`}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>
                      {permiso.motivo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                      {permiso.lugar}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={permiso.motivoCancelacion || ""} arrow>
                      <span>{chipCondicion(permiso.condicion)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {canAprobar && (
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
                    )}
                    {canCancelar && (
                      <Tooltip title="Cancelar">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDialog(permiso.id, permiso.nombreEmpleado)}
                            disabled={cancelando}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={permisosPendientes.length}
          page={safePage}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[rowsPerPage]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Cancelar permiso</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Está seguro que desea cancelar el permiso de <strong>{selectedRow?.nombreEmpleado}</strong>?
          </Typography>
          <TextField
            fullWidth
            label="Motivo de cancelación"
            multiline
            rows={3}
            value={motivoCancelacion}
            onChange={(e) => setMotivoCancelacion(e.target.value)}
            placeholder="Indique el motivo de la cancelación..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={cancelando}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleCancelar} disabled={cancelando}>
            {cancelando ? "Cancelando..." : "Cancelar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
