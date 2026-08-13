"use client";
import {
  useRegistrarCategoria,
  useSubirImagen,
  useCategoriasPadres,
} from "@/features/dashboard/categoria/hooks/useCategorias";
import { CategoriaForm, categoriaSchema } from "@/features/dashboard/categoria/categoria.schema";
import { RegistrarCategoriaRequest } from "@/features/dashboard/categoria/Categoria.types";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toastPromise } from "@/shared/utils/toast";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const defaultValues: CategoriaForm = {
  nombre: "",
  descripcion: "",
  imagen: null,
  orden: 0,
  isActive: true,
  categoriaPadreId: null,
};

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

export default function RegistrarCategoria() {
  const [imagen, setImagen] = useState<ImagenLocal | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarCategoria) : false;

  const registrarCategoriaMutation = useRegistrarCategoria();
  const subirImagenMutation = useSubirImagen();
  const { categorias: categoriasPadre, loading: loadingPadres } = useCategoriasPadres();
  const isSubmitting = registrarCategoriaMutation.loading || subirImagenMutation.loading;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoriaForm>({
    resolver: standardSchemaResolver(categoriaSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setImagen({ file, preview: URL.createObjectURL(file) });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = () => {
    setImagen(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    reset(defaultValues);
    setImagen(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: CategoriaForm) => {
    try {
      let imagenUrl: string | null = null;

      if (imagen) {
        const result = await subirImagenMutation.subirImagen(imagen.file);
        imagenUrl = result.url;
      }

      const payload: RegistrarCategoriaRequest = {
        ...data,
        descripcion: data.descripcion?.trim() || null,
        imagen: imagenUrl,
        categoriaPadreId: data.categoriaPadreId ?? undefined,
      };

      await toastPromise(registrarCategoriaMutation.registrarCategoria(payload), {
        loading: "Registrando categoría...",
        success: "Categoría registrada correctamente.",
        error: (error) => error.message,
      });
      resetForm();
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

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Registrar Categoría
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="categoriaPadreId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel id="categoria-padre-label">Categoría padre (opcional)</InputLabel>
                  <Select
                    labelId="categoria-padre-label"
                    id="categoria-padre"
                    label="Categoría padre (opcional)"
                    value={field.value === null ? "" : String(field.value)}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? null : Number(value));
                    }}
                    disabled={loadingPadres}
                  >
                    <MenuItem value="">
                      <em>Sin categoría padre</em>
                    </MenuItem>
                    {categoriasPadre.map((cat) => (
                      <MenuItem key={cat.id} value={String(cat.id)}>
                        {cat.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            onClick={resetForm}
            disabled={isSubmitting}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            Limpiar
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
