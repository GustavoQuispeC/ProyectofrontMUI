"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { useRoles } from "@/features/dashboard/roles/hooks/useRoles";
import { toastPromise } from "@/shared/utils/toast";
import { actualizarUsuario } from "@/features/dashboard/usuario/usuario.logic";
import { useUsuarioById } from "@/features/dashboard/usuario/hooks/useUsuarioById";
import { useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import type { ListarRoles } from "@/features/dashboard/roles/roles.type";
import type { ListarUsuarios } from "@/features/dashboard/usuario/usuario.types";

// ─── Schema & tipos ────────────────────────────────────────────────

const ActualizarUsuarioSchema = z.object({
  rolId: z.string().min(1, "Seleccione un rol"),
  isActive: z.boolean(),
});

type ActualizarUsuarioForm = z.infer<typeof ActualizarUsuarioSchema>;

// ─── Helpers ────────────────────────────────────────────────────────

function parseUsuarioId(searchParams: URLSearchParams): string | null {
  return searchParams.get("usuarioId") ?? searchParams.get("id") ?? null;
}

/** Normaliza isActive a booleano real (soporta string "True"/"False", número 1/0, etc.) */
function normalizeIsActive(raw: unknown): boolean {
  return String(raw).toLowerCase() === "true";
}

/** Busca el roleId a partir del nombre del rol del usuario */
function resolveRoleId(roleName: string, roles: ListarRoles[]): string {
  if (!roleName || roles.length === 0) return "";
  const normalized = roleName.trim().toLowerCase();
  const found = roles.find((item) => item.name.trim().toLowerCase() === normalized);
  return found?.id ?? "";
}

// ─── Props del formulario interno ──────────────────────────────────

interface FormularioActualizarProps {
  usuario: ListarUsuarios;
  roles: ListarRoles[];
  usuarioId: string;
  onSaved: () => void;
}

// ─── Componente interno (solo se monta con datos listos) ────────────

function FormularioActualizar({ usuario, roles, usuarioId, onSaved }: FormularioActualizarProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Datos de solo lectura
  const numeroDocumento = usuario.numeroDocumento ?? "";
  const nombreEmpleado = usuario.nombreEmpleado ?? "";
  const email = usuario.email ?? "";

  // Valores iniciales YA normalizados
  const initialRoleId = useMemo(() => resolveRoleId(usuario.roles?.[0] ?? "", roles), [usuario.roles, roles]);

  const initialIsActive = useMemo(() => normalizeIsActive(usuario.isActive), [usuario.isActive]);

  const defaultValues: ActualizarUsuarioForm = {
    rolId: initialRoleId,
    isActive: initialIsActive,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActualizarUsuarioForm>({
    resolver: standardSchemaResolver(ActualizarUsuarioSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data: ActualizarUsuarioForm) => {
    try {
      setSaving(true);

      const payload = {
        roleIds: [data.rolId],
        isActive: data.isActive,
      };

      await toastPromise(actualizarUsuario(usuarioId, payload), {
        loading: "Actualizando usuario...",
        success: "Usuario actualizado correctamente",
        error: "Error al actualizar el usuario",
      });

      onSaved();
      router.push("/dashboard/usuarios/listar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.default",
        minHeight: "100vh",
        py: { xs: 2, md: 5 },
        px: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 920,
          mx: "auto",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          backgroundColor: "background.paper",
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            py: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "warning.main", width: 52, height: 52 }}>
              <EditNoteRoundedIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                Actualizar usuario
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Modifica el rol o credenciales de acceso del usuario seleccionado
              </Typography>
            </Box>
          </Stack>
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Información del usuario (solo lectura) */}
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Información del usuario
            </Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField label="N° Documento" value={numeroDocumento} fullWidth size="small" disabled />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Nombre completo"
                  value={nombreEmpleado}
                  fullWidth
                  size="small"
                  disabled
                  placeholder="Sin nombre"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Correo electrónico"
                  value={email}
                  fullWidth
                  size="small"
                  disabled
                  placeholder="Sin correo"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Configuración de acceso (campos editables) */}
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Configuración de acceso
            </Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="rolId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.rolId}>
                      <InputLabel>Rol del sistema *</InputLabel>
                      <Select
                        {...field}
                        value={field.value || ""}
                        label="Rol del sistema *"
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>Seleccione</em>
                        </MenuItem>
                        {roles.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.rolId?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.isActive}>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={field.value ? "true" : "false"}
                        label="Estado"
                        onChange={(e) => field.onChange(e.target.value === "true")}
                      >
                        <MenuItem value="true">Activo</MenuItem>
                        <MenuItem value="false">Inactivo</MenuItem>
                      </Select>
                      <FormHelperText>{errors.isActive?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Paper>

          <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
            El rol y el estado se actualizarán para el usuario seleccionado.
          </Alert>

          <Divider sx={{ my: 4 }} />

          {/* Acciones */}
          <Stack direction={{ xs: "column-reverse", sm: "row" }} sx={{ gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={() => router.push("/dashboard/usuarios/listar")}
              sx={{ minWidth: 120, height: 44 }}
            >
              Volver
            </Button>

            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestartAltIcon />}
              onClick={resetForm}
              disabled={saving}
              sx={{ minWidth: 120, height: 44 }}
            >
              Limpiar
            </Button>

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              sx={{ minWidth: 140, height: 44, boxShadow: "none", borderRadius: 2 }}
            >
              {saving ? "Guardando..." : "Actualizar"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

// ─── Componente público (orquestador) ───────────────────────────────

export function ActualizarUsuario() {
  const searchParams = useSearchParams();
  const { roles } = useRoles();
  const queryClient = useQueryClient();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.actualizarUsuarios) : false;

  const usuarioId = useMemo(() => parseUsuarioId(searchParams), [searchParams]);
  const { usuario, loading: loadingUsuario, error: errorUsuario } = useUsuarioById(usuarioId);

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (!usuarioId) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="warning">No se recibió el identificador del usuario.</Alert>
      </Box>
    );
  }

  if (loadingUsuario) {
    return (
      <Box sx={{ p: 4, maxWidth: 920, mx: "auto" }}>
        <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  if (errorUsuario) {
    return (
      <Box sx={{ p: 4, maxWidth: 920, mx: "auto" }}>
        <Alert severity="error">Error al cargar el usuario: {errorUsuario}</Alert>
      </Box>
    );
  }

  if (!usuario) {
    return (
      <Box sx={{ p: 4, maxWidth: 920, mx: "auto" }}>
        <Alert severity="warning">Usuario no encontrado.</Alert>
      </Box>
    );
  }

  const handleSaved = async () => {
    await queryClient.invalidateQueries({ queryKey: ["usuarios"] });
  };

  return <FormularioActualizar usuario={usuario} roles={roles} usuarioId={usuarioId} onSaved={handleSaved} />;
}

export default ActualizarUsuario;
