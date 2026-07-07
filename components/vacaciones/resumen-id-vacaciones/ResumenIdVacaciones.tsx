"use client";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
} from "@mui/material";
import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VacacionesDialog from "@/components/vacaciones/VacacionesDialog";
import { useVacacionesIdResumen } from "@/features/dashboard/vacaciones/hooks/useVacacionesIdResumen";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
import { permissions } from "@/shared/auth/auth.permissions";
import { PeriodoVacacional } from "@/features/dashboard/vacaciones/vacaciones.type";
import { useTheme, useMediaQuery } from "@mui/material";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import {
  avatarStyle,
  EstadoPeriodoColor,
  EstadoPeriodoLabel,
  formatDate,
  getInitials,
} from "@/features/dashboard/vacaciones/vacaciones.constants";

// ─────────────────────────────────────────────────────────────────────────────
//! CARD DE PERÍODO — Vista móvil
// ─────────────────────────────────────────────────────────────────────────────
function PeriodoCard({
  periodo,
  onVerDetalle,
}: {
  periodo: PeriodoVacacional;
  onVerDetalle: (p: PeriodoVacacional) => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const progreso = Math.min(periodo.porcentajeAcumulado, 100);
  const colorProgreso =
    progreso >= 80
      ? theme.palette.error.main
      : progreso >= 50
        ? theme.palette.warning.main
        : theme.palette.success.main;

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        mb: 1.5,
      }}
    >
      <CardContent sx={{ pb: "12px !important" }}>
        {/* Header período */}
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon fontSize="small" color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Período #{periodo.vacacionSaldoId}
            </Typography>
          </Stack>
          <Chip
            size="small"
            color={EstadoPeriodoColor[periodo.estado]}
            label={EstadoPeriodoLabel[periodo.estado]}
            sx={{ fontSize: 11, height: 20, fontWeight: 600 }}
          />
        </Stack>

        {/* Fechas */}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          {formatDate(periodo.periodoInicio)} — {formatDate(periodo.periodoFin)}
        </Typography>

        {/* Días */}
        <Grid container spacing={1} sx={{ mb: 1.5 }}>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                borderRadius: 1.5,
                bgcolor: isDark ? "rgba(59,130,246,0.12)" : "#EFF6FF",
                border: "1px solid",
                borderColor: isDark ? "rgba(59,130,246,0.3)" : "#BFDBFE",
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: isDark ? "#93C5FD" : "#1D4ED8" }}>
                {periodo.diasAcumulados}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Acumulados
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                borderRadius: 1.5,
                bgcolor: isDark ? "rgba(245,158,11,0.12)" : "#FFFBEB",
                border: "1px solid",
                borderColor: isDark ? "rgba(245,158,11,0.3)" : "#FDE68A",
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: isDark ? "#FCD34D" : "#92400E" }}>
                {periodo.diasUsados}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Usados
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                borderRadius: 1.5,
                bgcolor: isDark ? "rgba(16,185,129,0.12)" : "#ECFDF5",
                border: "1px solid",
                borderColor: isDark ? "rgba(16,185,129,0.3)" : "#A7F3D0",
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: isDark ? "#6EE7B7" : "#065F46" }}>
                {periodo.diasDisponibles}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Disponibles
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Progreso */}
        <Stack sx={{ gap: 0.5 }}>
          <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Progreso Acumulado
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colorProgreso }}>
              {periodo.porcentajeAcumulado}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progreso}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
              "& .MuiLinearProgress-bar": { bgcolor: colorProgreso, borderRadius: 3 },
            }}
          />
        </Stack>

        {/* Footer */}
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
          <Stack sx={{ flexDirection: "row", gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Solicitudes: <strong>{periodo.cantidadVacaciones}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Domingos: <strong>{periodo.cantidadDomingosAcumulados}</strong>
            </Typography>
          </Stack>
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
            onClick={() => onVerDetalle(periodo)}
            sx={{ fontSize: 11, py: 0.25, px: 1 }}
          >
            Ver detalle
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//! FILA DE PERÍODO — Vista desktop
// ─────────────────────────────────────────────────────────────────────────────
function PeriodoRow({
  periodo,
  isLast,
  onVerDetalle,
}: {
  periodo: PeriodoVacacional;
  isLast: boolean;
  onVerDetalle: (p: PeriodoVacacional) => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <TableRow
      sx={{
        bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
        "& td": { borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.08)" },
      }}
    >
      <TableCell sx={{ fontWeight: 600 }}>#{periodo.vacacionSaldoId}</TableCell>
      <TableCell>{formatDate(periodo.periodoInicio)}</TableCell>
      <TableCell>{formatDate(periodo.periodoFin)}</TableCell>
      <TableCell align="center" sx={{ color: isDark ? "#93C5FD" : "#1D4ED8", fontWeight: 700 }}>
        {periodo.diasAcumulados}
      </TableCell>
      <TableCell align="center" sx={{ color: periodo.diasUsados > 0 ? "#92400E" : "text.secondary" }}>
        {periodo.diasUsados}
      </TableCell>
      <TableCell align="center" sx={{ color: isDark ? "#6EE7B7" : "#065F46", fontWeight: 700 }}>
        {periodo.diasDisponibles}
      </TableCell>
      <TableCell align="center">{periodo.cantidadDomingosAcumulados}</TableCell>
      <TableCell align="center">
        <Chip
          size="small"
          color={
            periodo.porcentajeAcumulado >= 80 ? "error" : periodo.porcentajeAcumulado >= 50 ? "warning" : "success"
          }
          label={`${periodo.porcentajeAcumulado}%`}
          sx={{ fontSize: 11, height: 20, fontWeight: 700, minWidth: 46 }}
        />
      </TableCell>
      <TableCell align="center" sx={{ color: "text.secondary" }}>
        {periodo.cantidadVacaciones}
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          color={EstadoPeriodoColor[periodo.estado]}
          label={EstadoPeriodoLabel[periodo.estado]}
          sx={{ fontSize: 11, height: 20, fontWeight: 600 }}
        />
      </TableCell>
      <TableCell align="center">
        <Tooltip title="Ver solicitudes del período">
          <IconButton size="small" color="primary" onClick={() => onVerDetalle(periodo)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//! SKELETON — estado de carga
// ─────────────────────────────────────────────────────────────────────────────
function ResumenSkeleton({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <Stack sx={{ gap: 1.5 }}>
        {[1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    );
  }
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
    >
      <Table size="small">
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              {Array.from({ length: 10 }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//! COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function ResumenIdVacaciones() {
  const mounted = useMounted();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  const user = mounted ? getAuthUser() : null;
  const canAccess = user ? hasPermission(user.rol, permissions.listarVacacionesById) : false;
  const { vacacionesDetalle, loading, error } = useVacacionesIdResumen(user?.guid ?? null, canAccess);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<PeriodoVacacional | null>(null);

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  const palette = avatarStyle(vacacionesDetalle?.empleadoId ?? 0);
  const diasTotalesDisponibles = vacacionesDetalle?.diasTotalesDisponibles ?? 0;

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
      {/* ── Header ── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <AccountCircleIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Mi resumen de vacaciones
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* ── Tarjeta de perfil + totales ── */}
      {loading ? (
        <Skeleton variant="rounded" height={100} sx={{ mb: 2, borderRadius: 2 }} />
      ) : vacacionesDetalle ? (
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, mb: 2 }}>
          <CardContent>
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
              }}
            >
              {/* Avatar + nombre */}
              <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5, flex: 1 }}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    fontSize: 16,
                    fontWeight: 700,
                    bgcolor: palette.bg,
                    color: palette.color,
                  }}
                >
                  {getInitials(vacacionesDetalle.nombreCompleto)}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{vacacionesDetalle.nombreCompleto}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {vacacionesDetalle.codigoEmpleado} · Ingreso: {formatDate(vacacionesDetalle.fechaIngreso)}
                  </Typography>
                </Box>
              </Stack>

              <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />

              {/* Totales */}
              <Stack
                sx={{
                  flexDirection: "row",
                  gap: { xs: 2, sm: 3 },
                  flexWrap: "wrap",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: isDark ? "#6EE7B7" : "#065F46" }}>
                    {diasTotalesDisponibles}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Disponibles
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700 }}>{vacacionesDetalle.cantidadPeriodos}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Períodos
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {/* ── Error ── */}
      {error && (
        <Typography color="error" sx={{ mb: 2, fontSize: 14 }}>
          {error}
        </Typography>
      )}

      {/* ── Períodos ── */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        Períodos vacacionales
      </Typography>

      {loading ? (
        <ResumenSkeleton isMobile={isMobile} />
      ) : isMobile ? (
        /* ── Vista MÓVIL — cards ── */
        vacacionesDetalle?.periodosVacacionales.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "text.disabled", fontSize: 14, py: 4 }}>
            Sin períodos registrados.
          </Typography>
        ) : (
          vacacionesDetalle?.periodosVacacionales.map((periodo) => (
            <PeriodoCard key={periodo.vacacionSaldoId} periodo={periodo} onVerDetalle={setPeriodoSeleccionado} />
          ))
        )
      ) : (
        /* ── Vista DESKTOP — tabla ── */
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflowX: "auto" }}
        >
          <Table size="small" sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? "rgba(255,255,255,0.08)" : "grey.50" }}>
                <TableCell>ID</TableCell>
                <TableCell>Per. Inicio</TableCell>
                <TableCell>Per. Fin</TableCell>
                <TableCell align="center">Acumulados</TableCell>
                <TableCell align="center">Usados</TableCell>
                <TableCell align="center">Disponibles</TableCell>
                <TableCell align="center">Domingos</TableCell>
                <TableCell align="center">Progreso</TableCell>
                <TableCell align="center">Solicitudes</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {!vacacionesDetalle || vacacionesDetalle.periodosVacacionales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ py: 4, textAlign: "center", color: "text.disabled", fontSize: 13 }}>
                    Sin períodos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                vacacionesDetalle.periodosVacacionales.map((periodo, idx) => (
                  <PeriodoRow
                    key={periodo.vacacionSaldoId}
                    periodo={periodo}
                    isLast={idx === vacacionesDetalle.periodosVacacionales.length - 1}
                    onVerDetalle={setPeriodoSeleccionado}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <VacacionesDialog
        open={periodoSeleccionado !== null}
        onClose={() => setPeriodoSeleccionado(null)}
        periodo={periodoSeleccionado}
        modo="resumen"
      />
    </Box>
  );
}
