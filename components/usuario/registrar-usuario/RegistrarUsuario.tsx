"use client";

import { useState } from "react";

import {
  Alert,
  Autocomplete,
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
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { useRoles } from "@/features/dashboard/roles/hooks/useRoles";
import { useEmpleados } from "@/features/dashboard/empleado/hooks/useEmpleados";

import { EmpleadosListar } from "@/features/dashboard/empleado/empleado.types";

import { UsuarioForm, UsuarioSchema } from "@/features/dashboard/usuario/usuario.schema";

import { toastPromise } from "@/shared/utils/toast";

import { registrarUsuario } from "@/features/dashboard/usuario/usuario.logic";

const defaultValues: UsuarioForm = {
  empleadoId: "",
  nombreCompleto: "",
  rolId: "",
  password: "",
};

export default function RegistrarUsuario() {
  const router = useRouter();

  const { roles } = useRoles();

  const { empleados, loading: loadingEmployees } = useEmpleados();

  const [selectedEmployee, setSelectedEmployee] = useState<EmpleadosListar | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UsuarioForm>({
    resolver: standardSchemaResolver(UsuarioSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  //! Reset form

  const resetForm = () => {
    reset(defaultValues);
    setSelectedEmployee(null);
  };

  //! Submit

  const onSubmit = async (data: UsuarioForm) => {
    try {
      setSaving(true);
      console.log(saving);

      await toastPromise(
        registrarUsuario(Number(data.empleadoId), {
          roleId: data.rolId,
          password: data.password,
        }),
        {
          loading: "Registrando usuario...",
          success: "Usuario registrado correctamente",
          error: "Error al registrar el usuario",
        },
      );

      resetForm();
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
        {/* Header */}
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            py: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 52,
                height: 52,
              }}
            >
              <PersonAddAlt1RoundedIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Registro de usuarios
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Gestión y configuración de accesos del sistema
              </Typography>
            </Box>
          </Stack>
        </Box>

        <CardContent
          sx={{
            p: { xs: 3, md: 4 },
          }}
        >
          {/* Información del empleado */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 3,
              }}
            >
              Información del empleado
            </Typography>

            <Grid container spacing={2.5}>
              {/* Autocomplete empleado */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="empleadoId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      disablePortal
                      options={empleados ?? []}
                      loading={loadingEmployees}
                      value={empleados.find((x) => x.id.toString() === field.value) ?? null}
                      onChange={(_, value) => {
                        field.onChange(value?.id?.toString() ?? "");

                        setSelectedEmployee(value);

                        setValue("nombreCompleto", value?.nombreCompleto ?? "");
                      }}
                      getOptionLabel={(option) => option.nombreCompleto ?? ""}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      noOptionsText="Sin resultados"
                      loadingText="Cargando..."
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Buscar empleado"
                          placeholder="Seleccione un empleado"
                          error={!!errors.empleadoId}
                          helperText={errors.empleadoId?.message}
                          fullWidth
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Nombre completo */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Nombre completo"
                  value={selectedEmployee?.nombreCompleto ?? ""}
                  fullWidth
                  size="small"
                  disabled
                  placeholder="Seleccione un empleado"
                />
              </Grid>

              {/* Correo */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Correo electrónico"
                  size="small"
                  value={selectedEmployee?.correo ?? ""}
                  fullWidth
                  disabled
                  placeholder="Correo del empleado"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Configuración */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 3,
              }}
            >
              Configuración de acceso
            </Typography>

            <Grid container spacing={2.5}>
              {/* Rol */}
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

              {/* Password */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Alert */}
          <Alert
            severity="info"
            sx={{
              mt: 3,
              borderRadius: 2,
            }}
          >
            El usuario será creado utilizando el correo registrado del empleado seleccionado.
          </Alert>

          {/* Actions */}
          <Divider sx={{ my: 4 }} />

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            sx={{
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={() => router.push("/dashboard/usuarios/listar")}
              sx={{
                minWidth: 120,
                height: 44,
              }}
            >
              Volver
            </Button>

            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestartAltIcon />}
              onClick={resetForm}
              disabled={saving}
              sx={{
                minWidth: 120,
                height: 44,
              }}
            >
              Limpiar
            </Button>

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              sx={{
                minWidth: 140,
                height: 44,
                boxShadow: "none",
                borderRadius: 2,
              }}
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
