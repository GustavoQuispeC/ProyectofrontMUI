"use client";

import * as React from "react";
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Divider,
  Button,
} from "@mui/material";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BlockIcon from "@mui/icons-material/Block";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useVacacionesGenerales } from "@/features/dashboard/vacaciones/hooks/useVacacionesGenerales";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
import { permissions } from "@/shared/auth/auth.permissions";
import {
  EstadoPeriodoVacacional,
  EstadoVacacion,
  ListarEmpleadoVacaciones,
  PeriodoVacacional,
  Vacacion,
} from "@/features/dashboard/vacaciones/vacaciones.type";

import { ChipProps, useTheme, useMediaQuery } from "@mui/material";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import Link from "next/link";
import { useVacacionesPendientes } from "@/features/dashboard/vacaciones/hooks/useVacacionesPendientes";

//! LABELS
export const EstadoVacacionLabel: Record<EstadoVacacion, string> = {
  [EstadoVacacion.Pendiente]: "Pendiente",
  [EstadoVacacion.Aprobado]: "Aprobado",
  [EstadoVacacion.Rechazado]: "Rechazado",
  [EstadoVacacion.Cancelado]: "Cancelado",
};

export const EstadoPeriodoLabel: Record<EstadoPeriodoVacacional, string> = {
  [EstadoPeriodoVacacional.Incompleto]: "Incompleto",
  [EstadoPeriodoVacacional.Completo]: "Completo",
};

//! COLORS
export const EstadoVacacionColor: Record<EstadoVacacion, ChipProps["color"]> = {
  [EstadoVacacion.Pendiente]: "warning",
  [EstadoVacacion.Aprobado]: "success",
  [EstadoVacacion.Rechazado]: "error",
  [EstadoVacacion.Cancelado]: "default",
};

export const EstadoPeriodoColor: Record<EstadoPeriodoVacacional, ChipProps["color"]> = {
  [EstadoPeriodoVacacional.Incompleto]: "warning",
  [EstadoPeriodoVacacional.Completo]: "success",
};

//! Icono según estado de vacacion
const EstadoVacacionIcon: Record<EstadoVacacion, React.ReactElement> = {
  [EstadoVacacion.Pendiente]: <HourglassEmptyIcon sx={{ fontSize: 14 }} />,
  [EstadoVacacion.Aprobado]: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
  [EstadoVacacion.Rechazado]: <CancelOutlinedIcon sx={{ fontSize: 14 }} />,
  [EstadoVacacion.Cancelado]: <BlockIcon sx={{ fontSize: 14 }} />,
};

//! Paleta de borde izquierdo según estado
const EstadoVacacionBorderColor: Record<EstadoVacacion, string> = {
  [EstadoVacacion.Pendiente]: "#F59E0B",
  [EstadoVacacion.Aprobado]: "#10B981",
  [EstadoVacacion.Rechazado]: "#EF4444",
  [EstadoVacacion.Cancelado]: "#9CA3AF",
};

//! Avatar helper
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const avatarPalette = [
  { bg: "#2458da", color: "#ffffff" },
  { bg: "#15a167", color: "#ffffff" },
  { bg: "#621cb1", color: "#ffffff" },
  { bg: "#842910", color: "#ffffff" },
  { bg: "#125393", color: "#ffffff" },
  { bg: "#7e6014", color: "#ffffff" },
  { bg: "#136413", color: "#ffffff" },
  { bg: "#6a0c3b", color: "#ffffff" },
];

const avatarStyle = (id: number) => avatarPalette[id % avatarPalette.length];

//! Formateo de fechas
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// ─────────────────────────────────────────────────────────────────────────────
//! NIVEL 3 — TARJETA DE SOLICITUD
// ─────────────────────────────────────────────────────────────────────────────
interface VacacionCardProps {
  vacacion: Vacacion;
}

function VacacionCard({ vacacion: v }: VacacionCardProps) {
  const borderColor = EstadoVacacionBorderColor[v.estado];

  return (
    <Box
      sx={{
        borderRadius: "6px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderLeftColor: borderColor,
        borderLeftWidth: "3px",
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
        transition: "box-shadow 0.15s",
        "&:hover": {
          boxShadow: "0 3px 8px 0 rgba(0,0,0,0.09)",
        },
      }}
    >
      {/* Cabecera: ID + Estado */}
      <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", letterSpacing: "0.06em" }}>
          #{v.vacacionId}
        </Typography>
        <Chip
          size="small"
          color={EstadoVacacionColor[v.estado]}
          icon={EstadoVacacionIcon[v.estado]}
          label={EstadoVacacionLabel[v.estado]}
          sx={{ fontSize: 11, height: 20, fontWeight: 600 }}
        />
      </Stack>

      <Divider sx={{ borderStyle: "dashed" }} />

      {/* Fechas */}
      <Stack sx={{ flexDirection: "row", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 12, color: "text.disabled" }} />
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Solicitud:</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{formatDate(v.fechaSolicitud)}</Typography>
        </Stack>
        <Box
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: "4px",
            bgcolor: "#EFF6FF",
            border: "1px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 11, color: "#1D4ED8", fontWeight: 500 }}>{formatDate(v.fechaInicio)}</Typography>
          <Typography sx={{ fontSize: 11, color: "#93C5FD" }}>→</Typography>
          <Typography sx={{ fontSize: 11, color: "#1D4ED8", fontWeight: 500 }}>{formatDate(v.fechaFin)}</Typography>
        </Box>
      </Stack>

      {/* Métricas */}
      <Stack sx={{ flexDirection: "row", gap: 1 }}>
        <Box
          sx={{
            flex: 1,
            bgcolor: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "4px",
            px: 1,
            py: 0.5,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#15803D", lineHeight: 1 }}>
            {v.diasCalendario}
          </Typography>
          <Typography sx={{ fontSize: 10, color: "#4ADE80", mt: 0.25 }}>días</Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            bgcolor: "#F5F3FF",
            border: "1px solid #DDD6FE",
            borderRadius: "4px",
            px: 1,
            py: 0.5,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#6D28D9", lineHeight: 1 }}>
            {v.cantidadDomingos}
          </Typography>
          <Typography sx={{ fontSize: 10, color: "#A78BFA", mt: 0.25 }}>domingos</Typography>
        </Box>
      </Stack>

      {/* Aprobado por */}
      {v.aprobadoPor && (
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
          <PersonOutlineOutlinedIcon sx={{ fontSize: 12, color: "text.disabled" }} />
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Aprobado por:</Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{v.aprobadoPor}</Typography>
        </Stack>
      )}

      {/* Observación */}
      {v.observacion && (
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 0.5,
            bgcolor: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: "4px",
            px: 1,
            py: 0.5,
          }}
        >
          <CommentOutlinedIcon sx={{ fontSize: 12, color: "#D97706", mt: 0.15 }} />
          <Typography sx={{ fontSize: 11, color: "#92400E" }}>{v.observacion}</Typography>
        </Stack>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//! NIVEL 3 — GRILLA DE TARJETAS
// ─────────────────────────────────────────────────────────────────────────────
interface VacacionesTableProps {
  vacaciones: Vacacion[];
}

function VacacionesTable({ vacaciones }: VacacionesTableProps) {
  if (vacaciones.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: "#2565a5",
          borderTop: "1px solid",
          borderColor: "divider",
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 12, color: "text.disabled", fontStyle: "italic" }}>
          Sin solicitudes registradas en este período
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#e5e2f6",
        borderTop: "1px solid",
        borderColor: "divider",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 1.5,
        }}
      >
        {vacaciones.map((v) => (
          <VacacionCard key={v.vacacionId} vacacion={v} />
        ))}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//! NIVEL 2 — FILA DE PERÍODO
// ─────────────────────────────────────────────────────────────────────────────
interface PeriodoRowProps {
  periodo: PeriodoVacacional;
  isLast: boolean;
}

function PeriodoRow({ periodo, isLast }: PeriodoRowProps) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <>
      <TableRow
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          cursor: "pointer",
          bgcolor: open
            ? isDarkMode
              ? "rgba(81, 91, 107, 0.35)"
              : "rgba(154, 161, 184, 0.2)"
            : isDarkMode
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.05)",
          "&:hover": {
            bgcolor: open
              ? isDarkMode
                ? "rgba(113, 126, 147, 0.25)"
                : "rgba(232, 237, 255, 0.2)"
              : isDarkMode
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)",
          },
          "& td": {
            borderBottom: isLast && !open ? "none" : "1px solid rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        {/* indent nivel 2 */}
        <TableCell />

        {/* toggle */}
        <TableCell sx={{ px: 0.5, textAlign: "center" }}>
          <IconButton size="small" disableRipple>
            {open ? <KeyboardArrowUp sx={{ fontSize: 16 }} /> : <KeyboardArrowDown sx={{ fontSize: 16 }} />}
          </IconButton>
        </TableCell>

        <TableCell sx={{ fontWeight: 600 }}>#{periodo.vacacionSaldoId}</TableCell>
        <TableCell>{formatDate(periodo.periodoInicio)}</TableCell>
        <TableCell>{formatDate(periodo.periodoFin)}</TableCell>
        <TableCell>{formatDate(periodo.fechaGeneracion)}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{periodo.diasAsignados}</TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            color: periodo.diasUsados > 0 ? "#92400E" : "text.secondary",
          }}
        >
          {periodo.diasUsados}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            color: isDarkMode ? theme.palette.success.light : "#065F46",
            fontWeight: 600,
          }}
        >
          {periodo.diasDisponibles}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>{periodo.cantidadDomingosAcumulados}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          <Chip
            size="small"
            color={
              periodo.porcentajeConsumido >= 80 ? "error" : periodo.porcentajeConsumido >= 50 ? "warning" : "success"
            }
            label={`${periodo.porcentajeConsumido}%`}
            sx={{ fontSize: 11, height: 20, fontWeight: 700, minWidth: 46 }}
          />
        </TableCell>
        <TableCell sx={{ textAlign: "center", color: "text.secondary" }}>{periodo.cantidadVacaciones}</TableCell>
        <TableCell>
          <Chip
            size="small"
            color={EstadoPeriodoColor[periodo.estado]}
            label={EstadoPeriodoLabel[periodo.estado]}
            sx={{ fontSize: 11, height: 20, fontWeight: 600 }}
          />
        </TableCell>
      </TableRow>

      {/* Fila de detalle — tarjetas */}
      <TableRow>
        <TableCell
          colSpan={13}
          sx={{
            p: 0,
            borderBottom: isLast && !open ? "none" : "1px solid #E4E7EC",
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <VacacionesTable vacaciones={periodo.vacaciones} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//! NIVEL 1 — FILA DE EMPLEADO
// ─────────────────────────────────────────────────────────────────────────────
interface RowProps {
  row: ListarEmpleadoVacaciones;
}

function Row({ row }: RowProps) {
  const [open, setOpen] = React.useState(false);
  const palette = avatarStyle(row.empleadoId);

  return (
    <>
      <TableRow
        hover
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          cursor: "pointer",
          bgcolor: open ? "rgba(94, 125, 227, 0.2)" : "rgba(0, 0, 0, 0.05)",
          "&:hover": { bgcolor: open ? "rgba(232, 237, 255, 0.2)" : "rgba(0, 0, 0, 0.08)" },
          transition: "background-color 0.12s",
          "& > td": {
            py: "10px",
            borderBottom: open ? "1px solid" : undefined,
            borderColor: "divider",
          },
        }}
      >
        <TableCell sx={{ pl: 1.5 }}>
          <IconButton size="small" disableRipple sx={{ color: "text.secondary" }}>
            {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "text.secondary",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.05em",
            }}
          >
            {row.codigoEmpleado}
          </Typography>
        </TableCell>

        <TableCell>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.25 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: 10,
                fontWeight: 700,
                bgcolor: palette.bg,
                color: palette.color,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {getInitials(row.nombreCompleto)}
            </Avatar>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{row.nombreCompleto}</Typography>
          </Stack>
        </TableCell>

        <TableCell align="center">
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{formatDate(row.fechaIngreso)}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontSize: 13 }}>{row.cantidadPeriodos}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontSize: 13 }}>{row.cantidadVacaciones}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{row.diasTotalesAsignados}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography
            sx={{
              fontSize: 13,
              fontVariantNumeric: "tabular-nums",
              color: row.diasTotalesUsados > 0 ? "warning.dark" : "text.secondary",
            }}
          >
            {row.diasTotalesUsados}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontSize: 13, fontVariantNumeric: "tabular-nums", color: "success.dark", fontWeight: 600 }}>
            {row.diasTotalesDisponibles}
          </Typography>
        </TableCell>
      </TableRow>

      {/* DETALLE EXPANDIDO — períodos */}
      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0, borderBottom: open ? "2px solid" : "none", borderColor: "primary.light" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
              <Table size="small" sx={{ tableLayout: "auto", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell sx={{ borderRight: "1px solid #D8DBE2" }}>ID</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #D8DBE2" }}>Per. Inicio</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #D8DBE2" }}>Per. Fin</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #D8DBE2" }}>Generación</TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #D8DBE2" }}>Asignados</TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #D8DBE2" }}>Usados</TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #D8DBE2" }}>Disponibles</TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #D8DBE2" }}>Total Dom.</TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #D8DBE2" }}>Consumo</TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #D8DBE2" }}>Solicitudes</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.periodosVacacionales.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={13}
                        sx={{
                          py: 2.5,
                          textAlign: "center",
                          color: "text.disabled",
                          fontSize: 12,
                          fontStyle: "italic",
                        }}
                      >
                        Sin períodos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    row.periodosVacacionales.map((periodo, idx) => (
                      <PeriodoRow
                        key={periodo.vacacionSaldoId}
                        periodo={periodo}
                        isLast={idx === row.periodosVacacionales.length - 1}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//! COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function ListarVacacionesPendientes() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarVacacionesPendientes) : false;
  const { vacacionesPendientes, loading } = useVacacionesPendientes(canAccess);
  const mounted = useMounted();

  const theme = useTheme();
  // xl = 1536px en MUI — pantallas grandes
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const rowsPerPage = isLargeScreen ? 20 : 10;

  const [page, setPage] = React.useState(0);

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  // Si el breakpoint cambia y la página actual queda fuera de rango, se corrige sin efecto
  const maxPage = Math.max(0, Math.ceil(vacacionesPendientes.length / rowsPerPage) - 1);
  const safePage = Math.min(page, maxPage);

  const paginatedRows = vacacionesPendientes.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          component={Link}
          href="/dashboard/vacaciones/registrar"
          variant="contained"
          startIcon={<GroupAddIcon />}
        >
          Gestionar Vacaciones
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
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "6px",
          border: "1px solid",
          borderColor: "divider",
          overflowX: "auto",
        }}
      >
        <Table sx={{ tableLayout: "auto", minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell width={44} />
              <TableCell>Código</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell align="center">Ingreso</TableCell>
              <TableCell align="center">Períodos</TableCell>
              <TableCell align="center">Solicitudes</TableCell>
              <TableCell align="center">Asignados</TableCell>
              <TableCell align="center">Usados</TableCell>
              <TableCell align="center">Disponibles</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row) => (
              <Row key={row.empleadoId} row={row} />
            ))}

            {!loading && vacacionesPendientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <Box sx={{ py: 6, textAlign: "center" }}>
                    <Typography sx={{ fontSize: 14, color: "text.disabled" }}>No se encontraron registros</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {vacacionesPendientes.length > 0 && (
          <TablePagination
            component="div"
            count={vacacionesPendientes.length}
            page={safePage}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
            labelRowsPerPage="Filas por página:"
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              "& .MuiTablePagination-toolbar": { minHeight: 44 },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: 13,
              },
            }}
          />
        )}
      </TableContainer>
    </Box>
  );
}
