"use client";

import { useState, useCallback } from "react";
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
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { useRoles } from "@/features/dashboard/roles/hooks/useRoles";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface FormState {
  roleId: string | number;
  password: string;
}

interface AlertMessage {
  type: "success" | "error" | "warning" | "info";
  text: string;
}

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 1,
    firstName: "Ana",
    lastName: "Ramírez",
    email: "a.ramirez@empresa.com",
  },
  {
    id: 2,
    firstName: "Carlos",
    lastName: "Mendoza",
    email: "c.mendoza@empresa.com",
  },
  {
    id: 3,
    firstName: "Laura",
    lastName: "Torres",
    email: "l.torres@empresa.com",
  },
];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function RegistrarUsuario() {
  const { roles } = useRoles();
  console.log(roles);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [form, setForm] = useState<FormState>({
    roleId: "",
    password: "",
  });

  const [message, setMessage] = useState<AlertMessage | null>(null);

  const [saving, setSaving] = useState(false);
  const [loadingEmployees] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const employees = MOCK_EMPLOYEES;
  // const roles = MOCK_ROLES;

  const employeeFullName = selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "";

  const handleClear = useCallback(() => {
    setSelectedEmployee(null);
    setForm({
      roleId: "",
      password: "",
    });
    setMessage(null);
  }, []);

  const handleBack = useCallback(() => {
    console.log("Navigate back");
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedEmployee || !form.roleId || !form.password) {
      setMessage({
        type: "error",
        text: "Complete todos los campos requeridos.",
      });
      return;
    }

    setSaving(true);

    try {
      await new Promise((r) => setTimeout(r, 1500));

      setMessage({
        type: "success",
        text: "Usuario registrado exitosamente.",
      });

      handleClear();
    } catch {
      setMessage({
        type: "error",
        text: "Ocurrió un error al guardar.",
      });
    } finally {
      setSaving(false);
    }
  }, [selectedEmployee, form, handleClear]);

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
          <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
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
          {/* Alert */}
          {message && (
            <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

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
              <Grid size={{ xs: 12 }}>
                <Autocomplete
                  options={employees}
                  loading={loadingEmployees}
                  value={selectedEmployee}
                  onChange={(_, value) => setSelectedEmployee(value)}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  noOptionsText="Sin resultados"
                  loadingText="Cargando..."
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar empleado"
                      placeholder="Seleccione un empleado"
                      fullWidth
                      slotProps={{
                        ...params.slotProps,
                        input: {
                          ...params.slotProps?.input,
                          endAdornment: (
                            <>
                              {loadingEmployees ? <CircularProgress size={18} /> : null}

                              {
                                (
                                  params.slotProps?.input as {
                                    endAdornment?: React.ReactNode;
                                  }
                                )?.endAdornment
                              }
                            </>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Nombre completo"
                  value={employeeFullName}
                  fullWidth
                  disabled
                  placeholder="Seleccione un empleado"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Correo electrónico"
                  value={selectedEmployee?.email ?? ""}
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
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Rol del sistema"
                  value={form.roleId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      roleId: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">Seleccione un rol</MenuItem>

                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Actions */}
          <Divider sx={{ my: 4 }} />

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            sx={{
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handleBack}
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
              startIcon={<CleaningServicesRoundedIcon />}
              onClick={handleClear}
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
              onClick={handleSave}
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
