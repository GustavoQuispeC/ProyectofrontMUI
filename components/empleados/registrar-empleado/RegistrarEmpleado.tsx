"use client";
import { useCargos } from "@/features/dashboard/cargo/hooks/useCargos";
import { useCatalogos } from "@/features/dashboard/catalogo";
import { EmpleadoForm, empleadoSchema } from "@/features/dashboard/empleado/empleado.schema";
import { useDni } from "@/features/dashboard/identidad";
import { useFirebaseStorage } from "@/shared/hooks/useFirebaseStorage";
import { useUbigeo } from "@/shared/hooks/useUbigeo";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { RegistarEmpleado } from "@/features/dashboard/empleado/empleado.types";
import { toastPromise } from "@/shared/utils/toast";
import { registrarEmpleado } from "@/features/dashboard/empleado/empleado.logic";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
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
import Chip from "@mui/material/Chip";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputAdornment from "@mui/material/InputAdornment";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import FormHelperText from "@mui/material/FormHelperText";

// ─── Estilos base del TextField ──────────────────────────────────────────────
const defaultValues: EmpleadoForm = {
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

  numeroCuentaBancaria: "",
  bancoNombre: "",

  tipoCuenta: null,

  cci: "",
  ruc: "",
  numeroESSalud: "",

  sistemaPensiones: null,

  cuspp: "",

  nivelEducativo: null,

  profesionOficio: "",

  fotoUrl: "",

  cargoId: 0,

  salario: 0,

  tipoContrato: 0,
  tipoJornada: 0,

  fechaIngreso: "",

  observaciones: "",
};

type InputCardProps = TextFieldProps;
export const InputCard = (props: InputCardProps) => (
  <TextField
    fullWidth
    size="small"
    {...props}
    sx={{
      "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "#f8fafc" },
      ...props.sx,
    }}
  />
);

// ─── Sección con encabezado ───────────────────────────────────────────────────
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

// ─── Componente principal ─────────────────────────────────────────────────────
export default function RegistrarEmpleado() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const { loadingUbigeo, departamentos, getProvincias, getDistritos } = useUbigeo();
  const { catalogos } = useCatalogos();
  const { cargos } = useCargos();
  const { dniData, loadingDni, errorDni, consultarDni, resetDni } = useDni();
  const { uploading, uploadFile } = useFirebaseStorage();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmpleadoForm>({
    resolver: standardSchemaResolver(empleadoSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const departamento = watch("departamento");
  const provincia = watch("provincia");

  // ── Ubigeo encadenado ─────────────────────────────────────────────────────

  const provincias = useMemo(() => getProvincias(departamento), [departamento, getProvincias]);
  const distritos = useMemo(() => getDistritos(departamento, provincia), [departamento, provincia, getDistritos]);

  // ── DNI ───────────────────────────────────────────────────────────────────
  const handleBuscarDni = async () => {
    if (!dniBusqueda.trim() || dniBusqueda.trim().length !== 8) return;
    const response = await consultarDni(dniBusqueda.trim());
    if (response) {
      setValue("nombre", response.nombres ?? "");
      setValue("apellidos", `${response.apellidoPaterno ?? ""} ${response.apellidoMaterno ?? ""}`.trim());
      setValue("numeroDocumento", response.dni ?? "");
    }
  };

  // ── Imagen ────────────────────────────────────────────────────────────────
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
    const fileInput = document.getElementById("foto-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetForm = () => {
    reset(defaultValues);
    setResetKey((k) => k + 1);
    setPreview(null);
    setSelectedFile(null);
    resetDni();
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: EmpleadoForm) => {
    console.log("📝 data del form:", data);
    let fotoUrl: string = data.fotoUrl || "";
    if (selectedFile) {
      const result = await uploadFile(selectedFile, "empleados");
      if (!result) return;
      fotoUrl = result.url;
    }
    const payload: RegistarEmpleado = { ...data, fotoUrl };
    console.log("📦 payload:", payload);
    try {
      await toastPromise(registrarEmpleado(payload), {
        loading: "Registrando empleado...",
        success: "Empleado registrado correctamente",
        error: "Error al registrar el empleado",
      });

      resetForm();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {}
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("❌ Errores de validación:", errors);
      })}
      sx={{ width: "100%", maxWidth: 1100, mx: "auto", px: { xs: 1, sm: 2, md: 3 } }}
    >
      {/* ── Encabezado de página ── */}
      <Stack sx={{ mb: 1, gap: 1, alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Registrar Empleado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete todos los campos requeridos
          </Typography>
        </Box>
      </Stack>

      {/* ══ SECCIÓN: Foto + Búsqueda DNI ══ */}
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
        <Grid container sx={{ alignItems: "center", gap: { xs: 2, sm: 3 } }}>
          {/* Foto */}
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Stack sx={{ alignItems: "center", gap: 1 }}>
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
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                size="small"
                sx={{ borderRadius: 2, fontSize: 12 }}
              >
                Subir Foto
                <input id="foto-input" hidden type="file" accept="image/*" onChange={handleImageChange} />
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
          </Grid>

          {/* Búsqueda DNI */}
          <Grid size={{ xs: 12, sm: "grow" }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Búsqueda rápida por DNI
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                size="small"
                label="Número de DNI"
                value={dniBusqueda}
                onChange={(e) => setDniBusqueda(e.target.value.replace(/\D/g, "").slice(0, 8))}
                onKeyDown={(e) => e.key === "Enter" && handleBuscarDni()}
                slotProps={{ htmlInput: { maxLength: 8 } }}
                sx={{ flexGrow: 1, maxWidth: { sm: 260 } }}
              />
              <Button
                variant="contained"
                endIcon={<PersonSearchIcon />}
                onClick={handleBuscarDni}
                disabled={loadingDni || dniBusqueda.length !== 8}
                sx={{ whiteSpace: "nowrap", minWidth: 130 }}
              >
                {loadingDni ? "Buscando..." : "Buscar DNI"}
              </Button>
            </Stack>
            {errorDni && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                {errorDni}
              </Typography>
            )}
            {dniData && (
              <Chip
                label={`${dniData.nombres} ${dniData.apellidoPaterno} ${dniData.apellidoMaterno}`}
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* ══ SECCIÓN 1: Datos Personales ══ */}
      <Section icon={<BadgeIcon />} title="Datos Personales">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <InputCard {...field} label="Nombres *" error={!!errors.nombre} helperText={errors.nombre?.message} />
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
            {" "}
            <Controller
              name="fechaNacimiento"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fechaNacimiento}>
                  {" "}
                  <DatePicker
                    key={resetKey}
                    label="Fecha de Nacimiento"
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
                  label="Tipo Documento"
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
                label="Número de Documento *"
                error={!!errors.numeroDocumento}
                helperText={errors.numeroDocumento?.message}
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
                  label="Estado Civil"
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
                label="Correo Electrónico"
                type="email"
                error={!!errors.correo}
                helperText={errors.correo?.message}
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
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="nacionalidad"
            control={control}
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="Nacionalidad" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="salario"
            control={control}
            render={({ field }) => (
              <InputCard
                {...field}
                value={field.value ?? ""}
                label="Salario"
                type="number"
                error={!!errors.salario}
                helperText={errors.salario?.message}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                  },
                }}
              />
            )}
          />
        </Grid>
      </Section>

      {/* ══ SECCIÓN 2: Dirección ══ */}
      <Section icon={<HomeIcon />} title="Dirección">
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="direccion"
            control={control}
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="Dirección" />}
          />
        </Grid>

        {/* Departamento */}
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Controller
            name="departamento"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
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
              <FormControl fullWidth size="small">
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
              <FormControl fullWidth size="small">
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
              </FormControl>
            )}
          />
        </Grid>
      </Section>

      {/* ══ SECCIÓN 3: Datos Laborales ══ */}
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
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Controller
              name="fechaIngreso"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fechaIngreso}>
                  {" "}
                  <DatePicker
                    key={resetKey}
                    label="Fecha de Ingreso"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(val) => field.onChange(val?.format("YYYY-MM-DD") ?? "")}
                    slotProps={{ textField: { size: "small", fullWidth: true, error: !!errors.fechaIngreso } }}
                  />
                  <FormHelperText>{errors.fechaIngreso?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </LocalizationProvider>
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
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="Profesión / Oficio" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="ruc"
            control={control}
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="RUC" />}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="observaciones"
            control={control}
            render={({ field }) => (
              <InputCard {...field} value={field.value ?? ""} label="Observaciones" multiline rows={2} />
            )}
          />
        </Grid>
      </Section>

      {/* ══ SECCIÓN 4: Contacto de Emergencia ══ */}
      <Section icon={<ContactPhoneIcon />} title="Contacto de Emergencia">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="contactoEmergenciaNombre"
            control={control}
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="Nombres y Apellidos" />}
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
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="Teléfono de Contacto" />}
          />
        </Grid>
      </Section>

      {/* ══ SECCIÓN 5: Financiero y Seguros ══ */}
      <Section icon={<AccountBalanceIcon />} title="Financiero y Seguros">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="bancoNombre"
            control={control}
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="Banco" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="tipoCuenta"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Cuenta</InputLabel>

                <Select
                  value={field.value ?? ""}
                  label="Tipo de Cuenta"
                  onChange={(e) => {
                    const value = e.target.value;

                    field.onChange(value ? Number(value) : null);
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>

                  {catalogos.tiposCuentaBancaria.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>{errors.tipoCuenta?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="numeroCuentaBancaria"
            control={control}
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="Número de Cuenta" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="cci"
            control={control}
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="CCI" />}
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
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="CUSPP" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Controller
            name="numeroESSalud"
            control={control}
            render={({ field }) => <InputCard {...field} value={field.value ?? ""} label="Número EsSalud" />}
          />
        </Grid>
      </Section>

      {/* ── Botones inferiores (móvil) ── */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
        {/* 🔙 Retornar */}
        <Button
          variant="text"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => router.push("/dashboard/empleados/listar")}
          fullWidth
        >
          Retornar
        </Button>

        {/* 🧹 Limpiar */}
        <Button variant="outlined" color="inherit" startIcon={<RestartAltIcon />} onClick={resetForm} fullWidth>
          Limpiar
        </Button>

        {/* 💾 Guardar */}
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={uploading}
          fullWidth
          sx={{
            minWidth: 180,
            fontWeight: 600,
          }}
        >
          {uploading ? "Guardando..." : "Guardar Empleado"}
        </Button>
      </Stack>
    </Box>
  );
}
