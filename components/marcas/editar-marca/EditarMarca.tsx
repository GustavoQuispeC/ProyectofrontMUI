"use client";

import { useEditarMarca, useMarca, useSubirLogoMarca } from "@/features/dashboard/marca/hooks/useMarcas";
import { MarcaForm, marcaSchema } from "@/features/dashboard/marca/marca.schema";
import { EditarMarcaRequest } from "@/features/dashboard/marca/Marca.types";
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

type LogoLocal = {
  file: File;
  preview: string;
};

interface EditarMarcaProps {
  id: number;
}

export default function EditarMarca({ id }: EditarMarcaProps) {
  const [logo, setLogo] = useState<LogoLocal | null>(null);
  const [logoEliminado, setLogoEliminado] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.editarMarca) : false;

  const { marca, loading: loadingMarca } = useMarca(id);
  const editarMarcaMutation = useEditarMarca(id);
  const subirLogoMutation = useSubirLogoMarca();
  const isSubmitting = editarMarcaMutation.loading || subirLogoMutation.loading;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarcaForm>({
    resolver: standardSchemaResolver(marcaSchema),
    defaultValues: {
      nombre: "",
      logo: null,
      isActive: true,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  useEffect(() => {
    if (marca) {
      reset({
        nombre: marca.nombre ?? "",
        logo: marca.logo ?? null,
        isActive: marca.isActive ?? true,
      });
    }
  }, [marca, reset]);

  const handleAddLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setLogo({ file, preview: URL.createObjectURL(file) });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    if (!logo) {
      setLogoEliminado(true);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: MarcaForm) => {
    try {
      let logoUrl: string | null = marca?.logo ?? null;

      if (logo) {
        const result = await subirLogoMutation.subirLogo(logo.file);
        logoUrl = result.url;
      }

      const payload: EditarMarcaRequest = {
        id,
        nombre: data.nombre,
        logo: logoEliminado ? null : logoUrl,
        isActive: data.isActive,
      };

      await toastPromise(editarMarcaMutation.editarMarca(payload), {
        loading: "Actualizando marca...",
        success: "Marca actualizada correctamente.",
        error: (error) => error.message,
      });

      router.push("/dashboard/marcas/listar");
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

  if (loadingMarca || !marca) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Editar Marca
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
                  label="Nombre de la Marca *"
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
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

        <Section icon={<ImageIcon />} title="Logo">
          <Grid size={12}>
            <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
              {logo ? (
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
                    src={logo.preview}
                    alt="Logo de marca"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveLogo}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    title="Eliminar logo"
                  >
                    <CloseIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              ) : marca.logo && !logoEliminado ? (
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
                    src={marca.logo}
                    alt="Logo actual de marca"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveLogo}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                    title="Cambiar logo"
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
                  <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleAddLogo} />
                </Button>
              )}
              {marca.logo && !logo && !logoEliminado && (
                <Button component="label" variant="outlined" sx={{ minWidth: 150, height: 44 }}>
                  Cambiar logo
                  <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleAddLogo} />
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
            onClick={() => router.push("/dashboard/marcas/listar")}
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
                nombre: marca.nombre ?? "",
                logo: marca.logo ?? null,
                isActive: marca.isActive ?? true,
              });
              setLogo(null);
              setLogoEliminado(false);
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
