"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Role {
  id: string;
  name: string;
}

interface UserPayload {
  roleId: string;
  password: string;
  emailConfirmed: boolean;
}

export default function RegistrarUsuario() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [form, setForm] = useState<UserPayload>({
    roleId: "",
    password: "",
    emailConfirmed: true,
  });

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Nombre completo empleado
  const employeeFullName = useMemo(() => {
    if (!selectedEmployee) return "";
    return `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
  }, [selectedEmployee]);

  // =========================
  // CARGAR EMPLEADOS
  // =========================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);

        // TODO: Reemplazar URL
        const response = await fetch("https://api.tusistema.com/employees");

        if (!response.ok) {
          throw new Error("Error al cargar empleados");
        }

        const data = await response.json();

        setEmployees(data);
      } catch (error) {
        console.error(error);
        setMessage({
          type: "error",
          text: "No se pudo cargar la lista de empleados",
        });
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // =========================
  // CARGAR ROLES
  // =========================
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);

        // TODO: Reemplazar URL
        const response = await fetch("https://api.tusistema.com/roles");

        if (!response.ok) {
          throw new Error("Error al cargar roles");
        }

        const data = await response.json();

        setRoles(data);
      } catch (error) {
        console.error(error);
        setMessage({
          type: "error",
          text: "No se pudo cargar los roles",
        });
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // =========================
  // LIMPIAR FORMULARIO
  // =========================
  const handleClear = () => {
    setSelectedEmployee(null);

    setForm({
      roleId: "",
      password: "",
      emailConfirmed: true,
    });

    setMessage(null);
  };

  // =========================
  // GUARDAR
  // =========================
  const handleSave = async () => {
    try {
      setMessage(null);

      if (!selectedEmployee) {
        setMessage({
          type: "error",
          text: "Debe seleccionar un empleado",
        });
        return;
      }

      if (!form.roleId) {
        setMessage({
          type: "error",
          text: "Debe seleccionar un rol",
        });
        return;
      }

      if (!form.password) {
        setMessage({
          type: "error",
          text: "Debe ingresar una contraseña",
        });
        return;
      }

      setSaving(true);

      const payload = {
        roleId: form.roleId,
        password: form.password,
        emailConfirmed: true,
      };

      console.log("Payload:", payload);

      // TODO: Reemplazar URL
      const response = await fetch("https://api.tusistema.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar");
      }

      setMessage({
        type: "success",
        text: "Usuario registrado correctamente",
      });

      handleClear();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: "Ocurrió un error al guardar",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // VOLVER
  // =========================
  const handleBack = () => {
    // Si usas App Router
    window.history.back();

    // O usar:
    // router.back()
  };

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: 900,
        width: "100%",
        mx: "auto",
        mt: {
          xs: 2,
          md: 4,
        },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        background: "linear-gradient(to bottom, #ffffff, #fafafa)",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: {
            xs: 3,
            md: 4,
          },
          py: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
        }}
      >
        <Stack
          sx={{
            spacing: 2,
            alignItems: "center",
            direction: "row",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <PersonAddIcon
              sx={{
                fontSize: 30,
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: {
                  xs: 22,
                  md: 28,
                },
              }}
            >
              Registro de Usuarios
            </Typography>

            <Typography
              sx={{
                opacity: 0.9,
                mt: 0.5,
                fontSize: {
                  xs: 13,
                  md: 14,
                },
              }}
            >
              Gestión y creación de accesos del sistema
            </Typography>
          </Box>
        </Stack>
      </Box>

      <CardContent
        sx={{
          p: {
            xs: 3,
            md: 4,
          },
        }}
      >
        {/* ALERTA */}
        {message && (
          <Alert
            severity={message.type}
            sx={{
              mb: 4,
              borderRadius: 3,
            }}
          >
            {message.text}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* EMPLEADO */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                Empleado
              </Typography>

              <Autocomplete
                options={employees}
                loading={loadingEmployees}
                value={selectedEmployee}
                onChange={(_, value) => setSelectedEmployee(value)}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar empleado..."
                    fullWidth
                    slotProps={{
                      input: {
                        ...params.slotProps?.input,
                        endAdornment: (
                          <>
                            {loadingEmployees ? <CircularProgress size={20} /> : null}

                            {params.slotProps?.input?.endAdornment}
                          </>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "background.paper",
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Grid>

          {/* NOMBRE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                Nombre completo
              </Typography>

              <TextField
                value={employeeFullName}
                fullWidth
                disabled
                placeholder="Seleccione un empleado"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#f5f7fa",
                  },
                }}
              />
            </Box>
          </Grid>

          {/* CORREO */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                Correo electrónico
              </Typography>

              <TextField
                value={selectedEmployee?.email || ""}
                fullWidth
                disabled
                placeholder="Correo del empleado"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#f5f7fa",
                  },
                }}
              />
            </Box>
          </Grid>

          {/* ROL */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                Rol del sistema
              </Typography>

              <TextField
                select
                fullWidth
                value={form.roleId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    roleId: e.target.value,
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              >
                <MenuItem value="">Seleccione un rol</MenuItem>

                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>

          {/* PASSWORD */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                Contraseña
              </Typography>

              <TextField
                type="password"
                fullWidth
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="Ingrese contraseña"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* BOTONES */}
        <Stack
          sx={{
            mt: 5,
            spacing: 2,
            justifyContent: "flex-end",
            direction: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            fullWidth={window.innerWidth < 600}
            sx={{
              height: 48,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Volver
          </Button>

          <Button
            variant="outlined"
            color="warning"
            startIcon={<CleaningServicesIcon />}
            onClick={handleClear}
            fullWidth={window.innerWidth < 600}
            sx={{
              height: 48,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Limpiar
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            fullWidth={window.innerWidth < 600}
            sx={{
              height: 48,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
