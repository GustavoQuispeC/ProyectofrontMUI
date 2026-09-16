"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import dayjs from "dayjs";
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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SellIcon from "@mui/icons-material/Sell";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { useClientesListado } from "@/features/dashboard/cliente/hooks/useClientesListado";
import { useInventarioAutocomplete } from "@/features/dashboard/inventario/hooks/useInventarioAutocomplete";
import { useCajaSesionActiva } from "@/features/dashboard/caja/hooks/useCajaSesion";
import {
  useRegistrarVenta,
  useTiposPago,
  useModalidadesEntrega,
  useMediosPago,
} from "@/features/dashboard/venta/hooks/useVenta";
import {
  MEDIO_DEPOSITO_BANCARIO,
  MODALIDAD_ENVIO_EMPRESA,
  TIPO_PAGO_CONTADO,
  VentaForm,
  ventaSchema,
} from "@/features/dashboard/venta/venta.schema";
import { RegistrarVentaRequest } from "@/features/dashboard/venta/venta.type";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import { toastPromise } from "@/shared/utils/toast";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const monedaFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const defaultValues: VentaForm = {
  clienteId: 0,
  tiendaId: 0,
  tipoPago: 0,
  descuento: 0,
  modalidadEntrega: 0,
  direccionEntrega: "",
  detalles: [{ productoId: 0, cantidad: 1, precioUnitario: 0, descuentoUnitario: 0 }],
  pagos: [{ tipoMedio: 0, monto: 0, banco: "", numeroOperacion: "", fechaDeposito: "" }],
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

export default function RegistrarVenta() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarVenta) : false;
  const mounted = useMounted();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const { clientes, loading: loadingClientes } = useClientesListado({ pagina: 1, tamanoPagina: 200 });
  const { items: tiposPago, loading: loadingTiposPago } = useTiposPago();
  const { items: modalidadesEntrega, loading: loadingModalidades } = useModalidadesEntrega();
  const { items: mediosPago, loading: loadingMediosPago } = useMediosPago();
  const registrarVentaMutation = useRegistrarVenta();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<VentaForm>({
    resolver: standardSchemaResolver(ventaSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "detalles" });
  const { fields: pagoFields, append: appendPago, remove: removePago } = useFieldArray({ control, name: "pagos" });

  const tiendaId = useWatch({ control, name: "tiendaId" });
  const detalles = useWatch({ control, name: "detalles" });
  const pagos = useWatch({ control, name: "pagos" });
  const descuento = useWatch({ control, name: "descuento" });
  const tipoPago = useWatch({ control, name: "tipoPago" });
  const modalidadEntrega = useWatch({ control, name: "modalidadEntrega" });

  const { inventario, loading: loadingInventario } = useInventarioAutocomplete(tiendaId ? Number(tiendaId) : undefined);

  const tiendaIdNum = tiendaId ? Number(tiendaId) : null;
  const { sesion: sesionCaja, loading: loadingSesion } = useCajaSesionActiva(tiendaIdNum, canAccess);
  const cajaCerrada = !!tiendaIdNum && !loadingSesion && !sesionCaja;

  const prevTienda = useRef<number>(0);
  useEffect(() => {
    const current = tiendaId ? Number(tiendaId) : 0;
    if (prevTienda.current !== current) {
      prevTienda.current = current;
      replace([{ productoId: 0, cantidad: 1, precioUnitario: 0, descuentoUnitario: 0 }]);
      clearErrors("detalles");
    }
  }, [tiendaId, replace, clearErrors]);

  const subtotal = (detalles ?? []).reduce(
    (acc, d) => acc + (Number(d.cantidad) || 0) * (Number(d.precioUnitario) || 0) - (Number(d.descuentoUnitario) || 0),
    0,
  );
  const totalVenta = Math.max(0, subtotal - (Number(descuento) || 0));
  const totalPagado = (pagos ?? []).reduce((acc, p) => acc + (Number(p.monto) || 0), 0);

  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data: VentaForm) => {
    if (cajaCerrada) {
      setError("tiendaId", { type: "manual", message: "La caja de esta tienda está cerrada. Abra caja primero." });
      return;
    }

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

    const payload: RegistrarVentaRequest = {
      clienteId: data.clienteId,
      tiendaId: data.tiendaId,
      tipoPago: data.tipoPago,
      descuento: data.descuento,
      modalidadEntrega: data.modalidadEntrega,
      direccionEntrega: data.modalidadEntrega === MODALIDAD_ENVIO_EMPRESA ? data.direccionEntrega : null,
      detalles: data.detalles.map((d) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        descuentoUnitario: d.descuentoUnitario,
      })),
      pagos: data.pagos.map((p) => ({
        tipoMedio: p.tipoMedio,
        monto: p.monto,
        banco: p.tipoMedio === MEDIO_DEPOSITO_BANCARIO ? p.banco : null,
        numeroOperacion: p.tipoMedio === MEDIO_DEPOSITO_BANCARIO ? p.numeroOperacion : null,
        fechaDeposito: p.tipoMedio === MEDIO_DEPOSITO_BANCARIO ? p.fechaDeposito : null,
      })),
    };

    try {
      setSaving(true);
      await toastPromise(registrarVentaMutation.registrarVenta(payload), {
        loading: "Registrando venta...",
        success: "Venta registrada correctamente",
        error: (error) => error.message,
      });
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
              <SellIcon />
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
                REGISTRO DE VENTA
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Registre una venta indicando cliente, productos y pagos. Requiere caja abierta en la tienda.
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
                name="tiendaId"
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
                        label="Tienda *"
                        placeholder="Seleccione una tienda"
                        error={!!errors.tiendaId}
                        helperText={errors.tiendaId?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="clienteId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={clientes}
                    loading={loadingClientes}
                    value={clientes.find((c) => c.id === field.value) ?? null}
                    onChange={(_, value) => field.onChange(value?.id ?? 0)}
                    getOptionLabel={(option) => option.nombreCompleto || option.razonSocial || `Cliente #${option.id}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText="Sin resultados"
                    loadingText="Cargando..."
                    sx={{ flex: 1, minWidth: 240 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cliente *"
                        placeholder="Seleccione un cliente"
                        error={!!errors.clienteId}
                        helperText={errors.clienteId?.message}
                      />
                    )}
                  />
                )}
              />

              <TextField
                label="Fecha"
                value={dayjs().format("DD/MM/YYYY")}
                slotProps={{ input: { readOnly: true } }}
                sx={{ minWidth: 160 }}
              />
            </Stack>

            {!!tiendaIdNum && loadingSesion && (
              <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  Verificando sesión de caja...
                </Typography>
              </Stack>
            )}

            {cajaCerrada && (
              <Alert
                severity="warning"
                icon={<PointOfSaleIcon />}
                action={
                  <Button color="inherit" size="small" onClick={() => router.push("/dashboard/caja")}>
                    Ir a Caja
                  </Button>
                }
              >
                La caja de esta tienda está cerrada. Debe abrir una sesión de caja antes de registrar una venta.
              </Alert>
            )}

            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { xs: "stretch", sm: "flex-start" },
              }}
            >
              <Controller
                name="tipoPago"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.tipoPago} sx={{ flex: 1, minWidth: 200 }}>
                    <InputLabel id="tipo-pago-label">Tipo de pago *</InputLabel>
                    <Select
                      labelId="tipo-pago-label"
                      label="Tipo de pago *"
                      value={field.value ? String(field.value) : ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      disabled={loadingTiposPago}
                    >
                      {tiposPago.map((t) => (
                        <MenuItem key={t.id} value={String(t.id)}>
                          {t.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.tipoPago && <FormHelperText>{errors.tipoPago.message}</FormHelperText>}
                  </FormControl>
                )}
              />

              <Controller
                name="modalidadEntrega"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.modalidadEntrega} sx={{ flex: 1, minWidth: 200 }}>
                    <InputLabel id="modalidad-entrega-label">Modalidad de entrega *</InputLabel>
                    <Select
                      labelId="modalidad-entrega-label"
                      label="Modalidad de entrega *"
                      value={field.value ? String(field.value) : ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      disabled={loadingModalidades}
                    >
                      {modalidadesEntrega.map((m) => (
                        <MenuItem key={m.id} value={String(m.id)}>
                          {m.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.modalidadEntrega && <FormHelperText>{errors.modalidadEntrega.message}</FormHelperText>}
                  </FormControl>
                )}
              />

              <Controller
                name="descuento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descuento"
                    type="number"
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    error={!!errors.descuento}
                    helperText={errors.descuento?.message}
                    sx={{ minWidth: 140, width: { xs: "100%", sm: 160 } }}
                  />
                )}
              />
            </Stack>

            <Controller
              name="direccionEntrega"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label={
                    modalidadEntrega === MODALIDAD_ENVIO_EMPRESA ? "Dirección de entrega *" : "Dirección de entrega"
                  }
                  fullWidth
                  placeholder="Dirección de entrega"
                  disabled={modalidadEntrega !== MODALIDAD_ENVIO_EMPRESA}
                  error={!!errors.direccionEntrega}
                  helperText={
                    errors.direccionEntrega?.message ??
                    (modalidadEntrega === MODALIDAD_ENVIO_EMPRESA
                      ? "Obligatoria para envío por empresa"
                      : "Solo aplica para envío por empresa")
                  }
                />
              )}
            />
          </Stack>
        </Section>

        <Section title="Detalle de productos">
          <Stack sx={{ gap: 2 }}>
            {fields.map((item, index) => {
              const detalle = detalles?.[index];
              const linea =
                (Number(detalle?.cantidad) || 0) * (Number(detalle?.precioUnitario) || 0) -
                (Number(detalle?.descuentoUnitario) || 0);

              return (
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
                        disabled={!tiendaId}
                        value={inventario.find((p) => p.productoId === field.value) ?? null}
                        onChange={(_, value) => field.onChange(value?.productoId ?? 0)}
                        getOptionLabel={(option) => `${option.productoCodigoInterno} - ${option.productoNombre}`}
                        isOptionEqualToValue={(option, value) => option.productoId === value.productoId}
                        noOptionsText={tiendaId ? "Sin resultados" : "Seleccione primero la tienda"}
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
                      const productoSel = inventario.find((p) => p.productoId === detalle?.productoId);
                      const stockMsg = productoSel ? `Disponible: ${productoSel.stockDisponible}` : undefined;
                      return (
                        <TextField
                          label="Cantidad"
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
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

                  <Controller
                    name={`detalles.${index}.precioUnitario`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Precio unit."
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        error={!!errors.detalles?.[index]?.precioUnitario}
                        helperText={errors.detalles?.[index]?.precioUnitario?.message}
                        sx={{ minWidth: 120, width: { xs: "100%", sm: 140 } }}
                      />
                    )}
                  />

                  <Controller
                    name={`detalles.${index}.descuentoUnitario`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Desc. unit."
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        error={!!errors.detalles?.[index]?.descuentoUnitario}
                        helperText={errors.detalles?.[index]?.descuentoUnitario?.message}
                        sx={{ minWidth: 120, width: { xs: "100%", sm: 140 } }}
                      />
                    )}
                  />

                  <Typography
                    variant="body2"
                    sx={{ minWidth: 90, alignSelf: "center", fontWeight: 600, textAlign: "right" }}
                  >
                    {monedaFormatter.format(linea > 0 ? linea : 0)}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    sx={{ mt: { sm: 0.5 } }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Stack>
              );
            })}

            {errors.detalles?.root?.message && <FormHelperText error>{errors.detalles.root.message}</FormHelperText>}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => append({ productoId: 0, cantidad: 1, precioUnitario: 0, descuentoUnitario: 0 })}
              sx={{ alignSelf: "flex-start" }}
            >
              Agregar producto
            </Button>
          </Stack>
        </Section>

        <Section title="Pagos">
          <Stack sx={{ gap: 2 }}>
            {pagoFields.map((item, index) => {
              const esDeposito = Number(pagos?.[index]?.tipoMedio) === MEDIO_DEPOSITO_BANCARIO;

              return (
                <Stack key={item.id} sx={{ gap: 2 }}>
                  <Stack
                    direction="row"
                    sx={{
                      gap: 2,
                      alignItems: "flex-start",
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Controller
                      name={`pagos.${index}.tipoMedio`}
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          size="small"
                          error={!!errors.pagos?.[index]?.tipoMedio}
                          sx={{ flex: 1, minWidth: 200 }}
                        >
                          <InputLabel id={`medio-pago-label-${index}`}>Medio de pago *</InputLabel>
                          <Select
                            labelId={`medio-pago-label-${index}`}
                            label="Medio de pago *"
                            value={field.value ? String(field.value) : ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                            disabled={loadingMediosPago}
                          >
                            {mediosPago.map((m) => (
                              <MenuItem key={m.id} value={String(m.id)}>
                                {m.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.pagos?.[index]?.tipoMedio && (
                            <FormHelperText>{errors.pagos[index].tipoMedio.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />

                    <Controller
                      name={`pagos.${index}.monto`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Monto"
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                          error={!!errors.pagos?.[index]?.monto}
                          helperText={errors.pagos?.[index]?.monto?.message}
                          sx={{ minWidth: 140, width: { xs: "100%", sm: 180 } }}
                        />
                      )}
                    />

                    <IconButton
                      color="error"
                      onClick={() => removePago(index)}
                      disabled={pagoFields.length === 1}
                      sx={{ mt: { sm: 0.5 } }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Stack>

                  {esDeposito && (
                    <Stack
                      direction="row"
                      sx={{
                        gap: 2,
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Controller
                        name={`pagos.${index}.banco`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            value={field.value ?? ""}
                            label="Banco *"
                            placeholder="Ej: BCP, Interbank"
                            error={!!errors.pagos?.[index]?.banco}
                            helperText={errors.pagos?.[index]?.banco?.message}
                            sx={{ flex: 1, minWidth: 180 }}
                          />
                        )}
                      />

                      <Controller
                        name={`pagos.${index}.numeroOperacion`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            value={field.value ?? ""}
                            label="N° de operación"
                            placeholder="Opcional"
                            error={!!errors.pagos?.[index]?.numeroOperacion}
                            helperText={errors.pagos?.[index]?.numeroOperacion?.message}
                            sx={{ flex: 1, minWidth: 160 }}
                          />
                        )}
                      />

                      <Controller
                        name={`pagos.${index}.fechaDeposito`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            value={field.value ?? ""}
                            label="Fecha de depósito"
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            error={!!errors.pagos?.[index]?.fechaDeposito}
                            helperText={errors.pagos?.[index]?.fechaDeposito?.message}
                            sx={{ flex: 1, minWidth: 160 }}
                          />
                        )}
                      />
                    </Stack>
                  )}
                </Stack>
              );
            })}

            {errors.pagos?.root?.message && <FormHelperText error>{errors.pagos.root.message}</FormHelperText>}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => appendPago({ tipoMedio: 0, monto: 0, banco: "", numeroOperacion: "", fechaDeposito: "" })}
              sx={{ alignSelf: "flex-start" }}
            >
              Agregar pago
            </Button>

            <Divider />
            <Stack direction="row" sx={{ gap: 3, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <Typography variant="body2">
                <strong>Total venta:</strong> {monedaFormatter.format(totalVenta)}
              </Typography>
              <Typography
                variant="body2"
                color={
                  Number(tipoPago) === TIPO_PAGO_CONTADO && totalPagado < totalVenta ? "warning.main" : "success.main"
                }
              >
                <strong>Total pagado:</strong> {monedaFormatter.format(totalPagado)}
              </Typography>
              {Number(tipoPago) === TIPO_PAGO_CONTADO && totalPagado < totalVenta && (
                <Typography variant="body2" color="error.main">
                  <strong>Faltante:</strong> {monedaFormatter.format(totalVenta - totalPagado)}
                </Typography>
              )}
            </Stack>
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
            onClick={() => router.push("/dashboard")}
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
            disabled={saving || loadingTiendas || loadingInventario || cajaCerrada}
            sx={{ minWidth: 160, height: 44, boxShadow: "none", borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
          >
            {saving ? "Guardando..." : "Guardar venta"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
