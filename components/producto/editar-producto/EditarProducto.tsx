"use client";
import {
  useCategoriasPadres,
  useSubcategorias,
  useCategoria,
} from "@/features/dashboard/categoria/hooks/useCategorias";
import { useMarcas } from "@/features/dashboard/marca/hooks/useMarcas";
import { useUnidadesMedida } from "@/features/dashboard/unidadMedida/hooks/useUnidadesMedida";
import { useListasPrecio } from "@/features/dashboard/listaPrecio/hooks/useListasPrecio";
import { useProducto, useEditarProducto, useSubirImagen } from "@/features/dashboard/producto/hooks/useProductos";
import { ProductoForm, productoSchema } from "@/features/dashboard/producto/producto.schema";
import { DetalleProducto, EditarProductoRequest } from "@/features/dashboard/producto/Producto.types";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toastPromise } from "@/shared/utils/toast";
import { toDotNetDateTime } from "@/shared/utils/date";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InventoryIcon from "@mui/icons-material/Inventory";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const MAX_IMAGENES = 5;

const hoy = dayjs();
const defaultPrecio = {
  listaPrecioId: 0,
  precio: 0,
  precioMinimo: null as number | null,
  precioMaximo: null as number | null,
  fechaInicio: toDotNetDateTime({ year: hoy.year(), month: hoy.month() + 1, day: hoy.date() }),
  fechaFin: null as string | null,
};

type InputCardProps = TextFieldProps;
export const InputCard = (props: InputCardProps) => (
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

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section = ({ icon, title, children }: SectionProps) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      p: { xs: 2, sm: 3 },
      mb: 2,
    }}
  >
    <Stack direction="row" sx={{ mb: 2, gap: 1, alignItems: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "white",
          "& svg": { fontSize: 18 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Stack>
    <Divider sx={{ mb: 2 }} />
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Paper>
);

interface ImagenLocal {
  key: string;
  id?: number;
  url: string;
  file?: File;
  esPrincipal: boolean;
}

interface EditarProductoFormProps {
  id: number;
  producto: DetalleProducto;
}

function mapProductoToDefaults(producto: DetalleProducto): ProductoForm {
  return {
    ...producto,
    codigoBarras: producto.codigoBarras ?? "",
    descripcion: producto.descripcion ?? "",
    fechaVencimiento: producto.fechaVencimiento ?? null,
    imagenes: producto.imagenes.map((img) => ({
      id: img.id,
      url: img.url ?? "",
      esPrincipal: img.esPrincipal,
      orden: img.orden,
      eliminar: false,
    })),
    precios: producto.precios.map((p) => ({
      id: p.id,
      listaPrecioId: p.listaPrecioId,
      precio: p.precio,
      precioMinimo: p.precioMinimo ?? null,
      precioMaximo: p.precioMaximo ?? null,
      fechaInicio: p.fechaInicio,
      fechaFin: p.fechaFin,
      eliminar: false,
    })),
  };
}

function EditarProductoForm({ id, producto }: EditarProductoFormProps) {
  const keyCounterRef = useRef(0);
  const initialImagenes = useMemo<ImagenLocal[]>(() => {
    return producto.imagenes.map((img, index) => ({
      key: img.id !== undefined ? `img-${img.id}` : `new-${index}`,
      id: img.id,
      url: img.url ?? "",
      esPrincipal: img.esPrincipal,
    }));
  }, [producto]);
  const initialPrincipalIndex = useMemo(
    () =>
      Math.max(
        0,
        producto.imagenes.findIndex((img) => img.esPrincipal),
      ),
    [producto],
  );
  const defaultFormValues = useMemo(() => mapProductoToDefaults(producto), [producto]);

  const [imagenes, setImagenes] = useState<ImagenLocal[]>(() => initialImagenes);
  const [principalIndex, setPrincipalIndex] = useState(() => initialPrincipalIndex);
  const [categoriaPadreId, setCategoriaPadreId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { categoria: categoriaDetalle } = useCategoria(producto?.categoriaId ?? null);
  const padreSeleccionado = categoriaPadreId ?? categoriaDetalle?.categoriaPadreId ?? null;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductoForm>({
    resolver: standardSchemaResolver(productoSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const syncImagenesToForm = useCallback(
    (nextImagenes: ImagenLocal[], nextPrincipal: number) => {
      setValue(
        "imagenes",
        nextImagenes.map((img, i) => ({
          id: img.id,
          url: img.url,
          esPrincipal: i === nextPrincipal,
          orden: i + 1,
          eliminar: false,
        })),
      );
    },
    [setValue],
  );

  const { categorias: categoriasPadre, loading: loadingPadres } = useCategoriasPadres();
  const { categorias: subcategorias, loading: loadingSubcategorias } = useSubcategorias(padreSeleccionado);
  const { marcas } = useMarcas(true);
  const { unidadesMedida } = useUnidadesMedida(true);
  const { listasPrecio } = useListasPrecio(true);

  const editarProductoMutation = useEditarProducto();
  const subirImagenMutation = useSubirImagen();
  const isSubmitting = editarProductoMutation.loading || subirImagenMutation.loading;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "precios",
  });

  //! Imágenes
  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const restantes = Math.max(0, MAX_IMAGENES - imagenes.length);
    const nuevos = Array.from(files)
      .slice(0, restantes)
      .map((file) => ({
        key: `new-${keyCounterRef.current++}`,
        file,
        url: URL.createObjectURL(file),
        esPrincipal: false,
      }));

    setImagenes((prev) => {
      const updated = [...prev, ...nuevos];
      const nextPrincipal = updated.length > 0 && principalIndex === -1 ? 0 : principalIndex;
      setPrincipalIndex(nextPrincipal);
      syncImagenesToForm(updated, nextPrincipal);
      return updated;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImagenes((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const nextPrincipal = (() => {
        if (index === principalIndex) return updated.length > 0 ? 0 : -1;
        if (index < principalIndex) return principalIndex - 1;
        return principalIndex;
      })();
      setPrincipalIndex(nextPrincipal);
      syncImagenesToForm(updated, nextPrincipal);
      return updated;
    });
  };

  const handleSetPrincipal = (index: number) => {
    setImagenes((prev) => {
      const updated = prev.map((img, i) => ({ ...img, esPrincipal: i === index }));
      syncImagenesToForm(updated, index);
      return updated;
    });
    setPrincipalIndex(index);
  };

  //! RESET
  const resetForm = () => {
    if (producto) {
      reset({
        ...producto,
        codigoBarras: producto.codigoBarras ?? "",
        descripcion: producto.descripcion ?? "",
        fechaVencimiento: producto.fechaVencimiento ?? null,
        imagenes: producto.imagenes.map((img) => ({
          id: img.id,
          url: img.url ?? "",
          esPrincipal: img.esPrincipal,
          orden: img.orden,
          eliminar: false,
        })),
        precios: producto.precios.map((p) => ({
          id: p.id,
          listaPrecioId: p.listaPrecioId,
          precio: p.precio,
          precioMinimo: p.precioMinimo ?? null,
          precioMaximo: p.precioMaximo ?? null,
          fechaInicio: p.fechaInicio,
          fechaFin: p.fechaFin,
          eliminar: false,
        })),
      });
      const resetImagenes = producto.imagenes.map((img) => ({
        key: `img-${img.id ?? Math.random().toString(36).slice(2)}`,
        id: img.id,
        url: img.url ?? "",
        esPrincipal: img.esPrincipal,
      }));
      setImagenes(resetImagenes);
      const principal = producto.imagenes.findIndex((img) => img.esPrincipal);
      const nextPrincipal = resetImagenes.length > 0 ? Math.max(0, principal) : -1;
      setPrincipalIndex(nextPrincipal);
      syncImagenesToForm(resetImagenes, nextPrincipal);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  //! SUBMIT
  const onSubmit = async (data: ProductoForm) => {
    try {
      const imagenesPayload = [];
      for (let i = 0; i < imagenes.length; i++) {
        const img = imagenes[i];
        let url = img.url;
        if (img.file) {
          const result = await subirImagenMutation.subirImagen(img.file);
          url = result.url;
        }
        imagenesPayload.push({
          id: img.id,
          url,
          esPrincipal: i === principalIndex,
          orden: i + 1,
        });
      }

      if (imagenesPayload.length === 0) {
        imagenesPayload.push({
          url: "/sinFoto.png",
          esPrincipal: true,
          orden: 1,
        });
      }

      const payload: EditarProductoRequest = {
        ...data,
        isActive: producto?.isActive ?? true,
        imagenes: imagenesPayload,
        precios: data.precios.map((p) => ({
          id: p.id,
          listaPrecioId: p.listaPrecioId,
          precio: p.precio,
          precioMinimo: p.precioMinimo,
          precioMaximo: p.precioMaximo,
          fechaInicio: p.fechaInicio,
        })),
      };

      console.log("Payload a enviar:", payload);
      console.log("Precios del formulario:", data.precios);

      await toastPromise(editarProductoMutation.editarProducto({ id, data: payload }), {
        loading: "Actualizando producto...",
        success: "Producto actualizado correctamente.",
        error: (error) => error.message,
      });
      router.push("/dashboard/productos/listar");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => e.preventDefault()}
      sx={{
        width: "100%",
        bgcolor: "background.default",
        minHeight: "100vh",
        py: { xs: 2, md: 5 },
        px: 2,
      }}
    >
      {/* Encabezado */}
      <Card variant="outlined" sx={{ mb: 2, borderRadius: 3, boxShadow: "none" }}>
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
              <EditIcon />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "text.primary", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                Editar Producto
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Modifique la información, imágenes y precios del producto
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* SECCIÓN 1: Información General */}
      <Section icon={<InventoryIcon />} title="Información General">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                label="Nombre *"
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="codigoBarras"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Código de Barras"
                error={!!errors.codigoBarras}
                helperText={errors.codigoBarras?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="categoria-padre-label">Categoría padre</InputLabel>
            <Select
              labelId="categoria-padre-label"
              label="Categoría padre"
              value={padreSeleccionado === null ? "" : String(padreSeleccionado)}
              onChange={(e) => {
                const value = e.target.value;
                setCategoriaPadreId(value === "" ? null : Number(value));
                setValue("categoriaId", 0);
              }}
              disabled={loadingPadres}
            >
              <MenuItem value="">
                <em>Seleccione una categoría padre</em>
              </MenuItem>
              {categoriasPadre.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="categoriaId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.categoriaId}>
                <InputLabel>Subcategoría *</InputLabel>
                <Select
                  value={subcategorias.some((c) => c.id === field.value) ? field.value : ""}
                  label="Subcategoría *"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled={!padreSeleccionado || loadingSubcategorias}
                >
                  <MenuItem value="">
                    <em>Seleccione una subcategoría</em>
                  </MenuItem>
                  {subcategorias.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.categoriaId?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="marcaId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.marcaId}>
                <InputLabel>Marca *</InputLabel>
                <Select
                  value={marcas.some((m) => m.id === field.value) ? field.value : ""}
                  label="Marca *"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {marcas.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.marcaId?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="unidadMedidaId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.unidadMedidaId}>
                <InputLabel>Unidad de Medida *</InputLabel>
                <Select
                  value={unidadesMedida.some((u) => u.id === field.value) ? field.value : ""}
                  label="Unidad de Medida *"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {unidadesMedida.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre} ({item.abreviatura})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.unidadMedidaId?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="costoActual"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Costo Actual *"
                type="number"
                error={!!errors.costoActual}
                helperText={errors.costoActual?.message}
                onFocus={(e) => e.target.select()}
                onChange={(e) => field.onChange(Number(e.target.value))}
                slotProps={{ input: { startAdornment: <InputAdornment position="start">S/</InputAdornment> } }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="stockMinimo"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Stock Mínimo *"
                type="number"
                error={!!errors.stockMinimo}
                helperText={errors.stockMinimo?.message}
                onFocus={(e) => e.target.select()}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Controller
              name="fechaVencimiento"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fechaVencimiento}>
                  <DatePicker
                    label="Fecha de Vencimiento (Opcional)"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(val) =>
                      field.onChange(
                        val ? toDotNetDateTime({ year: val.year(), month: val.month() + 1, day: val.date() }) : null,
                      )
                    }
                    slotProps={{
                      textField: { size: "small", fullWidth: true, error: !!errors.fechaVencimiento },
                      field: { clearable: true },
                    }}
                  />
                  <FormHelperText>{errors.fechaVencimiento?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={12}>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Descripción"
                multiline
                minRows={2}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
              />
            )}
          />
        </Grid>
      </Section>

      {/* SECCIÓN 2: Imágenes */}
      <Section icon={<ImageIcon />} title={`Imágenes (máximo ${MAX_IMAGENES})`}>
        <Grid size={12}>
          <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            {imagenes.map((img, index) => (
              <Box
                key={img.key}
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "2px solid",
                  borderColor: index === principalIndex ? "primary.main" : "divider",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={img.url}
                  alt={`Imagen ${index + 1}`}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0,0,0,0.3)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    "&:hover": { opacity: 1 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleSetPrincipal(index)}
                    sx={{
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    title="Marcar como principal"
                  >
                    {index === principalIndex ? (
                      <StarIcon fontSize="small" color="primary" />
                    ) : (
                      <StarBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    title="Eliminar imagen"
                  >
                    <CloseIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              </Box>
            ))}

            {imagenes.length < MAX_IMAGENES && (
              <Button
                component="label"
                variant="outlined"
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  flexDirection: "column",
                  gap: 1,
                  fontSize: 12,
                  borderStyle: "dashed",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 32 }} />
                Agregar
                <input ref={fileInputRef} hidden type="file" accept="image/*" multiple onChange={handleAddImages} />
              </Button>
            )}
          </Stack>
          {imagenes.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
              La imagen marcada con <StarIcon sx={{ fontSize: 12, verticalAlign: "middle" }} /> será la principal.
            </Typography>
          )}
        </Grid>
      </Section>

      {/* SECCIÓN 3: Precios por Lista */}
      <Section icon={<PriceChangeIcon />} title="Precios por Lista">
        <Grid size={12}>
          {errors.precios?.root?.message && (
            <Typography variant="caption" color="error" sx={{ mb: 1, display: "block" }}>
              {errors.precios.root.message}
            </Typography>
          )}
          {errors.precios?.message && (
            <Typography variant="caption" color="error" sx={{ mb: 1, display: "block" }}>
              {errors.precios.message}
            </Typography>
          )}
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <Paper key={field.id} variant="outlined" sx={{ p: 2, borderRadius: 2, position: "relative" }}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 1,
                    pt: 2,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "transparent" },
                  }}
                  title="Eliminar precio"
                >
                  <DeleteForeverIcon fontSize="medium" />
                </IconButton>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <Controller
                      name={`precios.${index}.listaPrecioId`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small" error={!!errors.precios?.[index]?.listaPrecioId}>
                          <InputLabel>Lista de Precio *</InputLabel>
                          <Select
                            value={listasPrecio.some((l) => l.id === field.value) ? field.value : ""}
                            label="Lista de Precio *"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          >
                            <MenuItem value="">
                              <em>Seleccione</em>
                            </MenuItem>
                            {listasPrecio.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{errors.precios?.[index]?.listaPrecioId?.message}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                    <Controller
                      name={`precios.${index}.precio`}
                      control={control}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          label="Precio *"
                          type="number"
                          error={!!errors.precios?.[index]?.precio}
                          helperText={errors.precios?.[index]?.precio?.message}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          slotProps={{
                            input: { startAdornment: <InputAdornment position="start">S/</InputAdornment> },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                    <Controller
                      name={`precios.${index}.precioMinimo`}
                      control={control}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          label="P. Mínimo"
                          type="number"
                          error={!!errors.precios?.[index]?.precioMinimo}
                          helperText={errors.precios?.[index]?.precioMinimo?.message}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                    <Controller
                      name={`precios.${index}.precioMaximo`}
                      control={control}
                      render={({ field }) => (
                        <InputCard
                          {...field}
                          value={field.value ?? ""}
                          label="P. Máximo"
                          type="number"
                          error={!!errors.precios?.[index]?.precioMaximo}
                          helperText={errors.precios?.[index]?.precioMaximo?.message}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                      <Controller
                        name={`precios.${index}.fechaInicio`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.precios?.[index]?.fechaInicio}>
                            <DatePicker
                              label="Inicio *"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(val) =>
                                field.onChange(
                                  val
                                    ? toDotNetDateTime({ year: val.year(), month: val.month() + 1, day: val.date() })
                                    : "",
                                )
                              }
                              slotProps={{
                                textField: {
                                  size: "small",
                                  fullWidth: true,
                                  error: !!errors.precios?.[index]?.fechaInicio,
                                },
                              }}
                            />
                          </FormControl>
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                      <Controller
                        name={`precios.${index}.fechaFin`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <DatePicker
                              label="Fin (Opcional)"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(val) =>
                                field.onChange(
                                  val
                                    ? toDotNetDateTime({ year: val.year(), month: val.month() + 1, day: val.date() })
                                    : null,
                                )
                              }
                              slotProps={{
                                textField: { size: "small", fullWidth: true },
                                field: { clearable: true },
                              }}
                            />
                          </FormControl>
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={{ xs: 6, md: 1.5 }} sx={{ display: "flex" }}>
                    {/* Espacio para el botón eliminar */}
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>

          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => append(defaultPrecio)}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Agregar Precio
          </Button>
        </Grid>
      </Section>

      {/* Botones inferiores */}
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => router.push("/dashboard/productos/listar")}
          sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
        >
          Volver
        </Button>

        <Button
          variant="outlined"
          color="warning"
          startIcon={<RestartAltIcon />}
          onClick={resetForm}
          sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
        >
          Restaurar
        </Button>

        <Button
          type="button"
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => handleSubmit(onSubmit)()}
          sx={{ minWidth: 140, height: 44, boxShadow: "none", borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
        >
          Guardar
        </Button>
      </Stack>
    </Box>
  );
}

interface EditarProductoProps {
  id: number;
}

export default function EditarProducto({ id }: EditarProductoProps) {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.editarProducto) : false;
  const { producto, loading: loadingProducto } = useProducto(String(id));

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (loadingProducto || !producto) {
    return (
      <Box sx={{ width: "100%", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">Cargando producto...</Typography>
      </Box>
    );
  }

  return <EditarProductoForm id={id} producto={producto} />;
}
