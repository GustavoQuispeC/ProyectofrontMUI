"use client";
import { useCargos } from "@/features/dashboard/cargo/hooks/useCargos";
import { useCatalogos } from "@/features/dashboard/catalogo";
import { EmpleadoForm, empleadoSchema } from "@/features/dashboard/empleado/empleado.schema";
import { useDni } from "@/features/dashboard/identidad";
import { useFirebaseStorage } from "@/shared/hooks/useFirebaseStorage";
import { useUbigeo } from "@/shared/hooks/useUbigeo";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegistarEmpleado } from "@/features/dashboard/empleado/empleado.types";
import { toastPromise } from "@/shared/utils/toast";
import { registrarEmpleado } from "@/features/dashboard/empleado/empleado.logic";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { AccountCircle } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));
const defaultValues: EmpleadoForm = {
  nombre: "",
  apellidos: "",
  tipoDocumento: 0,
  numeroDocumento: "",
  fechaNacimiento: "",
  genero: 0,
  estadoCivil: 0,
  nacionalidad: null,
  correo: "",
  telefonoMovil: "",
  direccion: null,
  distrito: "",
  provincia: "",
  departamento: "",
  contactoEmergenciaNombre: null,
  contactoEmergenciaParentesco: 0,
  contactoEmergenciaTelefono: null,
  numeroCuentaBancaria: null,
  bancoNombre: null,
  tiposCuentaBancaria: 0,
  cci: null,
  ruc: null,
  numeroESSalud: null,
  sistemaPensiones: 0,
  cuspp: null,
  nivelEducativo: 0,
  profesionOficio: null,
  fotoUrl: null,
  cargoId: 0,
  salario: 0.0,
  tipoContrato: 0,
  tipoJornada: 0,
  fechaIngreso: "",
  observaciones: null,
};
type InputCardProps = TextFieldProps;

export const InputCard = (props: InputCardProps) => {
  return (
    <TextField
      fullWidth
      size="small"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          backgroundColor: "#f4f5f7",
        },
        ...props.sx, // permite sobrescribir estilos desde fuera
      }}
    />
  );
};

export default function RegistrarEmpleado() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dniBusqueda, setDniBusqueda] = useState("");
  // resetKey controla el remount de DatePickers y Selects para limpiarlos visualmente
  const [resetKey, setResetKey] = useState(0);
  const { ubigeoData, loadingUbigeo } = useUbigeo();
  const { catalogos, loading } = useCatalogos();
  const { cargos } = useCargos();
  const { dniData, loadingDni, errorDni, consultarDni, resetDni } = useDni();
  const { uploading, progress, error: uploadError, uploadFile } = useFirebaseStorage();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<EmpleadoForm>({
    resolver: zodResolver(empleadoSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });
  const router = useRouter();

  const departamento = watch("departamento");
  const provincia = watch("provincia");

  // ── DNI ──────────────────────────────────────────────────────────────────────
  const handleBuscarDni = async () => {
    if (!dniBusqueda.trim() || dniBusqueda.trim().length !== 8) return;
    const response = await consultarDni(dniBusqueda.trim());
    if (response) {
      setValue("nombre", response.nombres ?? "");
      setValue("apellidos", `${response.apellidoPaterno ?? ""} ${response.apellidoMaterno ?? ""}`.trim());
      setValue("numeroDocumento", response.dni ?? "");
    }
  };

  // ── Imagen ───────────────────────────────────────────────────────────────────
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ── Reset completo del formulario ────────────────────────────────────────────
  const resetForm = () => {
    reset(defaultValues);
    // Incrementar resetKey fuerza el remount de DatePickers y Selects controlados por key
    setResetKey((k) => k + 1);
    setPreview(null);
    setSelectedFile(null);
    setDniBusqueda("");
    resetDni();
    // Limpiar el input file para que se pueda volver a seleccionar la misma imagen
    const fileInput = document.getElementById("foto-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit = async (data: EmpleadoForm) => {
    let fotoUrl: string | null = data.fotoUrl ?? null;

    if (selectedFile) {
      const result = await uploadFile(selectedFile, "empleados");
      if (!result) return;
      fotoUrl = result.url;
    }

    const payload: RegistarEmpleado = { ...data, fotoUrl };

    try {
      await toastPromise(registrarEmpleado(payload), {
        loading: "Registrando empleado...",
        success: "Empleado registrado correctamente",
        error: "Error al registrar el empleado",
      });
      resetForm();
    } catch (_) {}
  };
  return (
    <>
      <Box sx={{ width: "100%", px: "10px", boxSizing: "border-box" }}>
        <Typography variant="h6" align="left">
          Registrar Empleado
        </Typography>
        <Grid container spacing={2}>
          <Grid size={3}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput type="file" onChange={(event) => console.log(event.target.files)} multiple />
            </Button>
          </Grid>
          <Grid size={3}>
            <InputLabel htmlFor="input-with-icon-adornment">Nombres</InputLabel>
            <Input
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid size={3}>
            <Item>size=3</Item>
          </Grid>
          <Grid size={3}>
            <Item>size=3</Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
