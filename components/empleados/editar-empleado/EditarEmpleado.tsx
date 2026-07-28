"use client";
import { useCargos } from "@/features/dashboard/cargo/hooks/useCargos";
import { useCatalogos } from "@/features/dashboard/catalogo";
import { EmpleadoEdicionForm, empleadoEdicionSchema } from "@/features/dashboard/empleado/empleado.schema";
import { useFirebaseStorage } from "@/shared/hooks/useFirebaseStorage";
import { useUbigeo } from "@/shared/hooks/useUbigeo";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toastPromise } from "@/shared/utils/toast";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/Card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { PhotoCamera } from "@mui/icons-material";
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
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WorkIcon from "@mui/icons-material/Work";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { ActualizarEmpleadoRequest } from "@/features/dashboard/empleado/empleado.types";
import { useEmpleadoEdicion } from "@/features/dashboard/empleado/hooks/useEmpleadoEdicion";
import { useActualizarEmpleado } from "@/features/dashboard/empleado/hooks/useActualizarEmpleado";
import { InputCard } from "@/components/empleados/registrar-empleado/RegistrarEmpleado";

const defaultValues: EmpleadoEdicionForm = {
  nombre: "",
  apellidos: "",
  tipoDocumento: 0,
  numeroDocumento: "",
  fechaNacimiento: "",
  genero: 0,
  estadoCivil: 0,
  nacionalidad: "",
  correo: "",
  telefonoMovil: "",
  direccion: "",
  distrito: "",
  provincia: "",
  departamento: "",
  contactoEmergenciaNombre: "",
  contactoEmergenciaParentesco: null,
  contactoEmergenciaTelefono: "",
  bancoSueldo: "",
  cuentaSueldo: "",
  cciSueldo: "",
  bancoCTS: "",
  cuentaCTS: "",
  cciCTS: "",
  ruc: "",
  sistemaPensiones: null,
  cuspp: "",
  nivelEducativo: null,
  profesionOficio: "",
  fotoUrl: "",
  cargoId: 0,
  salarioBase: 0,
  tipoContrato: 0,
  tipoJornada: 0,
  observaciones: "",
};

//! Sección encabezada
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
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Paper>
);

interface EditarEmpleadoProps {
  id: string;
}

//! Componente principal
export default function EditarEmpleado({ id }: EditarEmpleadoProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { loadingUbigeo, departamentos, getProvincias, getDistritos } = useUbigeo();
  const { catalogos } = useCatalogos();
  const { cargos } = useCargos();
  const { uploading, uploadFile, deleteFile } = useFirebaseStorage();
  const router = useRouter();
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.editarEmpleado) : false;
  const { empleado, loading: loadingEmpleado, error: errorEmpleado } = useEmpleadoEdicion(id, canAccess);
  const actualizarEmpleadoMutation = useActualizarEmpleado();
  const isSubmitting = uploading || actualizarEmpleadoMutation.isPending;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmpleadoEdicionForm>({
    resolver: standardSchemaResolver(empleadoEdicionSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const departamento = watch("departamento");
  const provincia = watch("provincia");

  //! Precargar datos del empleado
  useEffect(() => {
    if (!empleado) return;
    reset({
      nombre: empleado.nombre ?? "",
      apellidos: empleado.apellidos ?? "",
      tipoDocumento: empleado.tipoDocumento ?? 0,
      numeroDocumento: empleado.numeroDocumento ?? "",
      fechaNacimiento: empleado.fechaNacimiento ? dayjs(empleado.fechaNacimiento).format("YYYY-MM-DD") : "",
      genero: empleado.genero ?? 0,
      estadoCivil: empleado.estadoCivil ?? 0,
      nacionalidad: empleado.nacionalidad ?? "",
      correo: empleado.correo ?? "",
      telefonoMovil: empleado.telefonoMovil ?? "",
      direccion: empleado.direccion ?? "",
      departamento: empleado.departamento ?? "",
      provincia: empleado.provincia ?? "",
      distrito: empleado.distrito ?? "",
      contactoEmergenciaNombre: empleado.contactoEmergenciaNombre ?? "",
      contactoEmergenciaParentesco: empleado.contactoEmergenciaParentesco ?? null,
      contactoEmergenciaTelefono: empleado.contactoEmergenciaTelefono ?? "",
      bancoSueldo: empleado.bancoSueldo ?? "",
      cuentaSueldo: empleado.cuentaSueldo ?? "",
      cciSueldo: empleado.cciSueldo ?? "",
      bancoCTS: empleado.bancoCTS ?? "",
      cuentaCTS: empleado.cuentaCTS ?? "",
      cciCTS: empleado.ccicts ?? "",
      ruc: empleado.ruc ?? "",
      sistemaPensiones: empleado.sistemaPensiones ?? null,
      cuspp: empleado.cuspp ?? "",
      nivelEducativo: empleado.nivelEducativo ?? null,
      profesionOficio: empleado.profesionOficio ?? "",
      fotoUrl: empleado.fotoUrl ?? "",
      cargoId: empleado.cargoId ?? 0,
      salarioBase: empleado.salarioBase ?? 0,
      tipoContrato: empleado.tipoContrato ?? 0,
      tipoJornada: empleado.tipoJornada ?? 0,
      observaciones: empleado.observaciones ?? "",
    });
    setPreview(empleado.fotoUrl || null);
    setSelectedFile(null);
  }, [empleado, reset]);

  //! Ubigeo
  const provincias = useMemo(() => getProvincias(departamento), [departamento, getProvincias]);
  const distritos = useMemo(() => getDistritos(departamento, provincia), [departamento, provincia, getDistritos]);

  //! Imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  //! Remover imagen
  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
    setValue("fotoUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  //! SUBMIT
  const onSubmit = async (data: EmpleadoEdicionForm) => {
    let fotoUrl = data.fotoUrl;
    let storagePath: string | null = null;
    try {
      // Subir imagen nueva (si existe)
      if (selectedFile) {
        const result = await uploadFile(selectedFile, "empleados");
        if (!result) {
          throw new Error("No fue posible subir la imagen.");
        }
        fotoUrl = result.url;
        storagePath = result.path;
      }
      const payload: ActualizarEmpleadoRequest = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: data.numeroDocumento,
        fechaNacimiento: data.fechaNacimiento,
        genero: data.genero,
        estadoCivil: data.estadoCivil,
        nacionalidad: data.nacionalidad,
        correo: data.correo,
        telefonoMovil: data.telefonoMovil,
        direccion: data.direccion,
        distrito: data.distrito,
        provincia: data.provincia,
        departamento: data.departamento,
        contactoEmergenciaNombre: data.contactoEmergenciaNombre,
        contactoEmergenciaParentesco: data.contactoEmergenciaParentesco,
        contactoEmergenciaTelefono: data.contactoEmergenciaTelefono,
        bancoSueldo: data.bancoSueldo,
        cuentaSueldo: data.cuentaSueldo,
        cciSueldo: data.cciSueldo,
        bancoCTS: data.bancoCTS,
        cuentaCTS: data.cuentaCTS,
        ccicts: data.cciCTS,
        ruc: data.ruc,
        sistemaPensiones: data.sistemaPensiones,
        cuspp: data.cuspp,
        nivelEducativo: data.nivelEducativo,
        profesionOficio: data.profesionOficio,
        fotoUrl,
        cargoId: data.cargoId,
        salarioBase: data.salarioBase,
        tipoContrato: data.tipoContrato,
        tipoJornada: data.tipoJornada,
        observaciones: data.observaciones,
      };
      await toastPromise(actualizarEmpleadoMutation.mutateAsync({ id, payload }), {
        loading: "Actualizando empleado...",
        success: "Empleado actualizado correctamente.",
        error: (error) => error.message,
      });
      router.push("/dashboard/empleados/listar");
    } catch (error) {
      if (storagePath) {
        await deleteFile(storagePath);
      }
      console.error(error);
    }
  };

  //! Validación de Acceso
  if (!canAccess) {
    return <AccessDenied />;
  }

  //! Cargando datos
  if (loadingEmpleado) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  //! Error al cargar
  if (errorEmpleado) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{errorEmpleado}</Alert>
        <Button
          variant="outlined"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => router.push("/dashboard/empleados/listar")}
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Box>
    );
  }

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
      {/* Encabezado de página */}
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
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: { xs: 48, md: 52 },
                height: { xs: 48, md: 52 },
              }}
            >
              <ModeEditOutlineOutlinedIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Editar Empleado
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Actualice los datos del empleado
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* SECCIÓN: Foto */}
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
        <Stack sx={{ alignItems: "center", gap: 1 }} direction={{ xs: "column", sm: "row" }}>
          <Avatar
            src={preview ?? ""}
            sx={{
              width: 110,
              height: 110,
              border: "3px dashed",
              borderColor: preview ? "primary.main" : "divider",
              bgcolor: "grey.100",
            }}
          >
            {!preview && <PhotoCamera sx={{ fontSize: 36, color: "grey.400" }} />}
          </Avatar>
          <Stack sx={{ gap: 1, ml: { sm: 2 } }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              size="small"
              sx={{ borderRadius: 2, fontSize: 12 }}
            >
              Cambiar Foto
              <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleImageChange} />
            </Button>
            {preview && (
              <Button
                size="small"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={handleRemoveImage}
                sx={{ fontSize: 12 }}
              >
                Eliminar
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* SECCIÓN 1: Datos Personales */}
      <Section icon={<BadgeIcon />} title="Datos Personales">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                label="Nombres *"
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="apellidos"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                label="Apellidos *"
                error={!!errors.apellidos}
                helperText={errors.apellidos?.message}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="genero"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.genero}>
                <InputLabel>Género *</InputLabel>
                <Select
                  value={field.value || ""}
                  label="Género *"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {catalogos.generos.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.genero?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Controller
              name="fechaNacimiento"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fechaNacimiento}>
                  <DatePicker
                    label="Fecha de Nacimiento *"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(val) => field.onChange(val?.format("YYYY-MM-DD") ?? "")}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!errors.fechaNacimiento,
                      },
                    }}
                  />
                  <FormHelperText>{errors.fechaNacimiento?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="tipoDocumento"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.tipoDocumento}>
                <InputLabel>Tipo Documento</InputLabel>
                <Select
                  value={field.value || ""}
                  label="Tipo Documento *"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {catalogos.tiposDocumentos.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.tipoDocumento?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="numeroDocumento"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Número de Documento *"
                error={!!errors.numeroDocumento}
                helperText={errors.numeroDocumento?.message}
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
                slotProps={{
                  htmlInput: {
                    maxLength: 8,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="estadoCivil"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.estadoCivil}>
                <InputLabel>Estado Civil</InputLabel>
                <Select
                  value={field.value || ""}
                  label="Estado Civil *"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {catalogos.estadosCiviles.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.estadoCivil?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="correo"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                label="Correo Electrónico *"
                type="email"
                error={!!errors.correo}
                helperText={errors.correo?.message}
                onChange={(e) => field.onChange(e.target.value.toLowerCase())}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="telefonoMovil"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                label="Teléfono Móvil"
                error={!!errors.telefonoMovil}
                helperText={errors.telefonoMovil?.message}
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="nacionalidad"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Nacionalidad (Opcional)"
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="nivelEducativo"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Nivel Educativo</InputLabel>
                <Select
                  value={field.value ?? ""}
                  label="Nivel Educativo"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? Number(value) : null);
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {catalogos.nivelesEducativos.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.nivelEducativo?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="profesionOficio"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Profesión / Oficio"
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="ruc"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="RUC"
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 11))}
              />
            )}
          />
        </Grid>
      </Section>

      {/* SECCIÓN 2: Dirección */}
      <Section icon={<HomeIcon />} title="Dirección">
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="direccion"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                label="Dirección *"
                error={!!errors.direccion}
                helperText={errors.direccion?.message}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid>
        {/* Departamento */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Controller
            name="departamento"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.departamento}>
                <InputLabel>Departamento</InputLabel>
                <Select
                  {...field}
                  label="Departamento"
                  disabled={loadingUbigeo}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("provincia", "");
                    setValue("distrito", "");
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione...</em>
                  </MenuItem>
                  {departamentos.map((dep) => (
                    <MenuItem key={dep} value={dep}>
                      {dep}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.departamento?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        {/* Provincia */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Controller
            name="provincia"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.provincia}>
                <InputLabel>Provincia</InputLabel>
                <Select
                  {...field}
                  label="Provincia"
                  disabled={!departamento || provincias.length === 0}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("distrito", "");
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione...</em>
                  </MenuItem>
                  {provincias.map((prov) => (
                    <MenuItem key={prov} value={prov}>
                      {prov}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.provincia?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        {/* Distrito */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Controller
            name="distrito"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.distrito}>
                <InputLabel>Distrito</InputLabel>
                <Select {...field} label="Distrito" disabled={!provincia || distritos.length === 0}>
                  <MenuItem value="">
                    <em>Seleccione...</em>
                  </MenuItem>
                  {distritos.map((dist) => (
                    <MenuItem key={dist} value={dist}>
                      {dist}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.distrito?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Section>

      {/* SECCIÓN 3: Contacto de Emergencia */}
      <Section icon={<ContactPhoneIcon />} title="Contacto de Emergencia">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="contactoEmergenciaNombre"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Nombres y Apellidos"
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="contactoEmergenciaParentesco"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Parentesco</InputLabel>
                <Select
                  value={field.value ?? ""}
                  label="Parentesco"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? Number(value) : null);
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {catalogos.tiposParentesco.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.contactoEmergenciaParentesco?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="contactoEmergenciaTelefono"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Teléfono de Contacto"
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
              />
            )}
          />
        </Grid>
      </Section>

      {/* SECCIÓN 4: Financiero y seguros */}
      <Section icon={<AccountBalanceIcon />} title="Financiero y Seguros">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="bancoSueldo"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Banco Sueldo</InputLabel>
                <Select value={field.value ?? ""} label="Banco Sueldo" onChange={(e) => field.onChange(e.target.value)}>
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  <MenuItem value="BCP">BCP</MenuItem>
                  <MenuItem value="Interbank">Interbank</MenuItem>
                  <MenuItem value="BBVA">BBVA</MenuItem>
                  <MenuItem value="Scotiabank">Scotiabank</MenuItem>
                  <MenuItem value="Banco de la Nación">Banco de la Nación</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="cuentaSueldo"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Cuenta Sueldo"
                sx={{ "& .MuiInputBase-input": { textTransform: "uppercase" } }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="cciSueldo"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="CCI Sueldo"
                sx={{ "& .MuiInputBase-input": { textTransform: "uppercase" } }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="bancoCTS"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Banco CTS</InputLabel>
                <Select value={field.value ?? ""} label="Banco CTS" onChange={(e) => field.onChange(e.target.value)}>
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  <MenuItem value="BCP">BCP</MenuItem>
                  <MenuItem value="Interbank">Interbank</MenuItem>
                  <MenuItem value="BBVA">BBVA</MenuItem>
                  <MenuItem value="Scotiabank">Scotiabank</MenuItem>
                  <MenuItem value="Banco de la Nación">Banco de la Nación</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="cuentaCTS"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Cuenta CTS"
                sx={{ "& .MuiInputBase-input": { textTransform: "uppercase" } }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="cciCTS"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="CCI CTS"
                sx={{ "& .MuiInputBase-input": { textTransform: "uppercase" } }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="sistemaPensiones"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Sistema de Pensiones</InputLabel>
                <Select
                  value={field.value ?? ""}
                  label="Sistema de Pensiones"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? Number(value) : null);
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {catalogos.sistemasPensiones.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.sistemaPensiones?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="cuspp"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="CUSPP"
                sx={{ "& .MuiInputBase-input": { textTransform: "uppercase" } }}
              />
            )}
          />
        </Grid>
      </Section>

      {/* SECCIÓN 4: Datos Laborales */}
      <Section icon={<WorkIcon />} title="Datos Laborales">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="cargoId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.cargoId}>
                <InputLabel>Cargo</InputLabel>
                <Select
                  value={field.value || ""}
                  label="Cargo"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione...</em>
                  </MenuItem>
                  {cargos.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.cargoId?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="salarioBase"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Salario Base"
                type="number"
                error={!!errors.salarioBase}
                helperText={errors.salarioBase?.message}
                onFocus={(e) => e.target.select()}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="tipoContrato"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.tipoContrato}>
                <InputLabel>Tipo de Contrato</InputLabel>
                <Select
                  value={field.value || ""}
                  label="Tipo de Contrato"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {catalogos.tiposContrato.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.tipoContrato?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="tipoJornada"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.tipoJornada}>
                <InputLabel>Tipo de Jornada</InputLabel>
                <Select
                  value={field.value || ""}
                  label="Tipo de Jornada"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {catalogos.tiposJornada.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.tipoJornada?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="observaciones"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Observaciones"
                multiline
                rows={3}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            )}
          />
        </Grid>
      </Section>

      {/* Botones inferiores */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          gap: 2,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => router.push("/dashboard/empleados/listar")}
          sx={{ minWidth: 120, height: 44, width: { xs: "100%", sm: "auto" } }}
        >
          Volver
        </Button>

        <Button
          type="button"
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          sx={{
            minWidth: 140,
            height: 44,
            boxShadow: "none",
            borderRadius: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Actualizar
        </Button>
      </Stack>
    </Box>
  );
}
