"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import dayjs from "dayjs";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormHelperText,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { useEmpleadosAutocomplete } from "@/features/dashboard/empleado/hooks/useEmpleadosAutocomplete";
import { useInventarioAutocomplete } from "@/features/dashboard/inventario/hooks/useInventarioAutocomplete";
import { useCrearSalida } from "@/features/dashboard/salida/hooks/useCrearSalida";
import { SalidaForm, salidaSchema } from "@/features/dashboard/salida/salida.schema";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import { toastPromise } from "@/shared/utils/toast";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const defaultValues: SalidaForm = {
  tiendaOrigenId: 0,
  origen: 2,
  empleadoSolicitaId: null,
  motivo: null,
  detalles: [{ productoId: 0, cantidad: 1 }],
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.25,
          bgcolor: "action.hover",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", letterSpacing: "0.02em" }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Paper>
  );
}

export default function RegistrarSalida() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarSalida) : false;
  const mounted = useMounted();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const { empleados, loading: loadingEmpleados } = useEmpleadosAutocomplete();
  const crearSalidaMutation = useCrearSalida();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SalidaForm>({
    resolver: standardSchemaResolver(salidaSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "detalles",
  });

  const tiendaOrigenId = useWatch({ control, name: "tiendaOrigenId" });
  const detalles = useWatch({ control, name: "detalles" });

  const { inventario, loading: loadingInventario } = useInventarioAutocomplete(
    tiendaOrigenId ? Number(tiendaOrigenId) : undefined,
  );

  const prevTiendaOrigen = useRef<number>(0);
  useEffect(() => {
    const current = tiendaOrigenId ? Number(tiendaOrigenId) : 0;
    if (prevTiendaOrigen.current !== current) {
      prevTiendaOrigen.current = current;
      replace([{ productoId: 0, cantidad: 1 }]);
      clearErrors("detalles");
    }
  }, [tiendaOrigenId, replace, clearErrors]);

  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data: SalidaForm) => {
    for (let i = 0; i < data.detalles.length; i++) {
      const detalle = data.detalles[i];
      const item = inventario.find((p) => p.productoId === detalle.productoId);
      if (item && detalle.cantidad > item.stockDisponible) {
        setError(`detalles.${i}.cantidad`, {
          type: "manual",
          message: `Stock disponible: ${item.stockDisponible}`,
        });
        return;
      }
    }

    try {
      setSaving(true);
      await toastPromise(
        crearSalidaMutation.mutateAsync({
          tiendaOrigenId: data.tiendaOrigenId,
          origen: data.origen,
          empleadoSolicitaId: data.empleadoSolicitaId ?? null,
          motivo: data.motivo?.trim() || null,
          detalles: data.detalles.map((d) => ({ productoId: d.productoId, cantidad: d.cantidad })),
        }),
        {
          loading: "Registrando salida...",
          success: "Salida registrada correctamente",
          error: (error) => error.message,
        },
      );
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 3,
          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, md: 3 },
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: { xs: 48, md: 52 },
                height: { xs: 48, md: 52 },
              }}
            >
              <ArrowOutwardIcon />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: { xs: "1.25rem", sm: "1.25rem" },
                }}
              >
                REGISTRO DE SALIDA DE PRODUCTOS
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Registre la salida de mercadería según el origen y productos disponibles en la tienda.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack sx={{ gap: 2 }}>
        <Section title="Información general">
          <Stack sx={{ gap: 2 }}>
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "flex-start" },
              }}
            >
              <Controller
                name="tiendaOrigenId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={tiendas}
                    loading={loadingTiendas}
                    value={tiendas.find((t) => t.id === field.value) ?? null}
                    onChange={(_, value) => field.onChange(value?.id ?? 0)}
                    getOptionLabel={(option) => option.nombre}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText="Sin resultados"
                    loadingText="Cargando..."
                    sx={{ flex: 1, minWidth: 240 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tienda origen"
                        placeholder="Seleccione una tienda"
                        error={!!errors.tiendaOrigenId}
                        helperText={errors.tiendaOrigenId?.message}
                      />
                    )}
                  />
                )}
              />

              <TextField
                label="Fecha"
                value={dayjs().format("DD/MM/YYYY")}
                slotProps={{ input: { readOnly: true } }}
                sx={{ flex: 1, minWidth: 180 }}
              />
            </Stack>

            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "flex-start" },
              }}
            >
              <Controller
                name="empleadoSolicitaId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={empleados}
                    loading={loadingEmpleados}
                    value={empleados.find((e) => e.id === field.value) ?? null}
                    onChange={(_, value) => field.onChange(value?.id ?? null)}
                    getOptionLabel={(option) => option.nombreCompleto}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText="Sin resultados"
                    loadingText="Cargando..."
                    sx={{ flex: 1, minWidth: 260 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Empleado solicitante *"
                        placeholder="Seleccione un empleado"
                        error={!!errors.empleadoSolicitaId}
                        helperText={errors.empleadoSolicitaId?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="motivo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    label="Motivo"
                    multiline
                    rows={1}
                    fullWidth
                    placeholder="Motivo de la salida (opcional)"
                    error={!!errors.motivo}
                    helperText={errors.motivo?.message}
                    sx={{ flex: 2, minWidth: 260 }}
                  />
                )}
              />
            </Stack>
          </Stack>
        </Section>

        <Section title="Detalle de productos">
          <Stack sx={{ gap: 2 }}>
            {fields.map((item, index) => (
              <Stack
                key={item.id}
                direction="row"
                sx={{
                  gap: 2,
                  alignItems: "flex-start",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Controller
                  name={`detalles.${index}.productoId`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={inventario}
                      loading={loadingInventario}
                      disabled={!tiendaOrigenId}
                      value={inventario.find((p) => p.productoId === field.value) ?? null}
                      onChange={(_, value) => field.onChange(value?.productoId ?? 0)}
                      getOptionLabel={(option) => `${option.productoCodigoInterno} - ${option.productoNombre}`}
                      isOptionEqualToValue={(option, value) => option.productoId === value.productoId}
                      noOptionsText={tiendaOrigenId ? "Sin resultados" : "Seleccione primero la tienda origen"}
                      loadingText="Cargando..."
                      sx={{ flex: 1, minWidth: 260, width: "100%" }}
                      renderOption={(props, option) => {
                        const { key, ...optionProps } = props as React.HTMLAttributes<HTMLLIElement> & {
                          key: React.Key;
                        };
                        return (
                          <li key={key} {...optionProps}>
                            <Box sx={{ color: option.stockDisponible <= 0 ? "error.main" : "text.primary" }}>
                              {option.productoCodigoInterno} - {option.productoNombre}
                            </Box>
                            <Typography variant="caption" sx={{ ml: 2 }}>
                              Disponible: {option.stockDisponible}
                            </Typography>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Producto"
                          placeholder="Seleccione un producto"
                          error={!!errors.detalles?.[index]?.productoId}
                          helperText={errors.detalles?.[index]?.productoId?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name={`detalles.${index}.cantidad`}
                  control={control}
                  render={({ field }) => {
                    const productoSel = inventario.find((p) => p.productoId === detalles?.[index]?.productoId);
                    const stockMsg = productoSel ? `Disponible: ${productoSel.stockDisponible}` : undefined;
                    return (
                      <TextField
                        label="Cantidad"
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        slotProps={{
                          htmlInput: { min: 0.01, step: 0.01, max: productoSel?.stockDisponible },
                        }}
                        error={!!errors.detalles?.[index]?.cantidad}
                        helperText={errors.detalles?.[index]?.cantidad?.message ?? stockMsg}
                        sx={{ minWidth: 120, width: { xs: "100%", sm: 140 } }}
                      />
                    );
                  }}
                />

                <IconButton
                  color="error"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  sx={{ mt: { sm: 1 } }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Stack>
            ))}

            {errors.detalles?.root?.message && <FormHelperText error>{errors.detalles.root.message}</FormHelperText>}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => append({ productoId: 0, cantidad: 1 })}
              sx={{ alignSelf: "flex-start" }}
            >
              Agregar producto
            </Button>
          </Stack>
        </Section>

        <Divider />

        <Stack
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "stretch", sm: "flex-end" },
            gap: { xs: 1, sm: 1.5 },
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => router.push("/dashboard/salidas/listar")}
            disabled={saving}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            Volver
          </Button>

          <Button
            variant="outlined"
            color="warning"
            startIcon={<RestartAltIcon />}
            onClick={resetForm}
            disabled={saving}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            Limpiar
          </Button>

          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
            onClick={handleSubmit(onSubmit)}
            disabled={saving || loadingTiendas || loadingInventario}
            sx={{ minWidth: 160, height: 44, boxShadow: "none", borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
          >
            {saving ? "Guardando..." : "Guardar salida"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
