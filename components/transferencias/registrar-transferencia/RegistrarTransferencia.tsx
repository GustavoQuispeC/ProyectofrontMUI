"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
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
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { useInventarioAutocomplete } from "@/features/dashboard/inventario/hooks/useInventarioAutocomplete";
import { useRegistrarTransferencia } from "@/features/dashboard/transferencia/hooks/useTransferencias";
import {
  RegistrarTransferenciaForm,
  RegistrarTransferenciaSchema,
} from "@/features/dashboard/transferencia/transferencia.schema";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import { toastPromise } from "@/shared/utils/toast";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const defaultValues: RegistrarTransferenciaForm = {
  TiendaOrigenId: 0,
  TiendaDestinoId: 0,
  Fecha: dayjs().format("YYYY-MM-DD"),
  Motivo: "",
  Detalles: [{ ProductoId: 0, Cantidad: 1 }],
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

export default function RegistrarTransferencia() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarTransferencia) : false;
  const mounted = useMounted();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const { registrarTransferenciaAsync } = useRegistrarTransferencia();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegistrarTransferenciaForm>({
    resolver: standardSchemaResolver(RegistrarTransferenciaSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "Detalles",
  });

  const tiendaOrigenId = useWatch({ control, name: "TiendaOrigenId" });
  const detalles = useWatch({ control, name: "Detalles" });
  const { inventario, loading: loadingInventario } = useInventarioAutocomplete(
    tiendaOrigenId ? Number(tiendaOrigenId) : undefined,
  );

  // Limpiar detalles cuando cambia la tienda origen (el inventario es por tienda)
  const prevTiendaOrigen = useRef<number>(0);
  useEffect(() => {
    const current = tiendaOrigenId ? Number(tiendaOrigenId) : 0;
    if (prevTiendaOrigen.current !== current) {
      prevTiendaOrigen.current = current;
      replace([{ ProductoId: 0, Cantidad: 1 }]);
      clearErrors("Detalles");
    }
  }, [tiendaOrigenId, replace, clearErrors]);

  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data: RegistrarTransferenciaForm) => {
    // Validar que la cantidad no exceda el stock disponible
    for (let i = 0; i < data.Detalles.length; i++) {
      const detalle = data.Detalles[i];
      const item = inventario.find((p) => p.productoId === detalle.ProductoId);
      if (item && detalle.Cantidad > item.stockDisponible) {
        setError(`Detalles.${i}.Cantidad`, {
          type: "manual",
          message: `Stock disponible: ${item.stockDisponible}`,
        });
        return;
      }
    }

    try {
      setSaving(true);
      await toastPromise(
        registrarTransferenciaAsync({
          ...data,
          Motivo: data.Motivo?.trim() || null,
        }),
        {
          loading: "Registrando transferencia...",
          success: "Transferencia registrada correctamente",
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
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
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
                <SwapHorizIcon />
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
                  REGISTRO DE TRANSFERENCIA DE PRODUCTOS
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Registre la transferencia de mercadería entre tiendas con su detalle de productos.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Stack sx={{ gap: 2 }}>
          {/* Información general */}
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
                  name="TiendaOrigenId"
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
                          error={!!errors.TiendaOrigenId}
                          helperText={errors.TiendaOrigenId?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="TiendaDestinoId"
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
                          label="Tienda destino"
                          placeholder="Seleccione una tienda"
                          error={!!errors.TiendaDestinoId}
                          helperText={errors.TiendaDestinoId?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="Fecha"
                  control={control}
                  render={({ field }) => (
                    <FormControl sx={{ flex: 1, minWidth: 180 }} error={!!errors.Fecha}>
                      <DatePicker
                        label="Fecha"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(val) => field.onChange(val?.format("YYYY-MM-DD") ?? "")}
                        slotProps={{
                          textField: { fullWidth: true, error: !!errors.Fecha },
                        }}
                      />
                      <FormHelperText>{errors.Fecha?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Stack>

              <Controller
                name="Motivo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    label="Motivo"
                    multiline
                    rows={2}
                    fullWidth
                    placeholder="Motivo de la transferencia (opcional)"
                    error={!!errors.Motivo}
                    helperText={errors.Motivo?.message}
                  />
                )}
              />
            </Stack>
          </Section>

          {/* Detalles */}
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
                    name={`Detalles.${index}.ProductoId`}
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
                            error={!!errors.Detalles?.[index]?.ProductoId}
                            helperText={errors.Detalles?.[index]?.ProductoId?.message}
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name={`Detalles.${index}.Cantidad`}
                    control={control}
                    render={({ field }) => {
                      const productoSel = inventario.find((p) => p.productoId === detalles?.[index]?.ProductoId);
                      const stockMsg = productoSel ? `Disponible: ${productoSel.stockDisponible}` : undefined;
                      return (
                        <TextField
                          label="Cantidad"
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          slotProps={{ htmlInput: { min: 1, max: productoSel?.stockDisponible } }}
                          error={!!errors.Detalles?.[index]?.Cantidad}
                          helperText={errors.Detalles?.[index]?.Cantidad?.message ?? stockMsg}
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

              {errors.Detalles?.root?.message && <FormHelperText error>{errors.Detalles.root.message}</FormHelperText>}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => append({ ProductoId: 0, Cantidad: 1 })}
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
              onClick={() => router.push("/dashboard/transferencias/listar")}
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
              disabled={saving || loadingTiendas}
              sx={{ minWidth: 160, height: 44, boxShadow: "none", borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
            >
              {saving ? "Guardando..." : "Guardar transferencia"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
