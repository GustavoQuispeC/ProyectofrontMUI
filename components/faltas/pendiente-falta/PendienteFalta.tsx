"use client";

import { CondicionFalta, Justificacion } from "@/features/dashboard/falta/falta.constants";
import { useFaltasPendientes } from "@/features/dashboard/falta/hooks/useFaltasPendientes";
import { useAprobarFalta } from "@/features/dashboard/falta/hooks/useAprobarFalta";
import { useCancelarFalta } from "@/features/dashboard/falta/hooks/useCancelarFalta";
import { hasPermission } from "@/shared/auth/auth.helper";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";
import { useState } from "react";
import { getAuthUser } from "@/shared/auth/auth.service";
import { permissions } from "@/shared/auth/auth.permissions";
import { formatDate } from "@/shared/utils/date";
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
import Skeleton from "@mui/material/Skeleton";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TablePagination from "@mui/material/TablePagination";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";

const estadoConfig: Record<CondicionFalta, { color: "warning" | "success" | "error"; label: string }> = {
  [CondicionFalta.Pendiente]: { color: "warning", label: "Pendiente" },
  [CondicionFalta.Aprobado]: { color: "success", label: "Aprobado" },
  [CondicionFalta.Cancelado]: { color: "error", label: "Cancelado" },
};

export default function FaltasPendientes() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarFaltasPendientes) : false;
  const puedeAprobar = user ? hasPermission(user.rol, permissions.aprobarFalta) : false;
  const puedeCancelar = user ? hasPermission(user.rol, permissions.cancelarFalta) : false;
  const mounted = useMounted();
  const { faltasPendientes, loading: loadingFaltas } = useFaltasPendientes(canAccess);
  const { aprobarFalta, loading: aprobando } = useAprobarFalta();
  const { cancelarFalta, loading: cancelando } = useCancelarFalta();
  const [page, setPage] = useState(0);
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
  const rowsPerPage = isLargeScreen ? 20 : 10;
  const maxPage = Math.max(0, Math.ceil(faltasPendientes.length / rowsPerPage) - 1);
  const safePage = Math.min(page, maxPage);
  const paginatedRows = faltasPendientes.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{ id: number; nombreEmpleado: string } | null>(null);
  const handleOpenDialog = (id: number, nombreEmpleado: string) => {
    setSelectedRow({ id, nombreEmpleado });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleCancelar = () => {
    if (!selectedRow) return;
    cancelarFalta(selectedRow.id);
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
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <EventBusyIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              FALTAS PENDIENTES
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
              startIcon={<EventBusyIcon />}
              sx={{ height: 44, width: { xs: "100%", sm: "auto" } }}
            >
              Programar
            </Button>
            <Button
              component={Link}
              href="/dashboard/faltas/mensual"
              variant="contained"
              color="success"
              startIcon={<ChecklistIcon />}
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
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : faltasPendientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay faltas pendientes.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((falta, idx) => {
                const isLast = idx === paginatedRows.length - 1;
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
                    <TableCell>{safePage * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                        {falta.nombreEmpleado}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(falta.fechaInicio)}</TableCell>
                    <TableCell>{formatDate(falta.fechaFin)}</TableCell>
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
                      {puedeCancelar && (
                        <Tooltip title="Cancelar falta">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleOpenDialog(falta.id, falta.nombreEmpleado)}
                              disabled={aprobando || cancelando}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
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
          page={safePage}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[rowsPerPage]}
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
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={cancelando}>
            Cerrar
          </Button>
          <Button variant="contained" color="error" onClick={handleCancelar} disabled={cancelando}>
            {cancelando ? "Cancelando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
