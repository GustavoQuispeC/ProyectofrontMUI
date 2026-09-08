"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { clienteSchema, ClienteForm } from "@/features/dashboard/cliente/cliente.schema";
import { Cliente, CrearClienteRequest } from "@/features/dashboard/cliente/cliente.type";
import { useClientes } from "@/features/dashboard/cliente/hooks/useClientes";
import { useCrearCliente } from "@/features/dashboard/cliente/hooks/useCrearCliente";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { toastError, toastSuccess, toastWarning, toastPromise } from "@/shared/utils/toast";
import { useMounted } from "@/shared/hooks/useMounted";

const defaultValues: ClienteForm = {
  nombre: "",
  apellido: null,
  razonSocial: null,
  numeroDni: null,
  numeroRuc: null,
  correo: null,
  telefono: null,
};

interface RegistrarClienteProps {
  open: boolean;
  onClose: () => void;
  onClienteCreado?: (cliente: Cliente) => void;
}

const InputCard = (props: React.ComponentProps<typeof TextField>) => (
  <TextField
    fullWidth
    size="small"
    {...props}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#f8fafc"),
      },
      ...props.sx,
    }}
  />
);

export default function RegistrarCliente({ open, onClose, onClienteCreado }: RegistrarClienteProps) {
  const mounted = useMounted();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarCliente) : false;

  const [documentoBuscar, setDocumentoBuscar] = useState("");
  const [buscar, setBuscar] = useState("");

  const { cliente, datosApi, existe, loading: loadingBuscar, error } = useClientes(buscar, canAccess);
  const crearClienteMutation = useCrearCliente();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteForm>({
    resolver: standardSchemaResolver(clienteSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const resetForm = () => {
    reset(defaultValues);
    setDocumentoBuscar("");
    setBuscar("");
  };

  useEffect(() => {
    if (!buscar || loadingBuscar) return;

    if (error) {
      toastError(error);
      return;
    }

    if (existe && cliente) {
      toastWarning(`Cliente ya se encuentra registrado: ${cliente.nombreCompleto}`);
      reset({
        nombre: cliente.nombre,
        apellido: cliente.apellido || null,
        razonSocial: cliente.razonSocial || null,
        numeroDni: cliente.numeroDni || null,
        numeroRuc: cliente.numeroRuc || null,
        correo: cliente.correo || null,
        telefono: cliente.telefono || null,
      });
      return;
    }

    if (datosApi) {
      if (buscar.length === 11) {
        // RUC: solo se precarga la razón social
        reset({
          ...defaultValues,
          nombre: "",
          razonSocial: datosApi.razonSocial?.trim() || null,
          numeroRuc: buscar,
          numeroDni: null,
        });
      } else {
        // DNI: se combinan nombres y apellidos
        const nombres = datosApi.nombres?.trim() || datosApi.nombre?.trim() || "";
        const apellidos =
          datosApi.apellido?.trim() ||
          [datosApi.apellidoPaterno, datosApi.apellidoMaterno].filter(Boolean).join(" ").trim() ||
          "";

        reset({
          ...defaultValues,
          nombre: nombres,
          apellido: apellidos || null,
          razonSocial: null,
          numeroDni: buscar,
          numeroRuc: null,
        });
      }
    }
  }, [buscar, loadingBuscar, existe, cliente, datosApi, error, reset]);

  const handleBuscar = () => {
    const trimmed = documentoBuscar.trim();
    if (!trimmed) return;
    if (trimmed.length !== 8 && trimmed.length !== 11) {
      toastError("Ingrese un DNI de 8 dígitos o RUC de 11 dígitos");
      return;
    }
    setBuscar(trimmed);
  };

  const onSubmit = async (data: ClienteForm) => {
    try {
      const payload: CrearClienteRequest = data.numeroRuc
        ? {
            razonSocial: data.razonSocial || undefined,
            numeroRuc: data.numeroRuc,
            correo: data.correo || undefined,
            telefono: data.telefono || undefined,
          }
        : {
            nombre: data.nombre || undefined,
            apellido: data.apellido || undefined,
            numeroDni: data.numeroDni || undefined,
            correo: data.correo || undefined,
            telefono: data.telefono || undefined,
          };

      const nuevoCliente = await toastPromise(crearClienteMutation.mutateAsync(payload), {
        loading: "Registrando cliente...",
        success: "Cliente registrado correctamente.",
        error: (err) => err.message,
      });

      toastSuccess("Cliente registrado correctamente");
      if (onClienteCreado) onClienteCreado(nuevoCliente);
      resetForm();
      onClose();
    } catch {
      // El error ya es mostrado por toastPromise
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonAddIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Registrar Cliente
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleFormSubmit}>
        <DialogContent dividers>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="DNI o RUC"
              value={documentoBuscar}
              onChange={(e) => setDocumentoBuscar(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              placeholder="Ingrese DNI o RUC"
            />
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleBuscar}
              disabled={loadingBuscar}
              sx={{ minWidth: 120, height: 40 }}
            >
              {loadingBuscar ? "Buscando..." : "Buscar"}
            </Button>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <InputCard
                    {...field}
                    value={field.value ?? ""}
                    label="Nombre *"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="apellido"
                control={control}
                render={({ field }) => (
                  <InputCard
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    label="Apellido"
                    error={!!errors.apellido}
                    helperText={errors.apellido?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="razonSocial"
                control={control}
                render={({ field }) => (
                  <InputCard
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    label="Razón Social"
                    error={!!errors.razonSocial}
                    helperText={errors.razonSocial?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="numeroDni"
                control={control}
                render={({ field }) => (
                  <InputCard
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    label="DNI"
                    error={!!errors.numeroDni}
                    helperText={errors.numeroDni?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="numeroRuc"
                control={control}
                render={({ field }) => (
                  <InputCard
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    label="RUC"
                    error={!!errors.numeroRuc}
                    helperText={errors.numeroRuc?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="correo"
                control={control}
                render={({ field }) => (
                  <InputCard
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    label="Correo"
                    error={!!errors.correo}
                    helperText={errors.correo?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <InputCard
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    label="Teléfono"
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={resetForm}
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            disabled={crearClienteMutation.isPending}
          >
            Limpiar
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            disabled={crearClienteMutation.isPending}
          >
            {crearClienteMutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
