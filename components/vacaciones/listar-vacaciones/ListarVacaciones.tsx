"use client";

import * as React from "react";
import {
    Avatar,
    Box,
    Button,
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
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import { useVacacionesGenerales } from "@/features/dashboard/vacaciones/hooks/useVacacionesGenerales";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
import { permissions } from "@/shared/auth/auth.permissions";
import {
    EstadoPeriodoVacacional,
    ListarEmpleadoVacaciones,
    PeriodoVacacional,
} from "@/features/dashboard/vacaciones/vacaciones.type";

import { ChipProps, useTheme, useMediaQuery } from "@mui/material";
import { useMounted } from "@/shared/hooks/useMounted";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import Link from "next/link";
import VacacionesDialog from "@/components/vacaciones/VacacionesDialog";


// ─── Labels / Colors ──────────────────────────────────────────────────────────
export const EstadoPeriodoLabel: Record<EstadoPeriodoVacacional, string> = {
    [EstadoPeriodoVacacional.Incompleto]: "Incompleto",
    [EstadoPeriodoVacacional.Completo]: "Completo",
};

export const EstadoPeriodoColor: Record<EstadoPeriodoVacacional, ChipProps["color"]> = {
    [EstadoPeriodoVacacional.Incompleto]: "warning",
    [EstadoPeriodoVacacional.Completo]: "success",
};

// ─── Avatar helpers ───────────────────────────────────────────────────────────
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

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

// ─────────────────────────────────────────────────────────────────────────────
//! NIVEL 2 — FILA DE PERÍODO
// ─────────────────────────────────────────────────────────────────────────────
interface PeriodoRowProps {
    periodo: PeriodoVacacional;
    isLast: boolean;
    onVerDetalle: (periodo: PeriodoVacacional) => void;
}

function PeriodoRow({ periodo, isLast, onVerDetalle }: PeriodoRowProps) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <TableRow
            sx={{
                bgcolor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
                "&:hover": {
                    bgcolor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                },
                "& td": {
                    borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.12)",
                },
            }}
        >
            {/* indent nivel 2 */}
            <TableCell />
            {/* celda vacía donde antes estaba el toggle */}
            <TableCell />

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
                        periodo.porcentajeConsumido >= 80
                            ? "error"
                            : periodo.porcentajeConsumido >= 50
                                ? "warning"
                                : "success"
                    }
                    label={`${periodo.porcentajeConsumido}%`}
                    sx={{ fontSize: 11, height: 20, fontWeight: 700, minWidth: 46 }}
                />
            </TableCell>
            <TableCell sx={{ textAlign: "center", color: "text.secondary" }}>
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
                <Tooltip title="Ver solicitudes">
                    <IconButton
                        size="small"
                        color="info"
                        onClick={() => onVerDetalle(periodo)}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
//! NIVEL 1 — FILA DE EMPLEADO
// ─────────────────────────────────────────────────────────────────────────────
interface RowProps {
    row: ListarEmpleadoVacaciones;
    onVerDetalle: (periodo: PeriodoVacacional) => void;
}

function Row({ row, onVerDetalle }: RowProps) {
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

            {/* DETALLE EXPANDIDO — períodos (nivel 2) */}
            <TableRow>
                <TableCell
                    colSpan={10}
                    sx={{ p: 0, borderBottom: open ? "2px solid" : "none", borderColor: "primary.light" }}
                >
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
                                        <TableCell align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {row.periodosVacacionales.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={14}
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
                                                onVerDetalle={onVerDetalle}
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
export default function ListarVacacionesGenerales() {
    const user = getAuthUser();
    const canAccess = user ? hasPermission(user.rol, permissions.listarVacacionesGenerales) : false;
    const { vacacionesGenerales, loading } = useVacacionesGenerales(canAccess);
    const mounted = useMounted();

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
    const rowsPerPage = isLargeScreen ? 20 : 10;

    const [page, setPage] = React.useState(0);

    // Estado del Dialog
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedPeriodo, setSelectedPeriodo] = React.useState<PeriodoVacacional | null>(null);

    const handleVerDetalle = (periodo: PeriodoVacacional) => {
        setSelectedPeriodo(periodo);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedPeriodo(null);
    };

    if (!mounted) return null;
    if (!canAccess) return <AccessDenied />;

    const maxPage = Math.max(0, Math.ceil(vacacionesGenerales.length / rowsPerPage) - 1);
    const safePage = Math.min(page, maxPage);
    const paginatedRows = vacacionesGenerales.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

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
                            <Row key={row.empleadoId} row={row} onVerDetalle={handleVerDetalle} />
                        ))}

                        {!loading && vacacionesGenerales.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <Box sx={{ py: 6, textAlign: "center" }}>
                                        <Typography sx={{ fontSize: 14, color: "text.disabled" }}>
                                            No se encontraron registros.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {vacacionesGenerales.length > 0 && (
                    <TablePagination
                        component="div"
                        count={vacacionesGenerales.length}
                        page={safePage}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[rowsPerPage]}
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
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

            {/* Dialog de solicitudes del período */}
            <VacacionesDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                periodo={selectedPeriodo}
            />
        </Box>
    );
}