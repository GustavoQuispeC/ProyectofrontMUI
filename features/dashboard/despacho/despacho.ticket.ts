import dayjs from "dayjs";
import { Despacho } from "./despacho.type";

const EMPRESA_NOMBRE = "GRUPO FAMET S.A.C.";
const EMPRESA_RUC = "20539127374";
const EMPRESA_CORREO = "administrador@grupofamet.com";
const EMPRESA_WEB = "www.grupofamet.com";
const LOGO_URL = "/LogoFamet2.png";

export interface ProductoPendienteDespacho {
  productoCodigo: string;
  productoNombre: string;
  cantidad: number;
}

const obtenerImagenDataUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const fechaFmt = (valor?: string | null) => (valor ? dayjs(valor).format("DD/MM/YYYY") : "—");
const horaFmt = (valor?: string | null) => (valor ? dayjs(valor).format("HH:mm") : "—");

function modalidadNombre(modalidad: string | number) {
  if (Number(modalidad) === 2) return "Envío a domicilio";
  if (Number(modalidad) === 1) return "Recojo en tienda";
  if (Number(modalidad) === 3) return "Entrega inmediata";

  const valor = String(modalidad)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (valor.includes("domicilio")) return "Envío a domicilio";
  if (valor.includes("inmediata")) return "Entrega inmediata";
  return "Recojo en tienda";
}

export async function imprimirTicketDespacho(despacho: Despacho, pendientes: ProductoPendienteDespacho[]) {
  const [{ default: jsPDF }, logoDataUrl] = await Promise.all([import("jspdf"), obtenerImagenDataUrl(LOGO_URL)]);

  const ancho = 80;
  const margen = 4;
  const anchoUtil = ancho - margen * 2;
  const anchoProducto = 58;
  const alturaMaxima = 180;
  const fechaReferencia = despacho.fechaProgramada || despacho.createdAt;
  const tempDoc = new jsPDF({ unit: "mm", format: [ancho, 300] });
  tempDoc.setFontSize(7);

  const lineasDetalle = despacho.detalles.map(
    (detalle) =>
      (tempDoc.splitTextToSize(`${detalle.productoCodigo} - ${detalle.productoNombre}`, anchoProducto) as string[])
        .length,
  );
  const lineasPendientes = pendientes.map(
    (detalle) =>
      (tempDoc.splitTextToSize(`${detalle.productoCodigo} - ${detalle.productoNombre}`, anchoProducto) as string[])
        .length,
  );
  const altura =
    56 +
    lineasDetalle.reduce((total, lineas) => total + lineas, 0) * 3.2 +
    lineasPendientes.reduce((total, lineas) => total + lineas, 0) * 3.2 +
    despacho.detalles.length * 2 +
    pendientes.length * 2 +
    (despacho.direccionEntrega ? 8 : 0) +
    (despacho.observaciones ? 8 : 0);

  const doc = new jsPDF({ unit: "mm", format: [ancho, Math.min(Math.max(altura, 120), alturaMaxima)] });
  let altoPagina = doc.internal.pageSize.getHeight();
  let y = 6;

  const nuevaPagina = () => {
    doc.addPage([ancho, alturaMaxima]);
    altoPagina = alturaMaxima;
    y = 7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`DESPACHO : ${despacho.codigo}`, ancho / 2, y, { align: "center" });
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("CONTINUACION", ancho / 2, y, { align: "center" });
    y += 3;
    doc.line(margen, y, ancho - margen, y);
    y += 4;
  };

  const asegurarEspacio = (alturaNecesaria: number) => {
    if (y + alturaNecesaria > altoPagina - 8) nuevaPagina();
  };

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", ancho / 2 - 9, y, 18, 8);
    y += 12;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(EMPRESA_NOMBRE, ancho / 2, y, { align: "center" });
  y += 4;
  doc.text(`RUC: ${EMPRESA_RUC}`, ancho / 2, y, { align: "center" });
  y += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(EMPRESA_CORREO, ancho / 2, y, { align: "center" });
  y += 3.2;
  doc.text(EMPRESA_WEB, ancho / 2, y, { align: "center" });
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`DESPACHO : ${despacho.codigo}`, ancho / 2, y, { align: "center" });
  y += 5;

  doc.setFontSize(7.5);
  doc.text(`VENTA: ${despacho.ventaCodigo}`, margen, y);
  const tiendaLineas = doc.splitTextToSize(`TIENDA: ${despacho.tiendaNombre}`, 38) as string[];
  tiendaLineas.forEach((linea, index) => {
    doc.text(linea, ancho - margen, y + index * 3.2, { align: "right" });
  });
  y += Math.max(tiendaLineas.length, 1) * 3.5;

  doc.text(`MODALIDAD: ${modalidadNombre(despacho.modalidad).toUpperCase()}`, margen, y);
  y += 3.5;

  doc.setFont("helvetica", "normal");
  doc.text(`FECHA: ${fechaFmt(fechaReferencia)}`, margen, y);
  doc.text(`HORA: ${horaFmt(fechaReferencia)}`, ancho - margen, y, { align: "right" });
  y += 3.5;
  doc.text(`CONDUCTOR: ${despacho.conductorNombre || "Sin asignar"}`, margen, y);
  y += 3.5;
  if (despacho.vehiculoPlaca) {
    doc.text(`VEHICULO: ${despacho.vehiculoPlaca}`, margen, y);
    y += 3.5;
  }
  if (despacho.direccionEntrega) {
    const lineas = doc.splitTextToSize(`DIRECCION: ${despacho.direccionEntrega}`, anchoUtil) as string[];
    lineas.forEach((linea) => {
      asegurarEspacio(3.2);
      doc.text(linea, margen, y);
      y += 3.2;
    });
  }

  asegurarEspacio(11);
  y += 1;
  doc.line(margen, y, ancho - margen, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("CANT", margen, y);
  doc.text("PRODUCTO", margen + 10, y);
  y += 1.5;
  doc.line(margen, y, ancho - margen, y);
  y += 3.2;

  doc.setFont("helvetica", "normal");
  despacho.detalles.forEach((detalle) => {
    const lineas = doc.splitTextToSize(
      `${detalle.productoCodigo} - ${detalle.productoNombre}`,
      anchoProducto,
    ) as string[];

    lineas.forEach((linea, index) => {
      asegurarEspacio(3.2);
      if (index === 0) doc.text(String(detalle.cantidad), margen, y);
      doc.text(linea, margen + 10, y);
      y += 3.2;
    });
    y += 0.7;
  });
  if (despacho.detalles.length === 0) {
    asegurarEspacio(4);
    doc.text("Sin productos", margen + 10, y);
    y += 4;
  }

  asegurarEspacio(14);
  y += 2;
  doc.line(margen, y, ancho - margen, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.text("PENDIENTES POR ENTREGAR", margen, y);
  y += 3.5;
  doc.text("CANT", margen, y);
  doc.text("PRODUCTO", margen + 10, y);
  y += 1.5;
  doc.line(margen, y, ancho - margen, y);
  y += 3.2;

  doc.setFont("helvetica", "normal");
  pendientes.forEach((detalle) => {
    const lineas = doc.splitTextToSize(
      `${detalle.productoCodigo} - ${detalle.productoNombre}`,
      anchoProducto,
    ) as string[];

    lineas.forEach((linea, index) => {
      asegurarEspacio(3.2);
      if (index === 0) doc.text(String(detalle.cantidad), margen, y);
      doc.text(linea, margen + 10, y);
      y += 3.2;
    });
    y += 0.7;
  });
  if (pendientes.length === 0) {
    asegurarEspacio(4);
    doc.text("Sin productos pendientes", margen + 10, y);
    y += 4;
  }

  if (despacho.observaciones) {
    asegurarEspacio(10);
    y += 2;
    doc.line(margen, y, ancho - margen, y);
    y += 4;
    const lineas = doc.splitTextToSize(`OBS: ${despacho.observaciones}`, anchoUtil) as string[];
    lineas.forEach((linea) => {
      asegurarEspacio(3.2);
      doc.text(linea, margen, y);
      y += 3.2;
    });
  }

  asegurarEspacio(9);
  y += 2;
  doc.line(margen, y, ancho - margen, y);
  y += 4;
  doc.setFontSize(7);
  doc.text("Documento interno de despacho", ancho / 2, y, { align: "center" });
  doc.internal.pageSize.height = y + 8;

  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}
