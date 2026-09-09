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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseIcon from "@mui/icons-material/Close";
import { clienteSchema, ClienteForm } from "@/features/dashboard/cliente/cliente.schema";
import { ListarCliente, ActualizarClienteRequest } from "@/features/dashboard/cliente/cliente.type";
import { useActualizarCliente } from "@/features/dashboard/cliente/hooks/useActualizarCliente";
import {
  direccionClienteSchema,
  DireccionClienteForm,
} from "@/features/dashboard/direccion-cliente/direccion-cliente.schema";
import { DireccionCliente } from "@/features/dashboard/direccion-cliente/direccion-cliente.type";
import { useDireccionesCliente } from "@/features/dashboard/direccion-cliente/hooks/useDireccionesCliente";
import { useCrearDireccionCliente } from "@/features/dashboard/direccion-cliente/hooks/useCrearDireccionCliente";
import { useActualizarDireccionCliente } from "@/features/dashboard/direccion-cliente/hooks/useActualizarDireccionCliente";
import { useEliminarDireccionCliente } from "@/features/dashboard/direccion-cliente/hooks/useEliminarDireccionCliente";
import { useEstablecerDireccionPrincipal } from "@/features/dashboard/direccion-cliente/hooks/useEstablecerDireccionPrincipal";
import { toastPromise } from "@/shared/utils/toast";

interface EditarClienteProps {
  open: boolean;
  onClose: () => void;
  cliente: ListarCliente | null;
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

const defaultValuesDireccion: DireccionClienteForm = {
  direccion: "",
  referencia: null,
  distrito: null,
  provincia: null,
  departamento: null,
  esPrincipal: true,
};

export default function EditarCliente({ open, onClose, cliente }: EditarClienteProps) {
  const clienteId = cliente?.id ?? null;

  const { data: direcciones, isLoading } = useDireccionesCliente(clienteId);
  const actualizarClienteMutation = useActualizarCliente();
  const crearDireccionMutation = useCrearDireccionCliente();
  const actualizarDireccionMutation = useActualizarDireccionCliente();
  const eliminarDireccionMutation = useEliminarDireccionCliente();
  const establecerPrincipalMutation = useEstablecerDireccionPrincipal();

  const [direccionFormOpen, setDireccionFormOpen] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState<DireccionCliente | null>(null);

  const {
    control: controlCliente,
    handleSubmit: handleSubmitCliente,
    reset: resetCliente,
    formState: { errors: errorsCliente },
  } = useForm<ClienteForm>({
    resolver: standardSchemaResolver(clienteSchema),
    defaultValues: {
      nombre: "",
      apellido: null,
      razonSocial: null,
      numeroDni: null,
      numeroRuc: null,
      correo: null,
      telefono: null,
    },
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

  useEffect(() => {
    if (cliente) {
      resetCliente({
        nombre: cliente.nombre,
        apellido: cliente.apellido || null,
        razonSocial: cliente.razonSocial || null,
        numeroDni: cliente.numeroDni || null,
        numeroRuc: cliente.numeroRuc || null,
        correo: cliente.correo,
        telefono: cliente.telefono,
      });
    }
  }, [cliente, resetCliente]);

  useEffect(() => {
    if (direccionEditando) {
      resetDireccion({
        direccion: direccionEditando.direccion,
        referencia: direccionEditando.referencia,
        distrito: direccionEditando.distrito,
        provincia: direccionEditando.provincia,
        departamento: direccionEditando.departamento,
        esPrincipal: direccionEditando.esPrincipal,
      });
    } else {
      resetDireccion(defaultValuesDireccion);
    }
  }, [direccionEditando, resetDireccion, direccionFormOpen]);

  const onSubmitCliente = async (data: ClienteForm) => {
    if (!cliente) return;

    try {
      const payload: ActualizarClienteRequest = cliente.numeroRuc
        ? {
            razonSocial: data.razonSocial || null,
            numeroRuc: data.numeroRuc || null,
            correo: data.correo || undefined,
            telefono: data.telefono || null,
          }
        : {
            nombre: data.nombre || undefined,
            apellido: data.apellido || null,
            numeroDni: data.numeroDni || null,
            correo: data.correo || undefined,
            telefono: data.telefono || null,
          };

      await toastPromise(actualizarClienteMutation.mutateAsync({ id: cliente.id, payload }), {
        loading: "Actualizando cliente...",
        success: "Cliente actualizado correctamente.",
        error: (err) => err.message,
      });
    } catch {
      // El error ya es mostrado por toastPromise
    }
  };

  const onSubmitDireccion = async (data: DireccionClienteForm) => {
    if (!cliente) return;

    try {
      if (direccionEditando) {
        await toastPromise(
          actualizarDireccionMutation.mutateAsync({
            id: direccionEditando.id,
            payload: {
              direccion: data.direccion,
              referencia: data.referencia,
              distrito: data.distrito,
              provincia: data.provincia,
              departamento: data.departamento,
              esPrincipal: data.esPrincipal,
            },
          }),
          {
            loading: "Actualizando dirección...",
            success: "Dirección actualizada correctamente.",
            error: (err) => err.message,
          },
        );
      } else {
        await toastPromise(
          crearDireccionMutation.mutateAsync({
            clienteId: cliente.id,
            direccion: data.direccion,
            referencia: data.referencia,
            distrito: data.distrito,
            provincia: data.provincia,
            departamento: data.departamento,
            esPrincipal: data.esPrincipal,
          }),
          {
            loading: "Guardando dirección...",
            success: "Dirección guardada correctamente.",
            error: (err) => err.message,
          },
        );
      }

      setDireccionFormOpen(false);
      setDireccionEditando(null);
    } catch {
      // El error ya es mostrado por toastPromise
    }
  };

  const handleEliminar = async (id: number) => {
    if (!cliente) return;
    try {
      await toastPromise(eliminarDireccionMutation.mutateAsync({ id, clienteId: cliente.id }), {
        loading: "Eliminando dirección...",
        success: "Dirección eliminada correctamente.",
        error: (err) => err.message,
      });
    } catch {
      // El error ya es mostrado por toastPromise
    }
  };

  const handleSetPrincipal = async (id: number) => {
    try {
      await toastPromise(establecerPrincipalMutation.mutateAsync(id), {
        loading: "Actualizando dirección principal...",
        success: "Dirección principal actualizada correctamente.",
        error: (err) => err.message,
      });
    } catch {
      // El error ya es mostrado por toastPromise
    }
  };

  const abrirNuevaDireccion = () => {
    setDireccionEditando(null);
    setDireccionFormOpen(true);
  };

  const abrirEditarDireccion = (d: DireccionCliente) => {
    setDireccionEditando(d);
    setDireccionFormOpen(true);
  };

  const cerrarDireccionForm = () => {
    setDireccionFormOpen(false);
    setDireccionEditando(null);
  };

  const handleClienteFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitCliente(onSubmitCliente)(e);
  };

  const handleDireccionFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitDireccion(onSubmitDireccion)(e);
  };

  const listaDirecciones = direcciones ?? cliente?.direcciones ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ManageAccountsIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Editar Cliente
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {cliente && (
          <Stack spacing={3}>
            <form onSubmit={handleClienteFormSubmit}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Información del cliente
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="nombre"
                      control={controlCliente}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          label="Nombre *"
                          error={!!errorsCliente.nombre}
                          helperText={errorsCliente.nombre?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="apellido"
                      control={controlCliente}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          label="Apellido"
                          error={!!errorsCliente.apellido}
                          helperText={errorsCliente.apellido?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="razonSocial"
                      control={controlCliente}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          label="Razón Social"
                          error={!!errorsCliente.razonSocial}
                          helperText={errorsCliente.razonSocial?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      name="numeroDni"
                      control={controlCliente}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          label="DNI"
                          error={!!errorsCliente.numeroDni}
                          helperText={errorsCliente.numeroDni?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Controller
                      name="numeroRuc"
                      control={controlCliente}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          label="RUC"
                          error={!!errorsCliente.numeroRuc}
                          helperText={errorsCliente.numeroRuc?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="correo"
                      control={controlCliente}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          label="Correo *"
                          error={!!errorsCliente.correo}
                          helperText={errorsCliente.correo?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="telefono"
                      control={controlCliente}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          label="Teléfono"
                          error={!!errorsCliente.telefono}
                          helperText={errorsCliente.telefono?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveRoundedIcon />}
                    disabled={actualizarClienteMutation.isPending}
                  >
                    {actualizarClienteMutation.isPending ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </Box>
              </Box>
            </form>

            <Box>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Direcciones
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={abrirNuevaDireccion}
                  disabled={direccionFormOpen}
                >
                  Añadir dirección
                </Button>
              </Stack>

              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : listaDirecciones.length === 0 ? (
                <Typography color="text.secondary">No hay direcciones registradas.</Typography>
              ) : (
                <List dense>
                  {listaDirecciones.map((d, index) => (
                    <ListItem
                      key={d.id}
                      divider={index < listaDirecciones.length - 1}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => abrirEditarDireccion(d)}
                            title="Editar dirección"
                          >
                            <EditIcon />
                          </IconButton>
                          {!d.esPrincipal && (
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => handleSetPrincipal(d.id)}
                              disabled={establecerPrincipalMutation.isPending}
                              title="Marcar como principal"
                            >
                              <StarIcon />
                            </IconButton>
                          )}
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleEliminar(d.id)}
                            disabled={eliminarDireccionMutation.isPending}
                            title="Eliminar dirección"
                          >
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemIcon>
                        <HomeWorkIcon color={d.esPrincipal ? "primary" : "action"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {d.direccion}
                            </Typography>
                            {d.esPrincipal && <Chip size="small" color="secondary" label="Principal" />}
                          </Box>
                        }
                        secondary={
                          [d.referencia, d.distrito, d.provincia, d.departamento].filter(Boolean).join(" • ") || ""
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cerrar
        </Button>
      </DialogActions>

      <Dialog open={direccionFormOpen} onClose={cerrarDireccionForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {direccionEditando ? "Editar Dirección" : "Nueva Dirección"}
            </Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={handleDireccionFormSubmit}>
          <DialogContent dividers>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={cerrarDireccionForm} variant="outlined" color="inherit" startIcon={<CloseIcon />}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              disabled={crearDireccionMutation.isPending || actualizarDireccionMutation.isPending}
            >
              {crearDireccionMutation.isPending || actualizarDireccionMutation.isPending
                ? "Guardando..."
                : direccionEditando
                  ? "Actualizar"
                  : "Guardar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Dialog>
  );
}
