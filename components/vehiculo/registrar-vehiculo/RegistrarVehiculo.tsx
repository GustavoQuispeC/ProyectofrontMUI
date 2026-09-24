"use client";
import { useRegistrarVehiculo } from "@/features/dashboard/vehiculo/hooks/useVehiculos";
import { VehiculoForm, vehiculoSchema } from "@/features/dashboard/vehiculo/vehiculo.schema";
import { RegistrarVehiculoRequest } from "@/features/dashboard/vehiculo/vehiculo.type";
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
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Stack from "@mui/material/Stack";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const defaultValues: VehiculoForm = {
  placa: "",
  marca: "",
  modelo: "",
  anio: new Date().getFullYear(),
  isActive: true,
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

export default function RegistrarVehiculo() {
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarVehiculo) : false;

  const registrarVehiculoMutation = useRegistrarVehiculo();
  const isSubmitting = registrarVehiculoMutation.loading;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehiculoForm>({
    resolver: standardSchemaResolver(vehiculoSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const resetForm = () => {
    reset(defaultValues);
  };

  const onSubmit = async (data: VehiculoForm) => {
    try {
      const payload: RegistrarVehiculoRequest = {
        placa: data.placa,
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio,
      };

      await toastPromise(registrarVehiculoMutation.registrarVehiculo(payload), {
        loading: "Registrando vehículo...",
        success: "Vehículo registrado correctamente.",
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
        Registrar Vehículo
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Section icon={<DirectionsCarIcon />} title="Información del Vehículo">
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="placa"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  label="Placa *"
                  slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  error={!!errors.placa}
                  helperText={errors.placa?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="anio"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  label="Año *"
                  type="number"
                  value={field.value ?? ""}
                  slotProps={{
                    htmlInput: {
                      min: 1900,
                      max: new Date().getFullYear() + 1,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                  }}
                  onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                  onFocus={(e) => e.target.select()}
                  error={!!errors.anio}
                  helperText={errors.anio?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="marca"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  label="Marca *"
                  slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  error={!!errors.marca}
                  helperText={errors.marca?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="modelo"
              control={control}
              render={({ field }) => (
                <InputCard
                  {...field}
                  label="Modelo *"
                  slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  error={!!errors.modelo}
                  helperText={errors.modelo?.message}
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
            onClick={() => router.push("/dashboard/vehiculo/listar")}
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
