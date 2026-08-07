"use client";

import { useEditarCategoria, useCategoria, useSubirImagen } from "@/features/dashboard/categoria/hooks/useCategorias";
import { CategoriaForm, categoriaSchema } from "@/features/dashboard/categoria/categoria.schema";
import { EditarCategoriaRequest } from "@/features/dashboard/categoria/Categoria.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toastPromise } from "@/shared/utils/toast";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

type InputCardProps = React.ComponentProps<typeof TextField>;
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
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Box>
);

type ImagenLocal = {
  file: File;
  preview: string;
};

interface EditarCategoriaProps {
  id: number;
}

export default function EditarCategoria({ id }: EditarCategoriaProps) {
  const [imagen, setImagen] = useState<ImagenLocal | null>(null);
  const [imagenEliminada, setImagenEliminada] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.editarCategoria) : false;

  const { categoria, loading: loadingCategoria } = useCategoria(id);
  const editarCategoriaMutation = useEditarCategoria(id);
  const subirImagenMutation = useSubirImagen();
  const isSubmitting = editarCategoriaMutation.loading || subirImagenMutation.loading;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaForm>({
    resolver: standardSchemaResolver(categoriaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      imagen: null,
      orden: 0,
      isActive: true,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  useEffect(() => {
    if (categoria) {
      reset({
        nombre: categoria.nombre ?? "",
        descripcion: categoria.descripcion ?? null,
        imagen: categoria.imagen ?? null,
        orden: categoria.orden ?? 0,
        isActive: categoria.isActive ?? true,
      });
    }
  }, [categoria, reset]);

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setImagen({ file, preview: URL.createObjectURL(file) });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = () => {
    setImagen(null);
    if (!imagen) {
      setImagenEliminada(true);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: CategoriaForm) => {
    try {
      let imagenUrl: string | null = categoria?.imagen ?? null;

      if (imagen) {
        const result = await subirImagenMutation.subirImagen(imagen.file);
        imagenUrl = result.url;
      }

      const payload: EditarCategoriaRequest = {
        id,
        nombre: data.nombre,
        descripcion: data.descripcion?.trim() || null,
        imagen: imagenEliminada ? null : imagenUrl,
        orden: data.orden,
        isActive: data.isActive,
      };

      await toastPromise(editarCategoriaMutation.editarCategoria(payload), {
        loading: "Actualizando categoría...",
        success: "Categoría actualizada correctamente.",
        error: (error) => error.message,
      });

      router.push("/dashboard/categorias/listar");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (loadingCategoria || !categoria) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Editar Categoría
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Section icon={<ImageIcon />} title="Información General">
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  label="Nombre de la Categoría *"
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="orden"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  label="Orden"
                  type="number"
                  error={!!errors.orden}
                  helperText={errors.orden?.message}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  label="Descripción"
                  multiline
                  minRows={3}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion?.message}
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value ?? false} onChange={(e) => field.onChange(e.target.checked)} />}
                  label={field.value ? "Activo" : "Inactivo"}
                />
              )}
            />
          </Grid>
        </Section>

        <Section icon={<ImageIcon />} title="Imagen">
          <Grid size={12}>
            <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
              {imagen ? (
                <Box
                  sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Box
                    component="img"
                    src={imagen.preview}
                    alt="Imagen de categoría"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    title="Eliminar imagen"
                  >
                    <CloseIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              ) : categoria.imagen && !imagenEliminada ? (
                <Box
                  sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Box
                    component="img"
                    src={categoria.imagen}
                    alt="Imagen actual de categoría"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    title="Cambiar imagen"
                  >
                    <CloseIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    width: 150,
                    height: 150,
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
                  <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleAddImage} />
                </Button>
              )}
              {categoria.imagen && !imagen && !imagenEliminada && (
                <Button component="label" variant="outlined" sx={{ minWidth: 150, height: 44 }}>
                  Cambiar imagen
                  <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleAddImage} />
                </Button>
              )}
            </Stack>
          </Grid>
        </Section>

        <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => router.push("/dashboard/categorias/listar")}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            Volver
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={() => {
              reset({
                nombre: categoria.nombre ?? "",
                descripcion: categoria.descripcion ?? null,
                imagen: categoria.imagen ?? null,
                orden: categoria.orden ?? 0,
                isActive: categoria.isActive ?? true,
              });
              setImagen(null);
              setImagenEliminada(false);
            }}
            disabled={isSubmitting}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            Restablecer
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            disabled={isSubmitting}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
