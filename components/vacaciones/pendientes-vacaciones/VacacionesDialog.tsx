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

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// ─── Props ────────────────────────────────────────────────────────────────────
interface VacacionesDialogProps {
  open: boolean;
  onClose: () => void;
  periodo: PeriodoVacacional | null;
}

export default function VacacionesDialog({ open, onClose, periodo }: VacacionesDialogProps) {
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
                <TableCell>F. Solicitud</TableCell>
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
                    colSpan={9}
                    sx={{ py: 4, textAlign: "center", color: "text.disabled", fontSize: 12, fontStyle: "italic" }}
                  >
                    Sin solicitudes registradas en este período.
                  </TableCell>
                </TableRow>
              ) : (
                periodo.vacaciones.map((v) => (
                  <TableRow key={v.vacacionId} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", letterSpacing: "0.05em" }}
                      >
                        #{v.vacacionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>{formatDate(v.fechaSolicitud)}</Typography>
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
                      <Tooltip title="Aprobar">
                        <IconButton size="small" color="success">
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancelar">
                        <IconButton size="small" color="error">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
    </Dialog>
  );
}
