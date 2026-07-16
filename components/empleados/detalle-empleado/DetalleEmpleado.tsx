"use client";

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Skeleton, Stack, Typography } from "@mui/material";
import {
  KeyboardBackspace,
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
  School,
  CalendarMonth,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEmpleado } from "@/features/dashboard/empleado/hooks/useEmpleado";
import { useCatalogos } from "@/features/dashboard/catalogo/hooks/useCatalogos";
import { exportarEmpleadoPdf } from "@/features/dashboard/empleado/helpers/exportarEmpleadoPdf";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

interface Props {
  id: number;
}

//! Función auxiliar para obtener el nombre de un ítem de catálogo a partir de su ID
function obtenerNombreCatalogo(items: { id: number; nombre: string }[], id?: number | null) {
  return items.find((x) => x.id === id)?.nombre ?? "—";
}

function formatearFecha(value: string | null | undefined) {
  if (!value) return null;
  const date = dayjs(value);
  return date.isValid() ? date.format("DD/MM/YYYY") : value;
}

function formatearSalario(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return `S/ ${Number(value).toFixed(2)}`;
}

//! subcomponentes

const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      p: { xs: 2, sm: 2.5 },
      height: "100%",
    }}
  >
    <Stack direction="row" sx={{ mb: 2, gap: 1.5, alignItems: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "white",
          "& svg": { fontSize: 20 },
        }}
      >
        <Icon />
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary" }}>
        {title}
      </Typography>
    </Stack>
    <Divider sx={{ mb: 2 }} />
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Paper>
);

const Field = ({
  label,
  value,
  size,
  valueColor,
}: {
  label: string;
  value?: string | number | null;
  size?: { xs?: number; sm?: number; md?: number };
  valueColor?: string;
}) => (
  <Grid size={size ?? { xs: 12, sm: 6, md: 4 }}>
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
          color: value ? (valueColor ?? "text.primary") : "text.disabled",
          fontWeight: 500,
          fontStyle: value ? "normal" : "italic",
          wordBreak: "break-word",
        }}
      >
        {value ?? "—"}
      </Typography>
    </Stack>
  </Grid>
);

//! Skeleton de carga
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

//! Componente principal
export default function DetalleEmpleado({ id }: Props) {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.detalleEmpleado) : false;
  const { empleado, loading, error } = useEmpleado(id, canAccess);
  const { catalogos, loading: loadingCatalogos } = useCatalogos();
  const router = useRouter();

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (loading || loadingCatalogos) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          height: 256,
          gap: 2,
        }}
      >
        <Typography color="error">{error instanceof Error ? error.message : "Error al cargar el empleado."}</Typography>

        <Button
          variant="outlined"
          startIcon={<KeyboardBackspace />}
          onClick={() => router.push("/dashboard/empleados/listar")}
          sx={{ minWidth: 120, height: 44 }}
        >
          Volver
        </Button>
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
          variant="outlined"
          startIcon={<KeyboardBackspace />}
          onClick={() => router.push("/dashboard/empleados/listar")}
          sx={{ minWidth: 120, height: 44 }}
        >
          Volver
        </Button>
      </Stack>
    );
  }

  const handleExportarPdf = async () => {
    await exportarEmpleadoPdf({
      nombreCompleto: empleado.nombreCompleto,
      codigoEmpleado: empleado.codigoEmpleado,
      estado: empleado.isActive ? "Activo" : "Inactivo",
      fotoUrl: empleado.fotoUrl,
      secciones: [
        {
          titulo: "Datos personales",
          campos: [
            { etiqueta: "Nombres", valor: empleado.nombre },
            { etiqueta: "Apellidos", valor: empleado.apellidos },
            {
              etiqueta: "Tipo de documento",
              valor: obtenerNombreCatalogo(catalogos.tiposDocumentos, empleado.tipoDocumento),
            },
            { etiqueta: "Número de documento", valor: empleado.numeroDocumento },
            { etiqueta: "Género", valor: obtenerNombreCatalogo(catalogos.generos, empleado.genero) },
            { etiqueta: "Estado civil", valor: obtenerNombreCatalogo(catalogos.estadosCiviles, empleado.estadoCivil) },
            { etiqueta: "Fecha de nacimiento", valor: formatearFecha(empleado.fechaNacimiento) },
            { etiqueta: "Edad", valor: `${empleado.edad} años` },
            { etiqueta: "Nacionalidad", valor: empleado.nacionalidad },
          ],
        },
        {
          titulo: "Contacto y ubicación",
          campos: [
            { etiqueta: "Correo electrónico", valor: empleado.correo },
            { etiqueta: "Teléfono", valor: empleado.telefonoMovil },
            { etiqueta: "Dirección", valor: empleado.direccion },
            { etiqueta: "Departamento", valor: empleado.departamento },
            { etiqueta: "Provincia", valor: empleado.provincia },
            { etiqueta: "Distrito", valor: empleado.distrito },
          ],
        },
        {
          titulo: "Contacto de emergencia",
          campos: [
            { etiqueta: "Nombre", valor: empleado.contactoEmergenciaNombre },
            { etiqueta: "Teléfono", valor: empleado.contactoEmergenciaTelefono },
            {
              etiqueta: "Parentesco",
              valor: obtenerNombreCatalogo(catalogos.tiposParentesco, empleado.contactoEmergenciaParentesco),
            },
          ],
        },
        {
          titulo: "Educación",
          campos: [
            {
              etiqueta: "Nivel educativo",
              valor: obtenerNombreCatalogo(catalogos.nivelesEducativos, empleado.nivelEducativo),
            },
            { etiqueta: "Profesión / Oficio", valor: empleado.profesionOficio },
          ],
        },
        {
          titulo: "Información laboral",
          campos: [
            { etiqueta: "Código", valor: empleado.codigoEmpleado },
            { etiqueta: "Cargo actual", valor: empleado.cargoActual },
            { etiqueta: "Salario base", valor: formatearSalario(empleado.salarioBase) },
            {
              etiqueta: "Tipo de contrato",
              valor: obtenerNombreCatalogo(catalogos.tiposContrato, empleado.tipoContrato),
            },
            { etiqueta: "Tipo de jornada", valor: obtenerNombreCatalogo(catalogos.tiposJornada, empleado.tipoJornada) },
            { etiqueta: "Fecha de ingreso", valor: formatearFecha(empleado.fechaIngreso) },
            { etiqueta: "Fecha de egreso", valor: formatearFecha(empleado.fechaEgreso) },
            { etiqueta: "Motivo de egreso", valor: empleado.motivoEgreso },
            { etiqueta: "Observaciones", valor: empleado.observaciones },
          ],
        },
        {
          titulo: "Datos bancarios",
          campos: [
            { etiqueta: "Banco sueldo", valor: empleado.bancoSueldo },
            { etiqueta: "Nro. cuenta sueldo", valor: empleado.cuentaSueldo },
            { etiqueta: "CCI sueldo", valor: empleado.cciSueldo },
            { etiqueta: "Banco CTS", valor: empleado.bancoCTS },
            { etiqueta: "Nro. cuenta CTS", valor: empleado.cuentaCTS },
            { etiqueta: "CCI CTS", valor: empleado.cciCTS },
          ],
        },
        {
          titulo: "Pensiones y otros datos",
          campos: [
            {
              etiqueta: "Sistema de pensiones",
              valor: obtenerNombreCatalogo(catalogos.sistemasPensiones, empleado.sistemaPensiones),
            },
            { etiqueta: "CUSPP", valor: empleado.cuspp },
            { etiqueta: "RUC", valor: empleado.ruc },
          ],
        },
        {
          titulo: "Auditoría",
          campos: [
            { etiqueta: "ID", valor: empleado.id },
            { etiqueta: "Estado", valor: empleado.isActive ? "Activo" : "Inactivo" },
            { etiqueta: "Fecha de registro", valor: formatearFecha(empleado.createdAt) },
          ],
        },
      ],
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      {/* ── Header Card ── */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: "none",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, md: 2.5 },
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
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
                  src={empleado.fotoUrl || "/Avatar.png"}
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
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: "background.paper",
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
                    <Badge sx={{ fontSize: 14, color: "text.disabled" }} />
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {empleado.codigoEmpleado}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    •
                  </Typography>
                  <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5 }}>
                    <Work sx={{ fontSize: 14, color: "text.disabled" }} />
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {empleado.cargoActual}
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
                  {empleado.tipoContrato && (
                    <Chip
                      size="small"
                      label={obtenerNombreCatalogo(catalogos.tiposContrato, empleado.tipoContrato)}
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>

            {/* Botones de acción */}
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                alignSelf: { sm: "flex-start" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<KeyboardBackspace />}
                onClick={() => router.push("/dashboard/empleados/listar")}
                sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => void handleExportarPdf()}
                sx={{ height: 44, width: { xs: "100%", sm: "auto" } }}
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
            <Field label="Nombres" value={empleado.nombre} size={{ xs: 12, sm: 4 }} />
            <Field label="Apellidos" value={empleado.apellidos} size={{ xs: 12, sm: 8 }} />
            <Field label="Tipo doc." value={obtenerNombreCatalogo(catalogos.tiposDocumentos, empleado.tipoDocumento)} />
            <Field label="Nro. de doc." value={empleado.numeroDocumento} />
            <Field label="Género" value={obtenerNombreCatalogo(catalogos.generos, empleado.genero)} />
            <Field label="F. nacimiento" value={formatearFecha(empleado.fechaNacimiento)} />
            <Field label="Edad" value={empleado.edad ? `${empleado.edad} años` : null} />
            <Field label="Estado civil" value={obtenerNombreCatalogo(catalogos.estadosCiviles, empleado.estadoCivil)} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Contacto" icon={Mail}>
            <Field label="Correo electrónico" value={empleado.correo} size={{ xs: 12, sm: 8, md: 8 }} />
            <Field label="Teléfono" value={empleado.telefonoMovil} size={{ xs: 12, sm: 4, md: 4 }} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Ubicación" icon={LocationOn}>
            <Field label="Dirección" value={empleado.direccion} size={{ xs: 12, sm: 12, md: 12 }} />
            <Field label="Departamento" value={empleado.departamento} size={{ xs: 12, sm: 4, md: 4 }} />
            <Field label="Provincia" value={empleado.provincia} size={{ xs: 12, sm: 4, md: 4 }} />
            <Field label="Distrito" value={empleado.distrito} size={{ xs: 12, sm: 4, md: 4 }} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Contacto de emergencia" icon={Phone}>
            <Field label="Nombre" value={empleado.contactoEmergenciaNombre} />
            <Field label="Teléfono" value={empleado.contactoEmergenciaTelefono} />
            <Field
              label="Parentesco"
              value={obtenerNombreCatalogo(catalogos.tiposParentesco, empleado.contactoEmergenciaParentesco)}
            />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Educación" icon={School}>
            <Field
              label="Nivel educativo"
              value={obtenerNombreCatalogo(catalogos.nivelesEducativos, empleado.nivelEducativo)}
              size={{ xs: 12, sm: 4, md: 4 }}
            />
            <Field label="Profesión / Oficio" value={empleado.profesionOficio} size={{ xs: 12, sm: 8, md: 8 }} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <SectionCard title="Información laboral" icon={Work}>
            <Field label="Código" value={empleado.codigoEmpleado} />
            <Field label="Cargo actual" value={empleado.cargoActual} />
            <Field label="Salario base" value={formatearSalario(empleado.salarioBase)} />
            <Field
              label="Tipo de contrato"
              value={obtenerNombreCatalogo(catalogos.tiposContrato, empleado.tipoContrato)}
            />
            <Field
              label="Tipo de jornada"
              value={obtenerNombreCatalogo(catalogos.tiposJornada, empleado.tipoJornada)}
            />
            <Field label="F. ingreso" value={formatearFecha(empleado.fechaIngreso)} />
            <Field label="F. egreso" value={formatearFecha(empleado.fechaEgreso)} />
            <Field label="Motivo de egreso" value={empleado.motivoEgreso} />
            <Field label="Observaciones" value={empleado.observaciones} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Datos bancarios" icon={AccountBalance}>
            <Field label="Banco Sueldo" value={empleado.bancoSueldo} />
            <Field label="Nro. Cta. Sueldo" value={empleado.cuentaSueldo} />
            <Field label="CCI Sueldo" value={empleado.cciSueldo} />
            <Field label="Banco CTS" value={empleado.bancoCTS} />
            <Field label="Nro. Cta. CTS" value={empleado.cuentaCTS} />
            <Field label="CCI CTS" value={empleado.cciCTS} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Pensiones y otros datos" icon={Favorite}>
            <Field
              label="Sist. de pensiones"
              value={obtenerNombreCatalogo(catalogos.sistemasPensiones, empleado.sistemaPensiones)}
            />
            <Field label="CUSPP" value={empleado.cuspp} />
            <Field label="RUC" value={empleado.ruc} />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Auditoría" icon={CalendarMonth}>
            <Field label="ID" value={empleado.id} />
            <Field
              label="Estado"
              value={empleado.isActive ? "Activo" : "Inactivo"}
              valueColor={empleado.isActive ? "success.main" : "error.main"}
            />
            <Field label="Fecha de registro" value={formatearFecha(empleado.createdAt)} />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
