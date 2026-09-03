"use client";
import { useRegistrarProveedor } from "@/features/dashboard/proveedor/hooks/useProveedores";
import { ProveedorForm, proveedorSchema } from "@/features/dashboard/proveedor/proveedor.schema";
import { RegistrarProveedorRequest } from "@/features/dashboard/proveedor/proveedor.type";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toastPromise } from "@/shared/utils/toast";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import BusinessIcon from "@mui/icons-material/Business";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const defaultValues: ProveedorForm = {
  razonSocial: "",
  ruc: "",
  contacto: null,
  telefono: null,
  correo: null,
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

export default function RegistrarProveedor() {
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarProveedor) : false;

  const registrarProveedorMutation = useRegistrarProveedor();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProveedorForm>({
    resolver: standardSchemaResolver(proveedorSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data: ProveedorForm) => {
    try {
      const payload: RegistrarProveedorRequest = {
        razonSocial: data.razonSocial,
        ruc: data.ruc,
        contacto: data.contacto ?? null,
        telefono: data.telefono ?? null,
        correo: data.correo ?? null,
      };

      await toastPromise(registrarProveedorMutation.registrarProveedor(payload), {
        loading: "Registrando proveedor...",
        success: "Proveedor registrado correctamente.",
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
        Registrar Proveedor
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Section icon={<BusinessIcon />} title="Información General">
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="razonSocial"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  label="Razón Social *"
                  error={!!errors.razonSocial}
                  helperText={errors.razonSocial?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="ruc"
              control={control}
              render={({ field }) => (
                <InputCard {...field} label="RUC *" error={!!errors.ruc} helperText={errors.ruc?.message} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="contacto"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  label="Contacto"
                  error={!!errors.contacto}
                  helperText={errors.contacto?.message}
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
        </Section>

        <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => router.push("/dashboard/proveedores/listar")}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            Volver
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={resetForm}
            disabled={registrarProveedorMutation.loading}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            Limpiar
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            disabled={registrarProveedorMutation.loading}
            sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
          >
            {registrarProveedorMutation.loading ? "Guardando..." : "Guardar"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
