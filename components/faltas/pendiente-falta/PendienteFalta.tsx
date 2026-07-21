"use client";

import { CondicionFalta, Justificacion } from "@/features/dashboard/falta/falta.constants";
import { useFaltasPendientes } from "@/features/dashboard/falta/hooks/useFaltasPendientes";
import { useAprobarFalta } from "@/features/dashboard/falta/hooks/useAprobarFalta";
import { hasPermission } from "@/shared/auth/auth.helper";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";
import { useState } from "react";
import { getAuthUser } from "@/shared/auth/auth.service";
import { permissions } from "@/shared/auth/auth.permissions";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Tooltip from "@mui/material/Tooltip";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import AssessmentIcon from "@mui/icons-material/Assessment";

const estadoConfig: Record<CondicionFalta, { color: "warning" | "success" | "error"; label: string }> = {
  [CondicionFalta.Pendiente]: { color: "warning", label: "Pendiente" },
  [CondicionFalta.Aprobado]: { color: "success", label: "Aprobado" },
  [CondicionFalta.Cancelado]: { color: "error", label: "Cancelado" },
};

export default function FaltasPendientes() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarFaltasPendientes) : false;
  const puedeAprobar = user ? hasPermission(user.rol, permissions.aprobarFalta) : false;
  const mounted = useMounted(); //? controla el estado de montaje
  const { faltasPendientes, loading: loadingFaltas } = useFaltasPendientes(canAccess);
  const { aprobarFalta, loading: aprobando } = useAprobarFalta();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{ id: number; nombreEmpleado: string } | null>(null);
  const handleOpenDialog = (id: number, nombreEmpleado: string) => {
    setSelectedRow({ id, nombreEmpleado });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    //setMotivoRechazo("");
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
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <EventBusyIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Faltas pendientes
            </Typography>
          </Stack>
        </Grid>

        {/* Botones */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1, justifyContent: "flex-end" }}>
            <Button
              component={Link}
              href="/dashboard/faltas/registrar"
              variant="contained"
              startIcon={<GroupAddIcon />}
              sx={{ height: 44, width: { xs: "100%", sm: "auto" } }}
            >
              Gestionar Faltas
            </Button>
            <Button
              component={Link}
              href="/dashboard/faltas/mensual"
              variant="contained"
              color="success"
              startIcon={<AssessmentIcon />}
              sx={{ height: 44, width: { xs: "100%", sm: "auto" } }}
            >
              Aprobadas
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <TableContainer component={Paper} variant="outlined" sx={{ width: "100%" }}>
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "action.hover" }}>
              {["N°", "Empleado", "Inicio", "Fin", "Justificada", "Observación", "Estado", "Acciones"].map((col) => (
                <TableCell key={col} align={col === "Acciones" ? "center" : "left"}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {col}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingFaltas ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cargando...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : faltasPendientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay faltas pendientes.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              faltasPendientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((falta, idx) => {
                const isLast =
                  idx === faltasPendientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length - 1;
                return (
                  <TableRow
                    key={falta.id}
                    hover
                    sx={{
                      "& td": {
                        borderBottom: isLast ? "none" : "1px solid",
                        borderColor: "divider",
                      },
                    }}
                  >
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                        {falta.nombreEmpleado}
                      </Typography>
                    </TableCell>
                    <TableCell>{falta.fechaInicio}</TableCell>
                    <TableCell>{falta.fechaFin}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={falta.justifica === Justificacion.Si ? "success" : "default"}
                        label={falta.justifica === Justificacion.Si ? "Sí" : "No"}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>
                        {falta.observacion || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const estado = estadoConfig[falta.condicion];
                        return <Chip size="small" color={estado.color} label={estado.label} />;
                      })()}
                    </TableCell>
                    <TableCell align="center">
                      {puedeAprobar && (
                        <Tooltip title="Aprobar falta">
                          <span>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => aprobarFalta(falta.id)}
                              disabled={aprobando}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      <Tooltip title="Cancelar falta">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDialog(falta.id, falta.nombreEmpleado)}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
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
          count={faltasPendientes.length}
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
        <DialogTitle>Cancelar falta</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ¿Está seguro que desea cancelar la falta de <strong>{selectedRow?.nombreEmpleado}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            La acción de cancelación está pendiente de implementación.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ minWidth: 120, height: 44 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
