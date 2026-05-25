import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as React from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Grid from "@mui/material/Grid";
import { Controller, useForm } from "react-hook-form";
import { Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { PermisoMensualForm, PermisoMensualSchema } from "@/features/dashboard/permiso/permiso.schema";
import { useState } from "react";
import { Condicion } from "@/features/dashboard/permiso/permiso.type";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import { getAuthUser } from "@/shared/auth/auth.service";
import { useMounted } from "@/shared/hooks/useMounted";
import { usePermisosMensuales } from "@/features/dashboard/permiso/hooks/usePermisosMensuales";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { CleaningServices, EventNote } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";

const meses = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const chipCondicion = (condicion: Condicion) => {
  const config: Record<
    Condicion,
    {
      color: "warning" | "success" | "error";
      label: string;
    }
  > = {
    Pendiente: {
      color: "warning",
      label: "Pendiente",
    },

    Aprobado: {
      color: "success",
      label: "Aprobado",
    },

    Rechazado: {
      color: "error",
      label: "Rechazado",
    },
  };

  return <Chip size="small" color={config[condicion].color} label={config[condicion].label} />;
};
interface RowProps {
  row: {
    empleadoId: number;
    codigoEmpleado: string;
    nombreCompleto: string;
    cantidadPermisos: number;
    totalHorasPermisos: number;
    permisos: {
      id: number;
      fecha: string;
      horaInicio: string;
      horaFin: string;
      totalHoras: number;
      motivo: string;
      lugar: string;
      condicion: Condicion;
    }[];
  };
}

function Row({ row }: RowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell width={60}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell>{row.codigoEmpleado}</TableCell>

        <TableCell>{row.nombreCompleto}</TableCell>

        <TableCell align="center">{row.cantidadPermisos}</TableCell>

        <TableCell align="center">{row.totalHorasPermisos} hrs</TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          colSpan={5}
          sx={{
            py: 0,
            borderBottom: 0,
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                }}
              >
                Detalle de permisos
              </Typography>

              <Table
                size="small"
                sx={{
                  "& th": {
                    fontWeight: 700,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora Inicio</TableCell>
                    <TableCell>Hora Fin</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Lugar</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.permisos.map((permiso) => (
                    <TableRow key={permiso.id}>
                      <TableCell>{permiso.fecha}</TableCell>

                      <TableCell>{permiso.horaInicio}</TableCell>

                      <TableCell>{permiso.horaFin}</TableCell>

                      <TableCell>{permiso.totalHoras} hrs</TableCell>

                      <TableCell>{permiso.motivo}</TableCell>

                      <TableCell>{permiso.lugar}</TableCell>

                      <TableCell>{chipCondicion(permiso.condicion)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const fechaActual = new Date();

const defaultValues: PermisoMensualForm = {
  anio: fechaActual.getFullYear(),
  mes: fechaActual.getMonth() + 1,
};

export default function ListarPermisosMensual() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarPermisosMensual) : false;
  const [filtros, setFiltros] = useState<PermisoMensualForm>(defaultValues);

  //!React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermisoMensualForm>({
    resolver: standardSchemaResolver(PermisoMensualSchema),

    defaultValues,

    mode: "onSubmit",
  });

  const { permisosMensuales, loading: loadingPermisos } = usePermisosMensuales(canAccess, filtros.anio, filtros.mes);

  const onSubmit = (data: PermisoMensualForm) => {
    setFiltros(data);
  };

  const handleClear = () => {
    reset(defaultValues);

    setFiltros({
      anio: 0,
      mes: 0,
    });
  };

  const rows = React.useMemo(() => {
    if (filtros.anio === 0 || filtros.mes === 0) {
      return [];
    }

    return permisosMensuales;
  }, [permisosMensuales, filtros]);

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack direction="row" sx={{ spacing: 1, alignItems: "center" }}>
            <EventNote color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Reporte mensual de permisos
            </Typography>
          </Stack>
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 3 }}>
          <Controller
            name="anio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Año"
                fullWidth
                error={!!errors.anio}
                helperText={errors.anio?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  htmlInput: {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 4,
                  },
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);

                  field.onChange(value);
                }}
              />
            )}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Mes</InputLabel>
            <Select value={mesFiltro} label="Mes" onChange={(e) => setMesFiltro(e.target.value)}>
              {meses.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <button>Buscar</button>
          <button>Limpiar</button>
        </Grid> */}
        {/* FILTROS */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
            >
              {/* AÑO */}
              <Controller
                name="anio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Año"
                    size="small"
                    fullWidth
                    error={!!errors.anio}
                    helperText={errors.anio?.message}
                    slotProps={{
                      htmlInput: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 4,
                      },
                    }}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4);

                      field.onChange(Number(value));
                    }}
                  />
                )}
              />

              {/* MES */}
              <Controller
                name="mes"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.mes}>
                    <InputLabel>Mes</InputLabel>

                    <Select {...field} label="Mes">
                      {meses.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                          {m.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              {/* BOTONES */}
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" startIcon={<Search />}>
                  Buscar
                </Button>

                <Button variant="outlined" color="inherit" startIcon={<CleaningServices />} onClick={handleClear}>
                  Limpiar
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Grid>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
