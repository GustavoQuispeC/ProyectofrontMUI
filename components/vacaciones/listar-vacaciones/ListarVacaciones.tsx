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
  Typography,
} from "@mui/material";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";

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

import { ChipProps } from "@mui/material";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

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

//! Avatar helper
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const avatarPalette = [
  { bg: "#E8EDF5", color: "#2C3E6B" },
  { bg: "#E5F0EC", color: "#1F4D3A" },
  { bg: "#F0EBF5", color: "#4A2D6B" },
  { bg: "#F5EDE8", color: "#6B3020" },
  { bg: "#EBF0F5", color: "#1E3D5C" },
  { bg: "#F5F0E8", color: "#5C4A1E" },
  { bg: "#EDF5ED", color: "#234D23" },
  { bg: "#F5EBF0", color: "#6B1F45" },
];

const avatarStyle = (id: number) => avatarPalette[id % avatarPalette.length];

//! Formateo de fechas
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// =====================================================
// ESTILOS COMPARTIDOS
// =====================================================

const cellBase = {
  fontSize: 13,
  py: "7px",
  px: "12px",
  whiteSpace: "nowrap" as const,
};

const headerCellSx = {
  fontSize: 11,
  fontWeight: 700,
  color: "text.secondary",
  letterSpacing: "0.05em",
  textTransform: "uppercase" as const,
  py: "8px",
  px: "12px",
  whiteSpace: "nowrap" as const,
  bgcolor: "#F0F2F5",
};

//! NIVEL 3 — SOLICITUDES (vacaciones de un período)
interface VacacionesTableProps {
  vacaciones: Vacacion[];
}

function VacacionesTable({ vacaciones }: VacacionesTableProps) {
  return (
    <Box sx={{ bgcolor: "#FAFBFC", borderTop: "1px solid", borderColor: "divider" }}>
      <Table size="small" sx={{ tableLayout: "auto", width: "100%" }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#ECEEF2" }}>
            {/* indent nivel 3 */}
            <TableCell sx={{ ...headerCellSx, width: 64, bgcolor: "#DCDFE6", borderRight: "1px solid #D0D3DA" }} />
            <TableCell sx={{ ...headerCellSx, borderRight: "1px solid", borderColor: "divider" }}>ID</TableCell>
            <TableCell sx={{ ...headerCellSx, borderRight: "1px solid", borderColor: "divider" }}>Solicitud</TableCell>
            <TableCell sx={{ ...headerCellSx, borderRight: "1px solid", borderColor: "divider" }}>Inicio</TableCell>
            <TableCell sx={{ ...headerCellSx, borderRight: "1px solid", borderColor: "divider" }}>Fin</TableCell>
            <TableCell sx={{ ...headerCellSx, textAlign: "center", borderRight: "1px solid", borderColor: "divider" }}>
              Días
            </TableCell>
            <TableCell sx={{ ...headerCellSx, textAlign: "center", borderRight: "1px solid", borderColor: "divider" }}>
              Domingos
            </TableCell>
            <TableCell sx={{ ...headerCellSx, borderRight: "1px solid", borderColor: "divider" }}>
              Observación
            </TableCell>
            <TableCell sx={{ ...headerCellSx, borderRight: "1px solid", borderColor: "divider" }}>
              Aprobado por
            </TableCell>
            <TableCell sx={{ ...headerCellSx }}>Estado</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {vacaciones.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                sx={{ py: 2, textAlign: "center", color: "text.disabled", fontSize: 12, fontStyle: "italic" }}
              >
                Sin solicitudes registradas en este período
              </TableCell>
            </TableRow>
          ) : (
            vacaciones.map((v: Vacacion) => (
              <TableRow
                key={v.vacacionId}
                sx={{
                  "&:hover": { bgcolor: "#F3F4F6" },
                  "& td": { borderBottom: "1px solid #ECEEF1" },
                }}
              >
                {/* indent */}
                <TableCell sx={{ width: 64, p: 0, bgcolor: "#DCDFE6", borderRight: "1px solid #D0D3DA" }} />
                <TableCell sx={{ ...cellBase, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
                  #{v.vacacionId}
                </TableCell>
                <TableCell sx={{ ...cellBase, color: "text.secondary" }}>{formatDate(v.fechaSolicitud)}</TableCell>
                <TableCell sx={{ ...cellBase }}>{formatDate(v.fechaInicio)}</TableCell>
                <TableCell sx={{ ...cellBase }}>{formatDate(v.fechaFin)}</TableCell>
                <TableCell
                  sx={{ ...cellBase, textAlign: "center", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
                >
                  {v.diasCalendario}
                </TableCell>
                <TableCell sx={{ ...cellBase, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                  {v.cantidadDomingos}
                </TableCell>
                <TableCell sx={{ ...cellBase, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {v.observacion || (
                    <Typography component="span" sx={{ color: "text.disabled", fontSize: 12 }}>
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ ...cellBase, color: "text.secondary" }}>
                  {v.aprobadoPor || (
                    <Typography component="span" sx={{ color: "text.disabled", fontSize: 12 }}>
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ ...cellBase }}>
                  <Chip
                    size="small"
                    color={EstadoVacacionColor[v.estado]}
                    label={EstadoVacacionLabel[v.estado]}
                    sx={{ fontSize: 11, height: 20, fontWeight: 600 }}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

//! NIVEL 2 — FILA DE PERÍODO (expandible → solicitudes)
interface PeriodoRowProps {
  periodo: PeriodoVacacional;
  isLast: boolean;
}

function PeriodoRow({ periodo, isLast }: PeriodoRowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          cursor: "pointer",
          bgcolor: open ? "#EEF2FF" : "#F7F8FA",
          "&:hover": { bgcolor: open ? "#E8EDFF" : "#F0F2F6" },
          "& td": {
            borderBottom: isLast && !open ? "none" : "1px solid #E4E7EC",
          },
        }}
      >
        {/* indent nivel 2 */}
        <TableCell sx={{ width: 32, p: 0 }} />

        {/* toggle */}
        <TableCell sx={{ width: 40, px: 0.5, textAlign: "center", borderRight: "1px solid #E4E7EC" }}>
          <IconButton size="small" disableRipple sx={{ p: 0.25, color: "text.secondary" }}>
            {open ? <KeyboardArrowUp sx={{ fontSize: 16 }} /> : <KeyboardArrowDown sx={{ fontSize: 16 }} />}
          </IconButton>
        </TableCell>

        <TableCell
          sx={{
            ...cellBase,
            color: "text.secondary",
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            borderRight: "1px solid #E4E7EC",
          }}
        >
          #{periodo.vacacionSaldoId}
        </TableCell>
        <TableCell sx={{ ...cellBase, borderRight: "1px solid #E4E7EC" }}>
          {formatDate(periodo.periodoInicio)}
        </TableCell>
        <TableCell sx={{ ...cellBase, borderRight: "1px solid #E4E7EC" }}>{formatDate(periodo.periodoFin)}</TableCell>
        <TableCell sx={{ ...cellBase, color: "text.secondary", borderRight: "1px solid #E4E7EC" }}>
          {formatDate(periodo.fechaGeneracion)}
        </TableCell>
        <TableCell
          sx={{
            ...cellBase,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {periodo.diasAsignados}
        </TableCell>
        <TableCell
          sx={{
            ...cellBase,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            color: periodo.diasUsados > 0 ? "#92400E" : "text.secondary",
          }}
        >
          {periodo.diasUsados}
        </TableCell>
        <TableCell
          sx={{
            ...cellBase,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            color: "#065F46",
            fontWeight: 600,
            borderRight: "1px solid #E4E7EC",
          }}
        >
          {periodo.diasDisponibles}
        </TableCell>
        <TableCell
          sx={{
            ...cellBase,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            color: "text.secondary",
            borderRight: "1px solid #E4E7EC",
          }}
        >
          {periodo.cantidadDomingosAcumulados}
        </TableCell>
        <TableCell sx={{ ...cellBase, textAlign: "center", borderRight: "1px solid #E4E7EC" }}>
          <Chip
            size="small"
            color={
              periodo.porcentajeConsumido >= 80 ? "error" : periodo.porcentajeConsumido >= 50 ? "warning" : "success"
            }
            label={`${periodo.porcentajeConsumido}%`}
            sx={{ fontSize: 11, height: 20, fontWeight: 700, minWidth: 46 }}
          />
        </TableCell>
        <TableCell
          sx={{
            ...cellBase,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            color: "text.secondary",
            borderRight: "1px solid #E4E7EC",
          }}
        >
          {periodo.cantidadVacaciones}
        </TableCell>
        <TableCell sx={{ ...cellBase }}>
          <Chip
            size="small"
            color={EstadoPeriodoColor[periodo.estado]}
            label={EstadoPeriodoLabel[periodo.estado]}
            sx={{ fontSize: 11, height: 20, fontWeight: 600 }}
          />
        </TableCell>
      </TableRow>

      {/* Fila de detalle (solicitudes) */}
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

//! NIVEL 1 — FILA DE EMPLEADO (expandible → períodos)
interface RowProps {
  row: ListarEmpleadoVacaciones;
}

function Row({ row }: RowProps) {
  const [open, setOpen] = React.useState(false);
  const palette = avatarStyle(row.empleadoId);

  const consumoColor = row.porcentajeConsumido >= 80 ? "error" : row.porcentajeConsumido >= 50 ? "warning" : "success";

  return (
    <>
      {/* FILA EMPLEADO */}
      <TableRow
        hover
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          cursor: "pointer",
          bgcolor: open ? "#F0F4FF" : "background.paper",
          transition: "background-color 0.12s",
          "& > td": {
            py: "10px",
            borderBottom: open ? "1px solid" : undefined,
            borderColor: "divider",
          },
        }}
      >
        <TableCell width={44} sx={{ pl: 1.5 }}>
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
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: 1.25,
            }}
          >
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
        <TableCell align="center">
          <Chip
            size="small"
            color={consumoColor}
            label={`${row.porcentajeConsumido}%`}
            sx={{ fontSize: 12, height: 22, fontWeight: 700, minWidth: 52 }}
          />
        </TableCell>
      </TableRow>

      {/* DETALLE EXPANDIDO — períodos */}
      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0, borderBottom: open ? "2px solid" : "none", borderColor: "primary.light" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
              {/* Sub-tabla de períodos con su propio header */}
              <Table size="small" sx={{ tableLayout: "auto", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    {/* indent */}
                    <TableCell
                      sx={{ ...headerCellSx, width: 32, bgcolor: "#E0E3E8", borderRight: "1px solid #D0D3DA", p: 0 }}
                    />
                    {/* toggle */}
                    <TableCell sx={{ ...headerCellSx, width: 40, borderRight: "1px solid #D8DBE2" }} />
                    <TableCell sx={{ ...headerCellSx, borderRight: "1px solid #D8DBE2" }}>ID</TableCell>
                    <TableCell sx={{ ...headerCellSx, borderRight: "1px solid #D8DBE2" }}>Per. Inicio</TableCell>
                    <TableCell sx={{ ...headerCellSx, borderRight: "1px solid #D8DBE2" }}>Per. Fin</TableCell>
                    <TableCell sx={{ ...headerCellSx, borderRight: "1px solid #D8DBE2" }}>Generación</TableCell>
                    <TableCell sx={{ ...headerCellSx, textAlign: "center", borderRight: "1px solid #D8DBE2" }}>
                      Asignados
                    </TableCell>
                    <TableCell sx={{ ...headerCellSx, textAlign: "center", borderRight: "1px solid #D8DBE2" }}>
                      Usados
                    </TableCell>
                    <TableCell sx={{ ...headerCellSx, textAlign: "center", borderRight: "1px solid #D8DBE2" }}>
                      Disponibles
                    </TableCell>
                    <TableCell sx={{ ...headerCellSx, textAlign: "center", borderRight: "1px solid #D8DBE2" }}>
                      Domingos
                    </TableCell>
                    <TableCell sx={{ ...headerCellSx, textAlign: "center", borderRight: "1px solid #D8DBE2" }}>
                      Consumo
                    </TableCell>
                    <TableCell sx={{ ...headerCellSx, textAlign: "center", borderRight: "1px solid #D8DBE2" }}>
                      Solicitudes
                    </TableCell>
                    <TableCell sx={{ ...headerCellSx }}>Estado</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.periodosVacacionales.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={13}
                        sx={{ py: 2.5, textAlign: "center", color: "text.disabled", fontSize: 12, fontStyle: "italic" }}
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

//! COMPONENTE PRINCIPAL
export default function ListarVacacionesGenerales() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarVacacionesGenerales) : false;
  const { vacacionesGenerales, loading } = useVacacionesGenerales(canAccess);
  const mounted = useMounted();

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  //! ── Efecto de montaje ──
  if (!mounted) return null;
  //* Validando permiso de acceso
  if (!canAccess) {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
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
            <TableRow
              sx={{
                bgcolor: "#F0F2F5",
                borderBottom: "2px solid",
                borderColor: "divider",
                "& th": {
                  fontSize: 11,
                  fontWeight: 700,
                  color: "text.secondary",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  py: 1.25,
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableCell width={44} />
              <TableCell>Código</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell align="center">Ingreso</TableCell>
              <TableCell align="center">Períodos</TableCell>
              <TableCell align="center">Solicitudes</TableCell>
              <TableCell align="center">Asignados</TableCell>
              <TableCell align="center">Usados</TableCell>
              <TableCell align="center">Disponibles</TableCell>
              <TableCell align="center">Consumo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vacacionesGenerales.map((row) => (
              <Row key={row.empleadoId} row={row} />
            ))}

            {!loading && vacacionesGenerales.length === 0 && (
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
      </TableContainer>
    </Box>
  );
}
