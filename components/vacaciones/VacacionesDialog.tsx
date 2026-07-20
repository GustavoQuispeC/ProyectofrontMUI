"use client";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import { EstadoVacacion, PeriodoVacacional } from "@/features/dashboard/vacaciones/vacaciones.type";
import type { ChipProps } from "@mui/material";
import { formatDate } from "@/features/dashboard/vacaciones/vacaciones.constants";
import { useAprobarVacaciones } from "@/features/dashboard/vacaciones/hooks/useAprobarVacaciones";
import { useCancelarVacacionesAprobadas } from "@/features/dashboard/vacaciones/hooks/useCancelarVacacionesAprobadas";
import { useState } from "react";
import ConfirmarCancelarVacacionDialog from "@/components/vacaciones/ConfirmarCancelarVacacionDialog";
import toast from "react-hot-toast";
//! LABELS, COLORES E ICONOS DE ESTADO DE VACACIÓN
const EstadoVacacionLabel: Record<EstadoVacacion, string> = {
  [EstadoVacacion.Pendiente]: "Pendiente",
  [EstadoVacacion.Aprobado]: "Aprobado",
  [EstadoVacacion.Cancelado]: "Cancelado",
};

const EstadoVacacionColor: Record<EstadoVacacion, ChipProps["color"]> = {
  [EstadoVacacion.Pendiente]: "warning",
  [EstadoVacacion.Aprobado]: "success",
  [EstadoVacacion.Cancelado]: "default",
};

const EstadoVacacionIcon: Record<EstadoVacacion, React.ReactElement> = {
  [EstadoVacacion.Pendiente]: <HourglassEmptyIcon sx={{ fontSize: 14 }} />,
  [EstadoVacacion.Aprobado]: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
  [EstadoVacacion.Cancelado]: <BlockIcon sx={{ fontSize: 14 }} />,
};

const EstadoVacacionPorNumero: Record<number, EstadoVacacion> = {
  1: EstadoVacacion.Pendiente,
  2: EstadoVacacion.Aprobado,
  3: EstadoVacacion.Cancelado,
};

const normalizarEstadoVacacion = (estado: unknown): EstadoVacacion | null => {
  if (typeof estado === "number") return EstadoVacacionPorNumero[estado] ?? null;
  if (typeof estado !== "string") return null;

  const estadoNormalizado = estado.trim().toLowerCase();
  return (
    Object.values(EstadoVacacion).find((item) => item.toLowerCase() === estadoNormalizado) ??
    EstadoVacacionPorNumero[Number(estado)] ??
    null
  );
};

const chipEstadoVacacion = (estado: unknown) => {
  const estadoValido = normalizarEstadoVacacion(estado);

  if (!estadoValido) {
    const label = typeof estado === "string" && estado.trim() ? estado : "Sin estado";
    return <Chip size="small" color="default" label={label} sx={{ fontSize: 11, height: 20, fontWeight: 600 }} />;
  }

  return (
    <Chip
      size="small"
      color={EstadoVacacionColor[estadoValido]}
      icon={EstadoVacacionIcon[estadoValido]}
      label={EstadoVacacionLabel[estadoValido]}
      sx={{ fontSize: 11, height: 20, fontWeight: 600 }}
    />
  );
};

type ModoDialog = "pendientes" | "aprobadas" | "resumen";

//! PROPS
interface VacacionesDialogProps {
  open: boolean;
  onClose: () => void;
  periodo: PeriodoVacacional | null;
  modo: ModoDialog;
}

//! COMPONENTE PRINCIPAL
export default function VacacionesDialog({ open, onClose, periodo, modo }: VacacionesDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { cancelarVacacionAprobada, loading: cancelando } = useCancelarVacacionesAprobadas(
    (mensaje) => {
      toast.success(mensaje ?? "Vacación cancelada exitosamente");
      onClose();
    },
    (mensaje) => {
      toast.error(mensaje);
    },
  );
  const [vacacionIdAcancelar, setVacacionIdAcancelar] = useState<number | null>(null);
  const { aprobarVacacion, loading: aprobando } = useAprobarVacaciones(onClose);
  if (!periodo) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="vacaciones-dialog-title"
      fullWidth
      fullScreen={isMobile}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: isMobile ? "100%" : "75%",
          maxWidth: isMobile ? "100%" : "75%",
        },
      }}
    >
      <DialogTitle id="vacaciones-dialog-title">
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Solicitudes del período</Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            #{periodo.vacacionSaldoId}&nbsp;·&nbsp;
            {formatDate(periodo.periodoInicio)} – {formatDate(periodo.periodoFin)}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: isMobile ? 1.5 : 0 }}>
        {periodo.vacaciones.length === 0 ? (
          <Typography sx={{ py: 4, textAlign: "center", color: "text.disabled", fontSize: 12, fontStyle: "italic" }}>
            Sin solicitudes registradas en este período.
          </Typography>
        ) : isMobile ? (
          /* ── Vista MÓVIL — cards ── */
          <Stack sx={{ gap: 1.5 }}>
            {periodo.vacaciones.map((v) => {
              const estadoValido = normalizarEstadoVacacion(v.estado);
              const cardColor: Record<EstadoVacacion, { bg: string; border: string }> = {
                [EstadoVacacion.Pendiente]: { bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.35)" },
                [EstadoVacacion.Aprobado]: { bg: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.35)" },
                [EstadoVacacion.Cancelado]: { bg: "rgba(107,114,128,0.07)", border: "rgba(107,114,128,0.35)" },
              };
              const colors = estadoValido ? cardColor[estadoValido] : { bg: "transparent", border: "divider" };
              return (
                <Card
                  key={v.vacacionId}
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: colors.border, borderRadius: 2, bgcolor: colors.bg }}
                >
                  <CardContent sx={{ pb: "12px !important" }}>
                    {/* Header card */}
                    <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography
                        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", letterSpacing: "0.05em" }}
                      >
                        #{v.vacacionId}
                      </Typography>
                      {chipEstadoVacacion(v.estado)}
                    </Stack>

                    {/* Fechas */}
                    <Stack sx={{ gap: 0.5, mb: 1 }}>
                      <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary">
                          Solicitud
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#6D28D9" }}>
                          {formatDate(v.fechaSolicitud)}
                        </Typography>
                      </Stack>
                      <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary">
                          Inicio
                        </Typography>
                        <Typography variant="caption">{formatDate(v.fechaInicio)}</Typography>
                      </Stack>
                      <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary">
                          Fin
                        </Typography>
                        <Typography variant="caption">{formatDate(v.fechaFin)}</Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    {/* Días */}
                    <Stack sx={{ flexDirection: "row", gap: 2, mb: 1 }}>
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#15803D" }}>
                          {v.diasCalendario}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Días
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#6D28D9" }}>
                          {v.cantidadDomingos}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Domingos
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Aprobado por */}
                    <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Aprobado por
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: v.aprobadoPor ? "text.primary" : "text.disabled",
                          fontStyle: v.aprobadoPor ? "normal" : "italic",
                        }}
                      >
                        {v.aprobadoPor ?? "—"}
                      </Typography>
                    </Stack>

                    {/* Observación */}
                    {v.observacion && (
                      <Typography
                        variant="caption"
                        sx={{ display: "block", color: "#92400E", wordBreak: "break-word", mt: 0.5 }}
                      >
                        Obs: {v.observacion}
                      </Typography>
                    )}

                    {/* Acciones */}
                    {modo !== "resumen" && (
                      <Stack sx={{ flexDirection: "row", justifyContent: "flex-end", gap: 1, mt: 1 }}>
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
                        )}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        ) : (
          /* ── Vista DESKTOP — tabla ── */
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
                  {modo !== "resumen" && <TableCell>Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {periodo.vacaciones.map((v) => (
                  <TableRow key={v.vacacionId} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", letterSpacing: "0.05em" }}
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
                    <TableCell>{chipEstadoVacacion(v.estado)}</TableCell>
                    {modo !== "resumen" && (
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
                                <ClearIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {modo === "aprobadas" && (
                          <Tooltip title="Cancelar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setVacacionIdAcancelar(v.vacacionId)}
                              disabled={cancelando}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
            cancelarVacacionAprobada(vacacionIdAcancelar);
            setVacacionIdAcancelar(null);
          }
        }}
        loading={cancelando}
      />
    </Dialog>
  );
}
