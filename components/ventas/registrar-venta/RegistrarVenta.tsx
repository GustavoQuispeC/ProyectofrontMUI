"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { DataGrid, GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { alpha } from "@mui/material/styles";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MinimizeIcon from "@mui/icons-material/Minimize";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchIcon from "@mui/icons-material/Search";
import SellIcon from "@mui/icons-material/Sell";

import { useTiendas } from "@/features/dashboard/tienda/hooks/useTiendas";
import { useClientesListado } from "@/features/dashboard/cliente/hooks/useClientesListado";
import { useProductosCatalogoVenta } from "@/features/dashboard/producto/hooks/useProductos";
import { useListasPrecio } from "@/features/dashboard/listaPrecio/hooks/useListasPrecio";
import { useCajaSesionActiva } from "@/features/dashboard/caja/hooks/useCajaSesion";
import {
  useRegistrarVenta,
  useTiposPago,
  useModalidadesEntrega,
  useMediosPago,
  useTiposDocumento,
} from "@/features/dashboard/venta/hooks/useVenta";
import { ProductoCatalogoVenta } from "@/features/dashboard/producto/Producto.types";
import {
  MEDIO_CREDITO,
  MEDIO_DEPOSITO_BANCARIO,
  MEDIO_EFECTIVO,
  MODALIDAD_ENVIO_DOMICILIO,
  TIPO_PAGO_CONTADO,
  TIPO_PAGO_CREDITO,
  VentaForm,
  ventaSchema,
} from "@/features/dashboard/venta/venta.schema";
import { RegistrarVentaRequest, Venta } from "@/features/dashboard/venta/venta.type";
import { generarNotaVentaPdf, imprimirTicketVenta } from "@/features/dashboard/venta/helpers/ventaPdf";
import { Cliente } from "@/features/dashboard/cliente/cliente.type";
import RegistrarCliente from "@/components/clientes/registrar-cliente/RegistrarCliente";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { useMounted } from "@/shared/hooks/useMounted";
import { toastPromise } from "@/shared/utils/toast";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";

const monedaFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const catalogoPageSizeOptions = [10, 20, 50];

const seleccionarContenidoInput = (event: React.SyntheticEvent) => {
  if (event.target instanceof HTMLInputElement) event.target.select();
};

//! Fallback si el endpoint de listas de precio no responde
const listasPrecioFallback = [
  { id: 1, nombre: "Público general" },
  { id: 2, nombre: "Ferretería" },
  { id: 3, nombre: "Ecommerce" },
];

const defaultValues: VentaForm = {
  clienteId: 0,
  clienteTipoDocumento: 0,
  tiendaId: 0,
  tipoPago: 0,
  descuento: 0,
  costoEnvio: 0,
  observaciones: "",
  modalidadEntrega: 0,
  direccionEntrega: "",
  detalles: [],
  pagos: [{ tipoMedio: 0, monto: 0, montoRecibido: null, banco: "", numeroOperacion: "", fechaDeposito: "" }],
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

const sectionColors: Record<string, string> = {
  "Fecha y tienda": "#5586a7",
  "Catálogo de productos": "#458085",
  "Detalle de la venta": "#946f3b",
  "Datos del cliente y condiciones de venta": "#584e6e",
  Pagos: "#5d7564",
  "Resumen de la venta": "#526f6d",
};

function Section({ title, children, style, contentStyle }: SectionProps) {
  const color = sectionColors[title] ?? "#006064";

  return (
    <Paper
      elevation={0}
      style={style}
      sx={(theme) => ({
        border: "1px solid",
        borderColor: alpha(color, theme.palette.mode === "dark" ? 0.35 : 0.18),
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 2px 8px ${alpha("#263238", theme.palette.mode === "dark" ? 0.14 : 0.06)}`,
      })}
    >
      <Box
        sx={(theme) => ({
          px: 2.5,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: alpha(color, theme.palette.mode === "dark" ? 0.14 : 0.055),
          borderBottom: "1px solid",
          borderColor: alpha(color, theme.palette.mode === "dark" ? 0.28 : 0.14),
        })}
      >
        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 13, fontWeight: 700, color, letterSpacing: "0.04em" }}>
          {title.toUpperCase()}
        </Typography>
      </Box>
      <Box sx={{ p: 2.5 }} style={contentStyle}>
        {children}
      </Box>
    </Paper>
  );
}

//! Loading overlay
function LoadingOverlay() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        zIndex: 1,
      }}
    >
      <CircularProgress size={32} />
    </Box>
  );
}

interface ItemDialogState {
  productoId: number;
  codigo: string;
  nombre: string;
  stockDisponible: number;
  editIndex: number | null;
}

interface RegistrarVentaProps {
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export default function RegistrarVenta({ open, onClose, onMinimize }: RegistrarVentaProps) {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.registrarVenta) : false;
  const mounted = useMounted();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false);
  const [ventaRegistrada, setVentaRegistrada] = useState<Venta | null>(null);
  const canRegistrarCliente = user ? hasPermission(user.rol, permissions.registrarCliente) : false;

  const { tiendas, loading: loadingTiendas } = useTiendas(canAccess);
  const {
    clientes,
    loading: loadingClientes,
    refetch: refetchClientes,
  } = useClientesListado({
    pagina: 1,
    tamanoPagina: 200,
  });
  const { items: tiposPago, loading: loadingTiposPago } = useTiposPago();
  const { items: modalidadesEntrega, loading: loadingModalidades } = useModalidadesEntrega();
  const { items: mediosPago, loading: loadingMediosPago } = useMediosPago();
  const { items: tiposDocumento, loading: loadingTiposDocumento } = useTiposDocumento();
  const { listasPrecio } = useListasPrecio(canAccess);
  const registrarVentaMutation = useRegistrarVenta();

  const opcionesPrecio = listasPrecio.length > 0 ? listasPrecio : listasPrecioFallback;

  //! ---- Catálogo de productos (tabla 1) ----
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [debouncedBusqueda, setDebouncedBusqueda] = useState("");
  const busquedaProductoRef = useRef<HTMLInputElement | null>(null);
  const [listaPrecioId, setListaPrecioId] = useState<number>(1);
  const [catalogoPagination, setCatalogoPagination] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBusqueda(busquedaProducto), 400);
    return () => clearTimeout(timer);
  }, [busquedaProducto]);

  //! ---- Modal de producto ----
  const [itemDialog, setItemDialog] = useState<ItemDialogState | null>(null);
  const [itemCantidad, setItemCantidad] = useState<number | "">(1);
  const [itemPrecio, setItemPrecio] = useState<number | "">(0);
  const [itemError, setItemError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<VentaForm>({
    resolver: standardSchemaResolver(ventaSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const { fields, append, remove, update, replace } = useFieldArray({ control, name: "detalles" });
  const { fields: pagoFields, append: appendPago, remove: removePago } = useFieldArray({ control, name: "pagos" });

  const tiendaId = useWatch({ control, name: "tiendaId" });
  const clienteId = useWatch({ control, name: "clienteId" });
  const clienteTipoDocumento = useWatch({ control, name: "clienteTipoDocumento" });
  const detalles = useWatch({ control, name: "detalles" });
  const pagos = useWatch({ control, name: "pagos" });
  const descuento = useWatch({ control, name: "descuento" });
  const costoEnvio = useWatch({ control, name: "costoEnvio" });
  const tipoPago = useWatch({ control, name: "tipoPago" });
  const modalidadEntrega = useWatch({ control, name: "modalidadEntrega" });

  const tiendaIdNum = tiendaId ? Number(tiendaId) : null;

  const catalogoParams = useMemo(
    () => ({
      tiendaId: tiendaIdNum ?? 0,
      busqueda: debouncedBusqueda || undefined,
      pagina: catalogoPagination.page + 1,
      tamanoPagina: catalogoPagination.pageSize,
    }),
    [tiendaIdNum, debouncedBusqueda, catalogoPagination.page, catalogoPagination.pageSize],
  );

  const {
    productos: productosCatalogo,
    paginacion: catalogoPaginacion,
    loading: loadingCatalogo,
  } = useProductosCatalogoVenta(catalogoParams, canAccess && !!tiendaIdNum);

  const { sesion: sesionCaja, loading: loadingSesion } = useCajaSesionActiva(tiendaIdNum, canAccess);
  const cajaCerrada = !!tiendaIdNum && !loadingSesion && !sesionCaja;

  //! ---- Documento del cliente según tipo seleccionado ----
  const clienteSel = useMemo(() => clientes.find((c) => c.id === Number(clienteId)), [clientes, clienteId]);
  const tipoDocumentoSel = useMemo(
    () => tiposDocumento.find((t) => t.id === Number(clienteTipoDocumento)),
    [tiposDocumento, clienteTipoDocumento],
  );

  const documentoCliente = useMemo(() => {
    if (!clienteSel || !tipoDocumentoSel) return "";
    const nombre = tipoDocumentoSel.nombre.toUpperCase();
    if (nombre.includes("RUC")) return clienteSel.numeroRuc ?? "";
    if (nombre.includes("DNI")) return clienteSel.numeroDni ?? "";
    return clienteSel.numeroDni || clienteSel.numeroRuc || "";
  }, [clienteSel, tipoDocumentoSel]);

  //! Auto-selecciona el tipo de documento según el documento registrado del cliente
  useEffect(() => {
    if (!clienteSel || tiposDocumento.length === 0) return;
    const marca = clienteSel.numeroRuc ? "RUC" : clienteSel.numeroDni ? "DNI" : null;
    if (!marca) return;
    const match = tiposDocumento.find((t) => t.nombre.toUpperCase().includes(marca));
    if (match) setValue("clienteTipoDocumento", match.id);
  }, [clienteSel, tiposDocumento, setValue]);

  const prevTienda = useRef<number>(0);
  useEffect(() => {
    const current = tiendaId ? Number(tiendaId) : 0;
    if (prevTienda.current !== current) {
      prevTienda.current = current;
      replace([]);
      clearErrors("detalles");
      setCatalogoPagination((prev) => ({ ...prev, page: 0 }));
    }
  }, [tiendaId, replace, clearErrors]);

  const precioPorLista = useCallback(
    (producto: ProductoCatalogoVenta) => producto.precios.find((p) => p.listaPrecioId === listaPrecioId)?.precio,
    [listaPrecioId],
  );

  const subtotal = (detalles ?? []).reduce(
    (acc, d) => acc + (Number(d.cantidad) || 0) * (Number(d.precioUnitario) || 0) - (Number(d.descuentoUnitario) || 0),
    0,
  );
  //! Medios de pago permitidos según el tipo de pago: Contado → Efectivo/Depósito; Crédito → solo Crédito
  const mediosPagoFiltrados = useMemo(() => {
    if (Number(tipoPago) === TIPO_PAGO_CREDITO) return mediosPago.filter((m) => m.id === MEDIO_CREDITO);
    if (Number(tipoPago) === TIPO_PAGO_CONTADO) return mediosPago.filter((m) => m.id !== MEDIO_CREDITO);
    return mediosPago;
  }, [mediosPago, tipoPago]);

  //! Resetea medios de pago que quedan inválidos al cambiar el tipo de pago
  useEffect(() => {
    if (!Number(tipoPago)) return;
    pagos?.forEach((p, index) => {
      const medioId = Number(p.tipoMedio);
      if (!medioId) return;
      const invalido = Number(tipoPago) === TIPO_PAGO_CREDITO ? medioId !== MEDIO_CREDITO : medioId === MEDIO_CREDITO;
      if (invalido) setValue(`pagos.${index}.tipoMedio`, 0);
    });
  }, [tipoPago, pagos, setValue]);

  const costoEnvioNum = Number(modalidadEntrega) === MODALIDAD_ENVIO_DOMICILIO ? Number(costoEnvio) || 0 : 0;
  const totalProductos = Math.max(0, subtotal - (Number(descuento) || 0));
  const totalVenta = totalProductos + costoEnvioNum;
  const totalPagado = (pagos ?? []).reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  const efectivoPagoIndex = pagos?.findIndex((p) => Number(p.tipoMedio) === MEDIO_EFECTIVO) ?? -1;
  const montoRecibidoEfectivo = efectivoPagoIndex >= 0 ? Number(pagos?.[efectivoPagoIndex]?.montoRecibido) || 0 : 0;
  const vueltoTotal = (pagos ?? []).reduce(
    (acc, p) =>
      Number(p.tipoMedio) === MEDIO_EFECTIVO
        ? acc + Math.max(0, (Number(p.montoRecibido) || 0) - (Number(p.monto) || 0))
        : acc,
    0,
  );

  // ---- Selección de producto: abre el modal de cantidad/precio ----
  const handleClienteCreado = useCallback(
    (cliente: Cliente) => {
      void refetchClientes();
      setValue("clienteId", cliente.id, { shouldValidate: true });
    },
    [refetchClientes, setValue],
  );

  const handleSelectProducto = useCallback(
    (producto: ProductoCatalogoVenta) => {
      const existingIndex = fields.findIndex((f) => f.productoId === producto.id);
      setItemError("");
      setItemDialog({
        productoId: producto.id,
        codigo: producto.codigoInterno,
        nombre: producto.nombre,
        stockDisponible: producto.stockDisponible,
        editIndex: existingIndex >= 0 ? existingIndex : null,
      });
      if (existingIndex >= 0) {
        setItemCantidad(Number(detalles?.[existingIndex]?.cantidad) || 1);
        setItemPrecio(Number(detalles?.[existingIndex]?.precioUnitario) || 0);
      } else {
        setItemCantidad(1);
        setItemPrecio(precioPorLista(producto) ?? 0);
      }
    },
    [fields, detalles, precioPorLista],
  );

  const handleEditItem = useCallback(
    (index: number) => {
      const detalle = detalles?.[index];
      if (!detalle) return;
      setItemError("");
      setItemDialog({
        productoId: detalle.productoId,
        codigo: detalle.productoCodigo ?? "",
        nombre: detalle.productoNombre ?? "",
        stockDisponible: detalle.stockDisponible ?? Number.MAX_SAFE_INTEGER,
        editIndex: index,
      });
      setItemCantidad(Number(detalle.cantidad) || 1);
      setItemPrecio(Number(detalle.precioUnitario) || 0);
    },
    [detalles],
  );

  const handleConfirmItem = () => {
    if (!itemDialog) return;

    const cantidad = Number(itemCantidad);
    const precio = Number(itemPrecio);

    if (!cantidad || cantidad <= 0) {
      setItemError("La cantidad debe ser mayor a 0");
      return;
    }
    if (cantidad > itemDialog.stockDisponible) {
      setItemError(`Stock disponible: ${itemDialog.stockDisponible}`);
      return;
    }
    if (!precio || precio <= 0) {
      setItemError("El precio debe ser mayor a 0");
      return;
    }

    const base = {
      productoId: itemDialog.productoId,
      productoCodigo: itemDialog.codigo,
      productoNombre: itemDialog.nombre,
      stockDisponible: itemDialog.stockDisponible,
      cantidad,
      precioUnitario: precio,
      descuentoUnitario: 0,
      observaciones: null,
    };

    if (itemDialog.editIndex !== null) {
      update(itemDialog.editIndex, { ...fields[itemDialog.editIndex], cantidad, precioUnitario: precio });
    } else {
      append(base);
    }

    setItemDialog(null);
    clearErrors("detalles");
    window.setTimeout(() => {
      busquedaProductoRef.current?.focus();
      busquedaProductoRef.current?.select();
    }, 0);
  };

  const resetForm = () => {
    reset(defaultValues);
    setBusquedaProducto("");
    setCatalogoPagination({ page: 0, pageSize: 20 });
  };

  const handleClose = () => {
    setMinimized(false);
    onClose();
  };

  const extrasDocumentoVenta = useCallback(
    (venta: Venta) => {
      const tienda = tiendas.find((item) => item.id === venta.tiendaId);
      return {
        tipoPagoNombre: tiposPago.find((item) => item.id === venta.tipoPago)?.nombre,
        clienteTipoDocumentoNombre: tiposDocumento.find((item) => item.id === venta.clienteTipoDocumento)?.nombre,
        tiendaDireccion: tienda?.direccion,
        tiendaTelefono: tienda?.telefono,
      };
    },
    [tiendas, tiposPago, tiposDocumento],
  );

  const onSubmit = async (data: VentaForm) => {
    if (cajaCerrada) {
      setError("tiendaId", { type: "manual", message: "La caja de esta tienda está cerrada. Abra caja primero." });
      return;
    }

    const payload: RegistrarVentaRequest = {
      clienteId: data.clienteId,
      clienteTipoDocumento: data.clienteTipoDocumento,
      tiendaId: data.tiendaId,
      tipoPago: data.tipoPago,
      descuento: data.descuento,
      costoEnvio: data.modalidadEntrega === MODALIDAD_ENVIO_DOMICILIO ? data.costoEnvio : 0,
      observaciones: data.observaciones || null,
      modalidadEntrega: data.modalidadEntrega,
      direccionEntrega: data.modalidadEntrega === MODALIDAD_ENVIO_DOMICILIO ? data.direccionEntrega : null,
      detalles: data.detalles.map((d) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        descuentoUnitario: d.descuentoUnitario,
        observaciones: d.observaciones ?? null,
      })),
      pagos: data.pagos.map((p) => ({
        tipoMedio: p.tipoMedio,
        monto: p.monto,
        montoRecibido: p.tipoMedio === MEDIO_EFECTIVO && p.montoRecibido !== null ? Number(p.montoRecibido) : null,
        banco: p.tipoMedio === MEDIO_DEPOSITO_BANCARIO ? p.banco : null,
        numeroOperacion: p.tipoMedio === MEDIO_DEPOSITO_BANCARIO ? p.numeroOperacion : null,
        fechaDeposito: p.tipoMedio === MEDIO_DEPOSITO_BANCARIO ? p.fechaDeposito : null,
      })),
    };

    try {
      setSaving(true);
      const nuevaVenta = await toastPromise(registrarVentaMutation.registrarVenta(payload), {
        loading: "Registrando venta...",
        success: "Venta registrada correctamente",
        error: (error) => error.message,
      });
      setVentaRegistrada(nuevaVenta);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const catalogoColumns = useMemo<GridColDef<ProductoCatalogoVenta>[]>(
    () => [
      {
        field: "codigoInterno",
        headerName: "Código",
        width: 140,
        valueGetter: (_value, row) => row.codigoInterno || row.codigoBarras || "—",
      },
      { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 220 },
      {
        field: "unidadMedidaNombre",
        headerName: "Unidad",
        width: 110,
        align: "center",
        headerAlign: "center",
        valueGetter: (_value, row) => row.unidadMedidaNombre || "—",
      },
      {
        field: "stockDisponible",
        headerName: "Stock disp.",
        width: 120,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              alignSelf: "center",
              fontWeight: 600,
              color: params.row.stockDisponible > 0 ? "text.primary" : "error.main",
            }}
          >
            {params.row.stockDisponible}
          </Typography>
        ),
      },
      {
        field: "precio",
        headerName: "Precio",
        width: 110,
        align: "right",
        headerAlign: "center",
        renderCell: (params) => {
          const precio = precioPorLista(params.row);
          return (
            <Typography variant="body2" sx={{ alignSelf: "center", fontWeight: 600 }}>
              {precio !== undefined ? monedaFormatter.format(precio) : "—"}
            </Typography>
          );
        },
      },
      {
        field: "acciones",
        headerName: "Agregar",
        width: 110,
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<ProductoCatalogoVenta>) => (
          <Tooltip title="Agregar a la venta">
            <span>
              <IconButton
                size="small"
                color="primary"
                disabled={params.row.stockDisponible <= 0}
                onClick={() => handleSelectProducto(params.row)}
              >
                <AddShoppingCartIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        ),
      },
    ],
    [precioPorLista, handleSelectProducto],
  );

  if (!mounted || !open) return null;
  if (!canAccess) return <AccessDenied />;

  return (
    <>
      {/* Barra flotante cuando la ventana está minimizada */}
      {open && minimized && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: (theme) => theme.zIndex.modal + 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <SellIcon color="primary" fontSize="small" />
          <Typography variant="body2">
            <strong>Venta en curso</strong> — {detalles?.length ?? 0} producto(s)
            {totalVenta > 0 && ` · ${monedaFormatter.format(totalVenta)}`}
          </Typography>
          <Button size="small" variant="contained" onClick={() => setMinimized(false)}>
            Restaurar
          </Button>
          <Tooltip title="Cerrar venta">
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>
      )}

      <Dialog
        fullScreen
        keepMounted
        open={open && !minimized}
        onClose={handleClose}
        slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}
      >
        {/* Barra superior */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: { xs: 2, md: 3 },
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
              <SellIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                REGISTRO DE VENTA
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Seleccione productos del catálogo y complete los pagos
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Minimizar">
              <IconButton
                size="small"
                onClick={() => {
                  onMinimize();
                  setMinimized(true);
                }}
              >
                <MinimizeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cerrar">
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <DialogContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
          <Stack sx={{ gap: 2, maxWidth: 1400, mx: "auto" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.7fr) minmax(0, 0.3fr)" },
                gridTemplateAreas: {
                  xs: '"leftTop" "rightTop" "leftBottom" "rightBottom" "alert"',
                  lg: '"leftTop rightTop" "leftBottom rightBottom" "alert alert"',
                },
                gap: 2,
                alignItems: "start",
              }}
            >
              <Stack sx={{ gridArea: "leftTop", gap: 2, minWidth: 0, alignSelf: "stretch" }}>
                <Section title="Fecha y tienda">
                  <Stack sx={{ gap: 2 }}>
                    <Stack
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        alignItems: { xs: "stretch", sm: "flex-start" },
                        justifyContent: "space-between",
                      }}
                    >
                      <Controller
                        name="tiendaId"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            options={tiendas}
                            loading={loadingTiendas}
                            size="small"
                            value={tiendas.find((t) => t.id === field.value) ?? null}
                            onChange={(_, value) => field.onChange(value?.id ?? 0)}
                            getOptionLabel={(option) => option.nombre}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            noOptionsText="Sin resultados"
                            loadingText="Cargando..."
                            sx={{ minWidth: 280, flex: 1 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Tienda *"
                                placeholder="Seleccione una tienda"
                                error={!!errors.tiendaId}
                                helperText={errors.tiendaId?.message}
                              />
                            )}
                          />
                        )}
                      />

                      <TextField
                        label="Fecha"
                        size="small"
                        value={dayjs().format("DD/MM/YYYY")}
                        slotProps={{ input: { readOnly: true } }}
                        sx={{ minWidth: 180, width: { xs: "100%", sm: 220 } }}
                      />
                    </Stack>

                    {!!tiendaIdNum && loadingSesion && (
                      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                        <CircularProgress size={18} />
                        <Typography variant="body2" color="text.secondary">
                          Verificando sesión de caja...
                        </Typography>
                      </Stack>
                    )}

                    {cajaCerrada && (
                      <Alert
                        severity="warning"
                        icon={<PointOfSaleIcon />}
                        action={
                          <Button color="inherit" size="small" onClick={() => router.push("/dashboard/caja")}>
                            Ir a Caja
                          </Button>
                        }
                      >
                        La caja de esta tienda está cerrada. Debe abrir una sesión de caja antes de registrar una venta.
                      </Alert>
                    )}
                  </Stack>
                </Section>

                {/* TABLA 1: Catálogo de productos */}
                <Section
                  title="Catálogo de productos"
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                  contentStyle={{ flex: 1, minHeight: 0 }}
                >
                  <Stack sx={{ gap: 2, height: "100%" }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      sx={{ gap: 2, alignItems: { xs: "stretch", md: "center" } }}
                    >
                      <TextField
                        inputRef={busquedaProductoRef}
                        placeholder="Buscar por nombre, código o código de barras"
                        size="small"
                        value={busquedaProducto}
                        onChange={(e) => {
                          setBusquedaProducto(e.target.value);
                          setCatalogoPagination((prev) => ({ ...prev, page: 0 }));
                        }}
                        disabled={!tiendaIdNum}
                        slotProps={{
                          input: {
                            startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                          },
                        }}
                        sx={{ minWidth: 260, flex: 1 }}
                      />

                      <FormControl size="small" sx={{ ml: { md: "auto" } }}>
                        <RadioGroup
                          row
                          value={listaPrecioId}
                          onChange={(e) => setListaPrecioId(Number(e.target.value))}
                        >
                          {opcionesPrecio.map((l) => (
                            <FormControlLabel
                              key={l.id}
                              value={l.id}
                              control={<Radio size="small" />}
                              label={l.nombre}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Stack>

                    {!tiendaIdNum ? (
                      <Alert severity="info">Seleccione una tienda para ver el catálogo de productos.</Alert>
                    ) : (
                      <Box sx={{ flex: 1, minHeight: 260, width: "100%" }}>
                        <DataGrid
                          rows={productosCatalogo}
                          columns={catalogoColumns}
                          loading={loadingCatalogo}
                          slots={{ loadingOverlay: LoadingOverlay }}
                          onRowDoubleClick={(params) => {
                            if (params.row.stockDisponible > 0) handleSelectProducto(params.row);
                          }}
                          paginationModel={catalogoPagination}
                          onPaginationModelChange={setCatalogoPagination}
                          pageSizeOptions={catalogoPageSizeOptions}
                          paginationMode="server"
                          rowCount={catalogoPaginacion?.totalRegistros ?? 0}
                          getRowId={(row) => row.id}
                          getRowClassName={(params) => (params.row.stockDisponible <= 0 ? "fila-sin-stock" : "")}
                          disableRowSelectionOnClick
                          density="compact"
                          rowHeight={34}
                          columnHeaderHeight={38}
                          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                          sx={{
                            border: 0,
                            "& .fila-sin-stock .MuiDataGrid-cell": {
                              color: "error.main",
                            },
                            "& .fila-sin-stock .MuiTypography-root": {
                              color: "error.main",
                            },
                            "& .MuiDataGrid-columnHeader": {
                              backgroundColor: (theme) => alpha("#4f7477", theme.palette.mode === "dark" ? 0.15 : 0.07),
                              borderBottomColor: alpha("#4f7477", 0.18),
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                              fontWeight: 700,
                              color: (theme) => (theme.palette.mode === "dark" ? "#a9c4c6" : "#3f6265"),
                              textTransform: "uppercase",
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Stack>
                </Section>
              </Stack>

              <Box sx={{ gridArea: "leftBottom", minWidth: 0, alignSelf: "stretch" }}>
                {/* TABLA 2: Detalle de la venta */}
                <Section
                  title="Detalle de la venta"
                  style={{ height: "100%", display: "flex", flexDirection: "column" }}
                  contentStyle={{ flex: 1, minHeight: 0 }}
                >
                  <Stack sx={{ gap: 2, height: "100%" }}>
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ maxHeight: 240, minHeight: 160, overflow: "auto" }}
                    >
                      <Table
                        size="small"
                        sx={{
                          "& .MuiTableCell-root": {
                            py: 0.5,
                            px: 1.25,
                          },
                        }}
                      >
                        <TableHead
                          sx={(theme) => ({
                            backgroundColor: alpha("#826f55", theme.palette.mode === "dark" ? 0.14 : 0.065),
                            "& .MuiTableCell-root": {
                              color: theme.palette.mode === "dark" ? "#cfc4b3" : "#695a46",
                              fontWeight: 700,
                              borderBottomColor: alpha("#826f55", 0.18),
                            },
                          })}
                        >
                          <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell align="center" sx={{ width: 130 }}>
                              Cantidad
                            </TableCell>
                            <TableCell align="right">P. Unit.</TableCell>
                            <TableCell align="center" sx={{ width: 120 }}>
                              Desc. unit.
                            </TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="center" sx={{ width: 80 }}>
                              Acciones
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fields.map((item, index) => {
                            const detalle = detalles?.[index];
                            const linea =
                              (Number(detalle?.cantidad) || 0) * (Number(detalle?.precioUnitario) || 0) -
                              (Number(detalle?.descuentoUnitario) || 0);

                            return (
                              <TableRow
                                key={item.id}
                                hover
                                onDoubleClick={() => handleEditItem(index)}
                                sx={{ cursor: "pointer" }}
                              >
                                <TableCell>
                                  <Tooltip
                                    title={`${detalle?.productoCodigo ?? ""} - ${detalle?.productoNombre ?? ""}`}
                                  >
                                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                                      {detalle?.productoCodigo} - {detalle?.productoNombre}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                  <Controller
                                    name={`detalles.${index}.cantidad`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        size="small"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) =>
                                          field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                                        }
                                        onFocus={seleccionarContenidoInput}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          seleccionarContenidoInput(e);
                                        }}
                                        onDoubleClick={(e) => e.stopPropagation()}
                                        slotProps={{
                                          htmlInput: {
                                            min: 0.01,
                                            step: 0.01,
                                            max: detalle?.stockDisponible,
                                            style: { textAlign: "center", padding: "4px 8px" },
                                          },
                                        }}
                                        error={!!errors.detalles?.[index]?.cantidad}
                                        helperText={errors.detalles?.[index]?.cantidad?.message}
                                        sx={{ width: 110 }}
                                      />
                                    )}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  {monedaFormatter.format(Number(detalle?.precioUnitario) || 0)}
                                </TableCell>
                                <TableCell align="center">
                                  <Controller
                                    name={`detalles.${index}.descuentoUnitario`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        size="small"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) =>
                                          field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                                        }
                                        onFocus={seleccionarContenidoInput}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          seleccionarContenidoInput(e);
                                        }}
                                        onDoubleClick={(e) => e.stopPropagation()}
                                        slotProps={{
                                          htmlInput: {
                                            min: 0,
                                            step: 0.01,
                                            style: { textAlign: "center", padding: "4px 8px" },
                                          },
                                        }}
                                        error={!!errors.detalles?.[index]?.descuentoUnitario}
                                        sx={{ width: 100 }}
                                      />
                                    )}
                                  />
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>
                                  {monedaFormatter.format(linea > 0 ? linea : 0)}
                                </TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Quitar producto">
                                    <IconButton size="small" color="error" onClick={() => remove(index)}>
                                      <DeleteForeverIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {fields.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Sin productos. Haga doble clic o use el botón de agregar en el catálogo.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {errors.detalles?.root?.message && (
                      <FormHelperText error>{errors.detalles.root.message}</FormHelperText>
                    )}
                    {typeof errors.detalles?.message === "string" && (
                      <FormHelperText error>{errors.detalles.message}</FormHelperText>
                    )}

                    <Typography variant="body1" sx={{ alignSelf: "flex-end", fontWeight: 700, mt: "auto" }}>
                      Total venta: {monedaFormatter.format(Math.max(0, subtotal))}
                    </Typography>
                  </Stack>
                </Section>
              </Box>

              <Box sx={{ gridArea: "rightTop", minWidth: 0 }}>
                <Section title="Datos del cliente y condiciones de venta">
                  <Stack sx={{ gap: 2 }}>
                    <Stack
                      sx={{
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "stretch",
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          minWidth: 0,
                          width: "100%",
                          gap: 0.5,
                          alignItems: "flex-start",
                        }}
                      >
                        <Controller
                          name="clienteId"
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              options={clientes}
                              loading={loadingClientes}
                              size="small"
                              value={clientes.find((c) => c.id === field.value) ?? null}
                              onChange={(_, value) => field.onChange(value?.id ?? 0)}
                              getOptionLabel={(option) =>
                                option.nombreCompleto || option.razonSocial || `Cliente #${option.id}`
                              }
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              noOptionsText="Sin resultados"
                              loadingText="Cargando..."
                              fullWidth
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Cliente *"
                                  placeholder="Seleccione un cliente"
                                  error={!!errors.clienteId}
                                  helperText={errors.clienteId?.message}
                                />
                              )}
                            />
                          )}
                        />
                        <Tooltip title="Agregar cliente">
                          <span>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => setClienteDialogOpen(true)}
                              disabled={!canRegistrarCliente}
                              sx={{ mt: 0.25 }}
                            >
                              <PersonAddIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>

                      <Controller
                        name="clienteTipoDocumento"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            size="small"
                            error={!!errors.clienteTipoDocumento}
                            sx={{ minWidth: 0, width: "100%" }}
                          >
                            <Stack sx={{ alignItems: "flex-start", gap: 0.5 }}>
                              <FormLabel sx={{ fontSize: 12 }}>Tipo de documento</FormLabel>
                              <RadioGroup
                                row
                                value={field.value ? String(field.value) : ""}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                sx={{ flexWrap: "nowrap" }}
                              >
                                {tiposDocumento.map((t) => (
                                  <FormControlLabel
                                    key={t.id}
                                    value={String(t.id)}
                                    control={<Radio size="small" />}
                                    label={t.nombre}
                                    disabled={loadingTiposDocumento}
                                    sx={{ mr: 1 }}
                                  />
                                ))}
                              </RadioGroup>
                            </Stack>
                            {errors.clienteTipoDocumento && (
                              <FormHelperText>{errors.clienteTipoDocumento.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <TextField
                        label="Documento"
                        size="small"
                        value={documentoCliente}
                        placeholder="—"
                        slotProps={{ input: { readOnly: true } }}
                        helperText={
                          !clienteSel
                            ? "Seleccione un cliente"
                            : tipoDocumentoSel && !documentoCliente
                              ? "El cliente no tiene este documento registrado"
                              : undefined
                        }
                        error={!!tipoDocumentoSel && !!clienteSel && !documentoCliente}
                        sx={{ width: "100%" }}
                      />

                      <TextField
                        label="Teléfono"
                        size="small"
                        value={clienteSel?.telefono || ""}
                        placeholder="—"
                        slotProps={{ input: { readOnly: true } }}
                        helperText={
                          !clienteSel
                            ? "Seleccione un cliente"
                            : !clienteSel.telefono
                              ? "Sin teléfono registrado"
                              : undefined
                        }
                        sx={{ width: "100%" }}
                      />
                    </Stack>

                    <Stack
                      sx={{
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "stretch",
                      }}
                    >
                      <Controller
                        name="modalidadEntrega"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth size="small" error={!!errors.modalidadEntrega} sx={{ width: "100%" }}>
                            <InputLabel id="modalidad-entrega-label">Modalidad de entrega *</InputLabel>
                            <Select
                              labelId="modalidad-entrega-label"
                              label="Modalidad de entrega *"
                              value={field.value ? String(field.value) : ""}
                              onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : 0;
                                field.onChange(value);
                                if (value !== MODALIDAD_ENVIO_DOMICILIO) {
                                  setValue("direccionEntrega", "");
                                  clearErrors("direccionEntrega");
                                }
                              }}
                              disabled={loadingModalidades}
                            >
                              {modalidadesEntrega.map((m) => (
                                <MenuItem key={m.id} value={String(m.id)}>
                                  {m.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.modalidadEntrega && (
                              <FormHelperText>{errors.modalidadEntrega.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="direccionEntrega"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            value={field.value ?? ""}
                            label={
                              modalidadEntrega === MODALIDAD_ENVIO_DOMICILIO
                                ? "Dirección de entrega *"
                                : "Dirección de entrega"
                            }
                            size="small"
                            placeholder="Dirección de entrega"
                            disabled={modalidadEntrega !== MODALIDAD_ENVIO_DOMICILIO}
                            error={!!errors.direccionEntrega}
                            helperText={
                              errors.direccionEntrega?.message ??
                              (modalidadEntrega === MODALIDAD_ENVIO_DOMICILIO
                                ? "Obligatorio para envio a domicilio"
                                : "Solo aplica para envio a domicilio")
                            }
                            sx={{ width: "100%" }}
                          />
                        )}
                      />

                      <Controller
                        name="costoEnvio"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Costo de envío"
                            size="small"
                            type="number"
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            onFocus={seleccionarContenidoInput}
                            onClick={seleccionarContenidoInput}
                            disabled={modalidadEntrega !== MODALIDAD_ENVIO_DOMICILIO}
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                            error={!!errors.costoEnvio}
                            helperText={
                              errors.costoEnvio?.message ??
                              (modalidadEntrega === MODALIDAD_ENVIO_DOMICILIO
                                ? "Se suma al total de la venta"
                                : "Solo aplica para envío a domicilio")
                            }
                            sx={{ width: "100%" }}
                          />
                        )}
                      />
                    </Stack>

                    <Controller
                      name="observaciones"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={field.value ?? ""}
                          label="Observaciones"
                          size="small"
                          fullWidth
                          multiline
                          minRows={1}
                          placeholder="Observaciones de la venta (opcional)"
                          error={!!errors.observaciones}
                          helperText={errors.observaciones?.message}
                        />
                      )}
                    />
                  </Stack>
                </Section>
              </Box>

              {Number(modalidadEntrega) === MODALIDAD_ENVIO_DOMICILIO && (
                <Alert severity="info" sx={{ alignItems: "center", gridArea: "alert", py: 1.5 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    sx={{
                      gap: { xs: 1, sm: 2 },
                      alignItems: { xs: "flex-start", sm: "center" },
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="body1">
                      Total de productos:{" "}
                      <Box component="span" sx={{ fontWeight: 700, fontSize: "1.1rem", color: "text.primary" }}>
                        {monedaFormatter.format(totalProductos)}
                      </Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      +
                    </Typography>
                    <Typography variant="body1">
                      Envío:{" "}
                      <Box component="span" sx={{ fontWeight: 700, fontSize: "1.1rem", color: "text.primary" }}>
                        {monedaFormatter.format(costoEnvioNum)}
                      </Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      =
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800, fontSize: "1.25rem", color: "primary.main" }}>
                      Total a cobrar: {monedaFormatter.format(totalVenta)}
                    </Typography>
                  </Stack>
                </Alert>
              )}

              <Box sx={{ gridArea: "rightBottom", minWidth: 0 }}>
                <Section title="Pagos">
                  <Stack sx={{ gap: 1.5 }}>
                    {pagoFields.map((item, index) => {
                      const esDeposito = Number(pagos?.[index]?.tipoMedio) === MEDIO_DEPOSITO_BANCARIO;
                      const mediosDisponibles = mediosPagoFiltrados.filter(
                        (medio) =>
                          medio.id === Number(pagos?.[index]?.tipoMedio) ||
                          !pagos?.some((pago, pagoIndex) => pagoIndex !== index && Number(pago.tipoMedio) === medio.id),
                      );

                      return (
                        <Stack key={item.id} sx={{ gap: 1.5 }}>
                          <Stack sx={{ gap: 1.5 }}>
                            {index === 0 ? (
                              <Controller
                                name="tipoPago"
                                control={control}
                                render={({ field }) => (
                                  <FormControl fullWidth size="small" error={!!errors.tipoPago}>
                                    <InputLabel id="tipo-pago-label">Tipo de pago *</InputLabel>
                                    <Select
                                      labelId="tipo-pago-label"
                                      label="Tipo de pago *"
                                      value={field.value ? String(field.value) : ""}
                                      onChange={(e) => {
                                        const value = e.target.value ? Number(e.target.value) : 0;
                                        field.onChange(value);
                                        if (value === TIPO_PAGO_CREDITO) {
                                          if (pagoFields.length > 1) {
                                            removePago(pagoFields.slice(1).map((_, pagoIndex) => pagoIndex + 1));
                                          }
                                          setValue("pagos.0.tipoMedio", MEDIO_CREDITO);
                                        }
                                      }}
                                      disabled={loadingTiposPago}
                                    >
                                      {tiposPago.map((t) => (
                                        <MenuItem key={t.id} value={String(t.id)}>
                                          {t.nombre}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.tipoPago && <FormHelperText>{errors.tipoPago.message}</FormHelperText>}
                                  </FormControl>
                                )}
                              />
                            ) : null}

                            <Controller
                              name={`pagos.${index}.tipoMedio`}
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth size="small" error={!!errors.pagos?.[index]?.tipoMedio}>
                                  <InputLabel id={`medio-pago-label-${index}`}>Medio de pago *</InputLabel>
                                  <Select
                                    labelId={`medio-pago-label-${index}`}
                                    label="Medio de pago *"
                                    value={field.value ? String(field.value) : ""}
                                    onChange={(e) => {
                                      const value = e.target.value ? Number(e.target.value) : 0;
                                      field.onChange(value);
                                      if (value === MEDIO_DEPOSITO_BANCARIO && !pagos?.[index]?.fechaDeposito) {
                                        setValue(`pagos.${index}.fechaDeposito`, dayjs().format("YYYY-MM-DD"));
                                      }
                                    }}
                                    disabled={loadingMediosPago || !Number(tipoPago)}
                                  >
                                    {mediosDisponibles.map((m) => (
                                      <MenuItem key={m.id} value={String(m.id)}>
                                        {m.nombre}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {errors.pagos?.[index]?.tipoMedio && (
                                    <FormHelperText>{errors.pagos[index].tipoMedio.message}</FormHelperText>
                                  )}
                                </FormControl>
                              )}
                            />

                            <Stack direction="row" sx={{ gap: 0.5, alignItems: "flex-start" }}>
                              <Controller
                                name={`pagos.${index}.monto`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    label="Monto"
                                    size="small"
                                    type="number"
                                    value={field.value}
                                    onChange={(e) =>
                                      field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                                    }
                                    onFocus={seleccionarContenidoInput}
                                    onClick={seleccionarContenidoInput}
                                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                                    error={!!errors.pagos?.[index]?.monto}
                                    helperText={errors.pagos?.[index]?.monto?.message}
                                    sx={{ flex: 1, minWidth: 0 }}
                                  />
                                )}
                              />
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => removePago(index)}
                                disabled={pagoFields.length === 1}
                                sx={{ mt: 0.5 }}
                              >
                                <DeleteForeverIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>

                          {esDeposito && (
                            <Stack sx={{ gap: 1.5 }}>
                              <Controller
                                name={`pagos.${index}.banco`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    label="Banco *"
                                    size="small"
                                    placeholder="Ej: BCP, Interbank"
                                    error={!!errors.pagos?.[index]?.banco}
                                    helperText={errors.pagos?.[index]?.banco?.message}
                                    fullWidth
                                  />
                                )}
                              />

                              <Controller
                                name={`pagos.${index}.numeroOperacion`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    value={field.value ?? ""}
                                    label="N° de operación"
                                    size="small"
                                    placeholder="Opcional"
                                    error={!!errors.pagos?.[index]?.numeroOperacion}
                                    helperText={errors.pagos?.[index]?.numeroOperacion?.message}
                                    fullWidth
                                  />
                                )}
                              />

                              <Controller
                                name={`pagos.${index}.fechaDeposito`}
                                control={control}
                                render={({ field }) => (
                                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <DatePicker
                                      label="Fecha de depósito"
                                      value={field.value ? dayjs(field.value) : dayjs()}
                                      onChange={(value) => field.onChange(value?.format("YYYY-MM-DD") ?? null)}
                                      format="DD/MM/YYYY"
                                      slotProps={{
                                        textField: {
                                          size: "small",
                                          error: !!errors.pagos?.[index]?.fechaDeposito,
                                          helperText: errors.pagos?.[index]?.fechaDeposito?.message,
                                          fullWidth: true,
                                        },
                                      }}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                            </Stack>
                          )}
                        </Stack>
                      );
                    })}

                    {errors.pagos?.root?.message && <FormHelperText error>{errors.pagos.root.message}</FormHelperText>}

                    {Number(tipoPago) !== TIPO_PAGO_CREDITO && pagoFields.length < 2 && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() =>
                          appendPago({
                            tipoMedio: 0,
                            monto: 0,
                            montoRecibido: null,
                            banco: "",
                            numeroOperacion: "",
                            fechaDeposito: "",
                          })
                        }
                        disabled={!Number(pagos?.[0]?.tipoMedio)}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        Agregar pago
                      </Button>
                    )}
                  </Stack>
                </Section>
              </Box>
            </Box>

            <Section title="Resumen de la venta">
              <Stack
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(5, minmax(150px, 1fr))" },
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                <TextField
                  label="Total a pagar"
                  size="small"
                  value={monedaFormatter.format(totalVenta)}
                  slotProps={{ input: { readOnly: true } }}
                />
                <TextField
                  label="Envío"
                  size="small"
                  value={monedaFormatter.format(costoEnvioNum)}
                  slotProps={{ input: { readOnly: true } }}
                />
                <TextField
                  label="Descuento"
                  size="small"
                  value={monedaFormatter.format(Number(descuento) || 0)}
                  slotProps={{ input: { readOnly: true } }}
                />
                <TextField
                  label="Monto recibido"
                  size="small"
                  type="number"
                  value={montoRecibidoEfectivo || ""}
                  onFocus={seleccionarContenidoInput}
                  onClick={seleccionarContenidoInput}
                  onChange={(e) => {
                    if (efectivoPagoIndex < 0) return;
                    setValue(
                      `pagos.${efectivoPagoIndex}.montoRecibido`,
                      e.target.value === "" ? null : Number(e.target.value),
                      { shouldValidate: true },
                    );
                  }}
                  disabled={efectivoPagoIndex < 0}
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  error={efectivoPagoIndex >= 0 && !!errors.pagos?.[efectivoPagoIndex]?.montoRecibido}
                  helperText={
                    efectivoPagoIndex >= 0
                      ? errors.pagos?.[efectivoPagoIndex]?.montoRecibido?.message
                      : "Disponible al seleccionar Efectivo"
                  }
                />
                <TextField
                  label="Vuelto"
                  size="small"
                  value={monedaFormatter.format(vueltoTotal)}
                  slotProps={{ input: { readOnly: true } }}
                />
              </Stack>

              {Number(tipoPago) === TIPO_PAGO_CONTADO && totalPagado < totalVenta && (
                <FormHelperText error sx={{ mt: 1.5, textAlign: "right" }}>
                  Faltante por pagar: {monedaFormatter.format(totalVenta - totalPagado)}
                </FormHelperText>
              )}
            </Section>
          </Stack>
        </DialogContent>

        {/* Footer con acciones */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "stretch", sm: "flex-end" },
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
              flexWrap: "wrap",
              maxWidth: 1400,
              mx: "auto",
            }}
          >
            <Typography
              variant="h5"
              sx={(theme) => ({
                mr: { sm: "auto" },
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "success.main",
                backgroundColor: alpha("#c06e2b", theme.palette.mode === "dark" ? 0.14 : 0.07),
              })}
            >
              Total: {monedaFormatter.format(totalVenta)}
            </Typography>

            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={handleClose}
              disabled={saving}
              sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
            >
              Volver
            </Button>

            <Button
              variant="outlined"
              color="warning"
              size="medium"
              startIcon={<RestartAltIcon />}
              onClick={resetForm}
              disabled={saving}
              sx={{ minWidth: 120, width: { xs: "100%", sm: "auto" } }}
            >
              Limpiar
            </Button>

            <Button
              variant="contained"
              size="medium"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
              onClick={handleSubmit(onSubmit)}
              disabled={saving || loadingTiendas || cajaCerrada}
              sx={{ minWidth: 160, boxShadow: "none", borderRadius: 2, width: { xs: "100%", sm: "auto" } }}
            >
              {saving ? "Guardando..." : "Guardar venta"}
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <RegistrarCliente
        open={clienteDialogOpen}
        onClose={() => setClienteDialogOpen(false)}
        onClienteCreado={handleClienteCreado}
      />

      <Dialog open={!!ventaRegistrada} onClose={() => setVentaRegistrada(null)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: "success.main" }}>
              <SellIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Venta registrada
              </Typography>
              <Typography variant="caption" color="text.secondary">
                La nota de venta fue generada correctamente
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {ventaRegistrada && (
            <Stack sx={{ gap: 1.5 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Código
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {ventaRegistrada.codigo}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Cliente
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
                  {ventaRegistrada.clienteNombre}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                  {monedaFormatter.format(ventaRegistrada.total)}
                </Typography>
              </Stack>
              {Number(ventaRegistrada.vuelto) > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Vuelto
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {monedaFormatter.format(ventaRegistrada.vuelto)}
                  </Typography>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button size="small" color="inherit" onClick={() => setVentaRegistrada(null)}>
            Cerrar
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<LocalPrintshopOutlinedIcon />}
            onClick={() => {
              if (ventaRegistrada) void imprimirTicketVenta(ventaRegistrada, extrasDocumentoVenta(ventaRegistrada));
            }}
          >
            Imprimir ticket
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<PictureAsPdfOutlinedIcon />}
            onClick={() => {
              if (ventaRegistrada) void generarNotaVentaPdf(ventaRegistrada, extrasDocumentoVenta(ventaRegistrada));
            }}
          >
            Descargar PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de producto: cantidad y precio */}
      <Dialog open={!!itemDialog} onClose={() => setItemDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {itemDialog && itemDialog.editIndex !== null ? "Editar producto" : "Agregar producto"}
        </DialogTitle>
        <DialogContent dividers>
          {itemDialog && (
            <Stack sx={{ gap: 2, pt: 0.5 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {itemDialog.codigo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {itemDialog.nombre}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Stock disponible: {itemDialog.stockDisponible}
                </Typography>
              </Box>

              <TextField
                label="Precio unitario *"
                size="small"
                type="number"
                value={itemPrecio}
                onFocus={seleccionarContenidoInput}
                onClick={seleccionarContenidoInput}
                onChange={(e) => {
                  setItemPrecio(e.target.value === "" ? "" : Number(e.target.value));
                  setItemError("");
                }}
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                fullWidth
              />

              <TextField
                label="Cantidad *"
                size="small"
                type="number"
                value={itemCantidad}
                onFocus={seleccionarContenidoInput}
                onClick={seleccionarContenidoInput}
                onChange={(e) => {
                  setItemCantidad(e.target.value === "" ? "" : Number(e.target.value));
                  setItemError("");
                }}
                slotProps={{ htmlInput: { min: 0.01, step: 0.01, max: itemDialog.stockDisponible } }}
                fullWidth
                autoFocus
              />

              <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
                Total: {monedaFormatter.format(Math.max(0, (Number(itemCantidad) || 0) * (Number(itemPrecio) || 0)))}
              </Typography>

              {itemError && <Alert severity="error">{itemError}</Alert>}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialog(null)} color="inherit" size="small">
            Cancelar
          </Button>
          <Button onClick={handleConfirmItem} variant="contained" size="small" startIcon={<AddShoppingCartIcon />}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
