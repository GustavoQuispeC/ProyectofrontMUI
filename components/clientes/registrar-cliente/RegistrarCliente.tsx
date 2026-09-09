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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { clienteSchema, ClienteForm } from "@/features/dashboard/cliente/cliente.schema";
import { Cliente, CrearClienteRequest } from "@/features/dashboard/cliente/cliente.type";
import { useClientes } from "@/features/dashboard/cliente/hooks/useClientes";
import { useCrearCliente } from "@/features/dashboard/cliente/hooks/useCrearCliente";
import {
  direccionClienteSchema,
  DireccionClienteForm,
} from "@/features/dashboard/direccion-cliente/direccion-cliente.schema";
import { CrearDireccionClienteRequest } from "@/features/dashboard/direccion-cliente/direccion-cliente.type";
import { useCrearDireccionCliente } from "@/features/dashboard/direccion-cliente/hooks/useCrearDireccionCliente";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { toastError, toastWarning, toastPromise } from "@/shared/utils/toast";
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

const defaultValuesDireccion: DireccionClienteForm = {
  direccion: "",
  referencia: null,
  distrito: null,
  provincia: null,
  departamento: null,
  esPrincipal: true,
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
  const [clienteCreado, setClienteCreado] = useState<Cliente | null>(null);

  const { cliente, datosApi, existe, loading: loadingBuscar, error } = useClientes(buscar, canAccess);
  const crearClienteMutation = useCrearCliente();
  const crearDireccionMutation = useCrearDireccionCliente();

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

  const {
    control: controlDireccion,
    handleSubmit: handleSubmitDireccion,
    reset: resetDireccion,
    formState: { errors: errorsDireccion },
  } = useForm<DireccionClienteForm>({
    resolver: standardSchemaResolver(direccionClienteSchema),
    defaultValues: defaultValuesDireccion,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const resetForm = () => {
    reset(defaultValues);
    resetDireccion(defaultValuesDireccion);
    setDocumentoBuscar("");
    setBuscar("");
    setClienteCreado(null);
  };

  const handleClose = () => {
    if (clienteCreado && onClienteCreado) onClienteCreado(clienteCreado);
    resetForm();
    onClose();
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

      resetDireccion({
        direccion: datosApi?.direccion?.trim() || "",
        referencia: null,
        distrito: datosApi?.distrito?.trim() || null,
        provincia: datosApi?.provincia?.trim() || null,
        departamento: datosApi?.departamento?.trim() || null,
        esPrincipal: true,
      });

      setClienteCreado(nuevoCliente);
    } catch {
      // El error ya es mostrado por toastPromise
    }
  };

  const onSubmitDireccion = async (data: DireccionClienteForm) => {
    if (!clienteCreado) return;

    try {
      const payload: CrearDireccionClienteRequest = {
        clienteId: clienteCreado.id,
        direccion: data.direccion,
        referencia: data.referencia,
        distrito: data.distrito,
        provincia: data.provincia,
        departamento: data.departamento,
        esPrincipal: data.esPrincipal,
      };

      await toastPromise(crearDireccionMutation.mutateAsync(payload), {
        loading: "Guardando dirección...",
        success: "Dirección guardada correctamente.",
        error: (err) => err.message,
      });

      handleClose();
    } catch {
      // El error ya es mostrado por toastPromise
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  const handleDireccionFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitDireccion(onSubmitDireccion)(e);
  };

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {clienteCreado ? <LocationOnIcon color="primary" /> : <PersonAddIcon color="primary" />}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {clienteCreado ? "Agregar Dirección" : "Registrar Cliente"}
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={clienteCreado ? handleDireccionFormSubmit : handleFormSubmit}>
        <DialogContent dividers>
          {!clienteCreado ? (
            <>
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
            </>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="direccion"
                  control={controlDireccion}
                  render={({ field }) => (
                    <InputCard
                      {...field}
                      label="Dirección *"
                      error={!!errorsDireccion.direccion}
                      helperText={errorsDireccion.direccion?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="referencia"
                  control={controlDireccion}
                  render={({ field }) => (
                    <InputCard
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      label="Referencia"
                      error={!!errorsDireccion.referencia}
                      helperText={errorsDireccion.referencia?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="departamento"
                  control={controlDireccion}
                  render={({ field }) => (
                    <InputCard
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      label="Departamento"
                      error={!!errorsDireccion.departamento}
                      helperText={errorsDireccion.departamento?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="provincia"
                  control={controlDireccion}
                  render={({ field }) => (
                    <InputCard
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      label="Provincia"
                      error={!!errorsDireccion.provincia}
                      helperText={errorsDireccion.provincia?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="distrito"
                  control={controlDireccion}
                  render={({ field }) => (
                    <InputCard
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      label="Distrito"
                      error={!!errorsDireccion.distrito}
                      helperText={errorsDireccion.distrito?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="esPrincipal"
                  control={controlDireccion}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                      label="Dirección principal"
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            {clienteCreado ? "Omitir" : "Cancelar"}
          </Button>
          {!clienteCreado && (
            <Button
              onClick={resetForm}
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              disabled={crearClienteMutation.isPending}
            >
              Limpiar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            disabled={clienteCreado ? crearDireccionMutation.isPending : crearClienteMutation.isPending}
          >
            {clienteCreado
              ? crearDireccionMutation.isPending
                ? "Guardando..."
                : "Guardar Dirección"
              : crearClienteMutation.isPending
                ? "Guardando..."
                : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
