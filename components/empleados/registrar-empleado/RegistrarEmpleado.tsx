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
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

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

export default function RegistrarEmpleados() {
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
      <div>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            <Typography component="span">Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
            <Typography component="span">Accordion 2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
            <Typography component="span">Accordion Actions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </AccordionDetails>
          <AccordionActions>
            <Button>Cancel</Button>
            <Button>Agree</Button>
          </AccordionActions>
        </Accordion>
      </div>
    </>
  );
}
