"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Download,
  Person,
  Mail,
  LocationOn,
  Work,
  AccountBalance,
  Favorite,
  Phone,
  Badge,
  CheckCircle,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEmpleado } from "@/features/dashboard/empleado/hooks/useEmpleado";

interface Props {
  id: string;
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: "none" }}>
    <CardHeader
      avatar={
        <Box
          sx={{
            p: 0.75,
            bgcolor: "primary.50",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ fontSize: 18, color: "primary.main" }} />
        </Box>
      }
      title={
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
      }
      sx={{ pb: 0 }}
    />
    <Divider sx={{ mt: 1.5 }} />
    <CardContent sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </CardContent>
  </Card>
);

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <Grid size={{ xs: 12, sm: 6 }}>
    <Stack sx={{ gap: 0.25 }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.disabled",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: value ? "text.primary" : "text.disabled",
          fontWeight: 500,
          fontStyle: value ? "normal" : "italic",
        }}
      >
        {value ?? "—"}
      </Typography>
    </Stack>
  </Grid>
);

// ── Skeleton de carga ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: "auto" }}>
    <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: "none", mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
          <Skeleton variant="rounded" width={96} height={96} sx={{ borderRadius: 3 }} />
          <Stack sx={{ gap: 1, flex: 1 }}>
            <Skeleton variant="rounded" width={200} height={24} />
            <Skeleton variant="rounded" width={140} height={16} />
            <Skeleton variant="rounded" width={80} height={22} sx={{ borderRadius: 99, mt: 0.5 }} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} variant="outlined" sx={{ borderRadius: 3, boxShadow: "none", mb: 2 }}>
        <CardContent>
          <Skeleton variant="rounded" width={140} height={16} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((j) => (
              <Grid key={j} size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rounded" height={40} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    ))}
  </Box>
);

// ── Componente principal ──────────────────────────────────────────────────────
export default function DetalleEmpleado({ id }: Props) {
  const router = useRouter();
  const { empleado, loading, error } = useEmpleado(id);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <Stack sx={{ alignItems: "center", justifyContent: "center", height: 256, gap: 1.5 }}>
        <Typography variant="body2" sx={{ color: "error.main" }}>
          {error}
        </Typography>
        <Button onClick={() => router.push("/dashboard/empleados/listar")}>Volver</Button>
      </Stack>
    );
  }

  if (!empleado) {
    return (
      <Stack sx={{ alignItems: "center", justifyContent: "center", height: 256, gap: 1.5 }}>
        <Person sx={{ fontSize: 40, color: "text.disabled" }} />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No se encontró el empleado
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ArrowBack fontSize="small" />}
          onClick={() => router.push("/dashboard/empleados/listar")}
        >
          Volver
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: "auto" }}>
      {/* ── Header Card ── */}
      <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: "none", mb: 2 }}>
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { sm: "flex-start" },
              gap: 2,
            }}
          >
            {/* Foto + info */}
            <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "flex-start" }}>
              {/* Avatar con badge de estado */}
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Box
                  component="img"
                  src={empleado.fotoUrl ?? "/avatar.png"}
                  alt={empleado.nombreCompleto}
                  sx={{
                    width: 96,
                    height: 96,
                    borderRadius: 3,
                    objectFit: "cover",
                    border: "2px solid",
                    borderColor: "divider",
                    display: "block",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid white",
                    bgcolor: empleado.isActive ? "success.main" : "error.main",
                  }}
                />
              </Box>

              {/* Datos principales */}
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
                  {empleado.nombreCompleto}
                </Typography>

                <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                  <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
                    <Badge sx={{ fontSize: 12, color: "text.disabled" }} />
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {empleado.codigoEmpleado}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    •
                  </Typography>
                  <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
                    <Work sx={{ fontSize: 12, color: "text.disabled" }} />
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {empleado.cargoActual ?? "Sin cargo"}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                  <Chip
                    size="small"
                    icon={<CheckCircle sx={{ fontSize: "14px !important" }} />}
                    label={empleado.isActive ? "Activo" : "Inactivo"}
                    color={empleado.isActive ? "success" : "error"}
                    variant="outlined"
                  />
                  {empleado.tipoContrato && <Chip size="small" label={empleado.tipoContrato} variant="outlined" />}
                </Stack>
              </Stack>
            </Stack>

            {/* Botones de acción */}
            <Stack sx={{ flexDirection: "row", gap: 1, alignSelf: { sm: "flex-start" } }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ArrowBack fontSize="small" />}
                onClick={() => router.push("/dashboard/empleados/listar")}
                sx={{ fontSize: "0.75rem" }}
              >
                Volver
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<Download fontSize="small" />}
                sx={{ fontSize: "0.75rem" }}
              >
                Exportar
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Grid de secciones ── */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Datos personales" icon={Person}>
            <Field label="Nombres" value={empleado.nombre} />
            <Field label="Apellidos" value={empleado.apellidos} />
            <Field label="Género" value={empleado.genero} />
            <Field label="Estado civil" value={empleado.estadoCivil} />
            <Field label="Fecha de nacimiento" value={empleado.fechaNacimiento} />
            <Field label="Edad" value={empleado.edad ? `${empleado.edad} años` : null} />
            <Field label="Nacionalidad" value={empleado.nacionalidad} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Contacto" icon={Mail}>
            <Field label="Correo electrónico" value={empleado.correo} />
            <Field label="Teléfono móvil" value={empleado.telefonoMovil} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Ubicación" icon={LocationOn}>
            <Field label="Dirección" value={empleado.direccion} />
            <Field label="Departamento" value={empleado.departamento} />
            <Field label="Provincia" value={empleado.provincia} />
            <Field label="Distrito" value={empleado.distrito} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Contacto de emergencia" icon={Phone}>
            <Field label="Nombre" value={empleado.contactoEmergenciaNombre} />
            <Field label="Teléfono" value={empleado.contactoEmergenciaTelefono} />
            <Field label="Parentesco" value={empleado.contactoEmergenciaParentesco} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <SectionCard title="Información laboral" icon={Work}>
            <Field label="Cargo" value={empleado.cargoActual} />
            <Field label="Salario" value={empleado.salarioActual ? `S/ ${empleado.salarioActual}` : null} />
            <Field label="Tipo de contrato" value={empleado.tipoContrato} />
            <Field label="Tipo de jornada" value={empleado.tipoJornada} />
            <Field label="Fecha de ingreso" value={empleado.fechaIngresoActual} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Datos bancarios" icon={AccountBalance}>
            <Field label="Banco" value={empleado.bancoNombre} />
            <Field label="Número de cuenta" value={empleado.numeroCuentaBancaria} />
            <Field label="CCI" value={empleado.cci} />
            <Field label="Tipo de cuenta" value={empleado.tiposCuentaBancaria} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Pensiones y salud" icon={Favorite}>
            <Field label="Sistema de pensiones" value={empleado.sistemaPensiones} />
            <Field label="CUSPP" value={empleado.cuspp} />
            <Field label="N° EsSalud" value={empleado.numeroEssalud} />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}

//! Componente para mostrar el detalle completo de un empleado, con secciones bien definidas y diseño limpio. Incluye manejo de carga y errores.
