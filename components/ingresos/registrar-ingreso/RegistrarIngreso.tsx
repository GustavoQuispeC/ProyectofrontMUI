"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import { useProveedores } from "@/features/dashboard/proveedor/hooks/useProveedores";
import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { useProductosAutocomplete } from "@/features/dashboard/producto/hooks/useProductosAutocomplete";
import { useRegistrarIngreso } from "@/features/dashboard/Ingreso/hooks/useIngreso";
import { RegistrarIngresoForm, RegistrarIngresoSchema } from "@/features/dashboard/Ingreso/ingreso.schema";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import { toastPromise } from "@/shared/utils/toast";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const defaultValues: RegistrarIngresoForm = {
  ProveedorId: 0,
  TiendaDestinoId: 0,
  TipoDocumento: 0,
  SerieDocumento: "",
  NumeroDocumento: "",
  Fecha: "",
  Observaciones: "",
  MontoTotal: 0,
  Detalles: [{ ProductoId: 0, Cantidad: 1 }],
};

const tiposDocumento = [
  { id: 1, nombre: "Factura" },
  { id: 2, nombre: "Boleta" },
  { id: 3, nombre: "Nota de crédito" },
  { id: 4, nombre: "Guía de remisión" },
];

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

export default function RegistrarIngreso() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarIngreso) : false;
  const mounted = useMounted();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { proveedores, loading: loadingProveedores } = useProveedores(canAccess);
  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const { productos, loading: loadingProductos } = useProductosAutocomplete();
  const { registrarIngresoAsync } = useRegistrarIngreso();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrarIngresoForm>({
    resolver: standardSchemaResolver(RegistrarIngresoSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Detalles",
  });

  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data: RegistrarIngresoForm) => {
    try {
      setSaving(true);
      await toastPromise(
        registrarIngresoAsync({
          ...data,
          Observaciones: data.Observaciones?.trim() || null,
        }),
        {
          loading: "Registrando ingreso...",
          success: "Ingreso registrado correctamente",
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
                <InventoryIcon />
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
                  REGISTRO DE INGRESO DE PRODUCTOS
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Registre la entrada de mercadería con su documento y detalle de productos.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Stack sx={{ gap: 2 }}>
          {/* Documento y origen */}
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
                  name="ProveedorId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={proveedores}
                      loading={loadingProveedores}
                      value={proveedores.find((p) => p.id === field.value) ?? null}
                      onChange={(_, value) => field.onChange(value?.id ?? 0)}
                      getOptionLabel={(option) => option.razonSocial}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      noOptionsText="Sin resultados"
                      loadingText="Cargando..."
                      sx={{ flex: 1, minWidth: 240 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Proveedor"
                          placeholder="Seleccione un proveedor"
                          error={!!errors.ProveedorId}
                          helperText={errors.ProveedorId?.message}
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
              </Stack>

              <Stack
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: { xs: "stretch", sm: "flex-start" },
                }}
              >
                <FormControl sx={{ minWidth: 200 }} error={!!errors.TipoDocumento}>
                  <InputLabel id="tipo-documento-label">Tipo de documento</InputLabel>
                  <Controller
                    name="TipoDocumento"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="tipo-documento-label"
                        label="Tipo de documento"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      >
                        <MenuItem value="" disabled>
                          Seleccione
                        </MenuItem>
                        {tiposDocumento.map((tipo) => (
                          <MenuItem key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.TipoDocumento?.message}</FormHelperText>
                </FormControl>

                <Controller
                  name="SerieDocumento"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Serie documento"
                      placeholder="Ej. F001"
                      error={!!errors.SerieDocumento}
                      helperText={errors.SerieDocumento?.message}
                      sx={{ flex: 1, minWidth: 120 }}
                    />
                  )}
                />

                <Controller
                  name="NumeroDocumento"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número documento"
                      placeholder="Ej. 123458"
                      error={!!errors.NumeroDocumento}
                      helperText={errors.NumeroDocumento?.message}
                      sx={{ flex: 1, minWidth: 160 }}
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

                <Controller
                  name="MontoTotal"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Monto total"
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      error={!!errors.MontoTotal}
                      helperText={errors.MontoTotal?.message}
                      sx={{ flex: 1, minWidth: 160 }}
                    />
                  )}
                />
              </Stack>

              <Controller
                name="Observaciones"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    label="Observaciones"
                    multiline
                    rows={2}
                    fullWidth
                    placeholder="Notas adicionales (opcional)"
                    error={!!errors.Observaciones}
                    helperText={errors.Observaciones?.message}
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
                        options={productos}
                        loading={loadingProductos}
                        value={productos.find((p) => p.id === field.value) ?? null}
                        onChange={(_, value) => field.onChange(value?.id ?? 0)}
                        getOptionLabel={(option) => option.nombre}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        noOptionsText="Sin resultados"
                        loadingText="Cargando..."
                        sx={{ flex: 1, minWidth: 260, width: "100%" }}
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
                    render={({ field }) => (
                      <TextField
                        label="Cantidad"
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        slotProps={{ htmlInput: { min: 1 } }}
                        error={!!errors.Detalles?.[index]?.Cantidad}
                        helperText={errors.Detalles?.[index]?.Cantidad?.message}
                        sx={{ minWidth: 120, width: { xs: "100%", sm: 140 } }}
                      />
                    )}
                  />

                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    sx={{ mt: { sm: 1 } }}
                  >
                    <DeleteIcon />
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
              onClick={() => router.push("/dashboard/Inicio")}
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
              disabled={saving || loadingProveedores || loadingTiendas || loadingProductos}
              sx={{ minWidth: 160, height: 44, boxShadow: "none", borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
            >
              {saving ? "Guardando..." : "Guardar ingreso"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
