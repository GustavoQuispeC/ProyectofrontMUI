"use client";

import * as React from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import { EstadoVacacion, PeriodoVacacional } from "@/features/dashboard/vacaciones/vacaciones.type";
import { ChipProps } from "@mui/material";
import { formatDate } from "@/features/dashboard/vacaciones/vacaciones.constants";
import { useAprobarVacaciones } from "@/features/dashboard/vacaciones/hooks/useAprobarVacaciones";
import { useCancelarVacaciones } from "@/features/dashboard/vacaciones/hooks/useCancelarVacaciones";
import { useState } from "react";
import ConfirmarCancelarVacacionDialog from "@/components/vacaciones/ConfirmarCancelarVacacionDialog";
// ─── Labels / Colors / Icons ─────────────────────────────────────────────────
const EstadoVacacionLabel: Record<EstadoVacacion, string> = {
  [EstadoVacacion.Pendiente]: "Pendiente",
  [EstadoVacacion.Aprobado]: "Aprobado",
  [EstadoVacacion.Rechazado]: "Rechazado",
  [EstadoVacacion.Cancelado]: "Cancelado",
};

const EstadoVacacionColor: Record<EstadoVacacion, ChipProps["color"]> = {
  [EstadoVacacion.Pendiente]: "warning",
  [EstadoVacacion.Aprobado]: "success",
  [EstadoVacacion.Rechazado]: "error",
  [EstadoVacacion.Cancelado]: "default",
};

const EstadoVacacionIcon: Record<EstadoVacacion, React.ReactElement> = {
  [EstadoVacacion.Pendiente]: <HourglassEmptyIcon sx={{ fontSize: 14 }} />,
  [EstadoVacacion.Aprobado]: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
  [EstadoVacacion.Rechazado]: <CancelOutlinedIcon sx={{ fontSize: 14 }} />,
  [EstadoVacacion.Cancelado]: <BlockIcon sx={{ fontSize: 14 }} />,
};

type ModoDialog = "pendientes" | "aprobadas";

// ─── Props ────────────────────────────────────────────────────────────────────
interface VacacionesDialogProps {
  open: boolean;
  onClose: () => void;
  periodo: PeriodoVacacional | null;
  modo: ModoDialog;
}

export default function VacacionesDialog({ open, onClose, periodo, modo }: VacacionesDialogProps) {
  const { cancelarVacacion, loading: cancelando } = useCancelarVacaciones(onClose);
  const [vacacionIdAcancelar, setVacacionIdAcancelar] = useState<number | null>(null);
  const { aprobarVacacion, loading: aprobando } = useAprobarVacaciones(onClose);
  if (!periodo) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="vacaciones-dialog-title"
      fullWidth
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: "75%",
          maxWidth: "75%",
        },
      }}
    >
      <DialogTitle id="vacaciones-dialog-title">
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Solicitudes del período</Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            #{periodo.vacacionSaldoId}&nbsp;·&nbsp;{formatDate(periodo.periodoInicio)} –{" "}
            {formatDate(periodo.periodoFin)}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <TableContainer>
          <Table size="small" sx={{ tableLayout: "auto", minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>F. Solicitud</TableCell>
                <TableCell>F. Inicio</TableCell>
                <TableCell>F. Fin</TableCell>
                <TableCell align="center">Días</TableCell>
                <TableCell align="center">Domingos</TableCell>
                <TableCell>Aprobado por</TableCell>
                <TableCell>Observación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {periodo.vacaciones.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    sx={{
                      py: 4,
                      textAlign: "center",
                      color: "text.disabled",
                      fontSize: 12,
                      fontStyle: "italic",
                    }}
                  >
                    Sin solicitudes registradas en este período.
                  </TableCell>
                </TableRow>
              ) : (
                periodo.vacaciones.map((v) => (
                  <TableRow key={v.vacacionId} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "text.secondary",
                          letterSpacing: "0.05em",
                        }}
                      >
                        #{v.vacacionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#6D28D9" }}>
                        {formatDate(v.fechaSolicitud)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>{formatDate(v.fechaInicio)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>{formatDate(v.fechaFin)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#15803D" }}>
                        {v.diasCalendario}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13, color: "#6D28D9" }}>{v.cantidadDomingos}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: v.aprobadoPor ? "text.primary" : "text.disabled",
                          fontStyle: v.aprobadoPor ? "normal" : "italic",
                        }}
                      >
                        {v.aprobadoPor ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: v.observacion ? "#92400E" : "text.disabled",
                          fontStyle: v.observacion ? "normal" : "italic",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {v.observacion ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={EstadoVacacionColor[v.estado]}
                        icon={EstadoVacacionIcon[v.estado]}
                        label={EstadoVacacionLabel[v.estado]}
                        sx={{ fontSize: 11, height: 20, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {modo === "pendientes" && (
                        <>
                          <Tooltip title="Aprobar">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => aprobarVacacion(v.vacacionId)}
                              disabled={aprobando}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar">
                            <IconButton size="small" color="error">
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rechazar">
                            <IconButton size="small" color="error">
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {modo === "aprobadas" && (
                        <>
                          <Tooltip title="Cancelar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setVacacionIdAcancelar(v.vacacionId)}
                              disabled={cancelando}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button variant="outlined" size="small" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
      <ConfirmarCancelarVacacionDialog
        open={vacacionIdAcancelar !== null}
        onClose={() => setVacacionIdAcancelar(null)}
        onConfirm={() => {
          if (vacacionIdAcancelar !== null) {
            cancelarVacacion(vacacionIdAcancelar);
            setVacacionIdAcancelar(null);
          }
        }}
        loading={cancelando}
      />
    </Dialog>
  );
}
