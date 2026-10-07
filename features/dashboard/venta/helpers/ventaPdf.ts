import dayjs from "dayjs";
import type { jsPDF } from "jspdf";
import { Venta } from "../venta.type";

const EMPRESA_NOMBRE = "GRUPO FAMET S.A.C.";
const EMPRESA_RUC = "20539127374";
const EMPRESA_CORREO = "administrador@grupofamet.com";
const EMPRESA_WEB = "www.grupofamet.com";
const LOGO_URL = "/LogoFamet2.png";

const moneda = (valor: number) => `S/ ${valor.toFixed(2)}`;
const fechaFmt = (valor?: string | null) => (valor ? dayjs(valor).format("DD/MM/YYYY") : "—");
const horaFmt = (valor?: string | null) => (valor ? dayjs(valor).format("hh:mm A") : "—");

const limpiarNombreArchivo = (valor: string) =>
  valor
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();

//! Íconos vectoriales para el ticket (helvetica no soporta emojis)
const iconoCorreo = (doc: jsPDF, x: number, y: number) => {
  const w = 2.2;
  const h = 1.5;
  doc.setLineWidth(0.15);
  doc.roundedRect(x, y, w, h, 0.2, 0.2);
  doc.line(x, y + 0.15, x + w / 2, y + h * 0.62);
  doc.line(x + w, y + 0.15, x + w / 2, y + h * 0.62);
};

const iconoWeb = (doc: jsPDF, cx: number, cy: number) => {
  const r = 0.85;
  doc.setLineWidth(0.15);
  doc.circle(cx, cy, r);
  doc.line(cx - r, cy, cx + r, cy);
  doc.ellipse(cx, cy, r * 0.55, r);
};

const obtenerImagenDataUrl = async (url: string | null) => {
  if (!url) return null;

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

//! ---- Monto en letras (soles) ----
const UNIDADES = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
const DIECIS = [
  "DIEZ",
  "ONCE",
  "DOCE",
  "TRECE",
  "CATORCE",
  "QUINCE",
  "DIECISEIS",
  "DIECISIETE",
  "DIECIOCHO",
  "DIECINUEVE",
];
const DECENAS = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const CENTENAS = [
  "",
  "CIENTO",
  "DOSCIENTOS",
  "TRESCIENTOS",
  "CUATROCIENTOS",
  "QUINIENTOS",
  "SEISCIENTOS",
  "SETECIENTOS",
  "OCHOCIENTOS",
  "NOVECIENTOS",
];

function tresCifras(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "CIEN";

  const partes: string[] = [];
  const c = Math.floor(n / 100);
  const resto = n % 100;

  if (c > 0) partes.push(CENTENAS[c]);
  if (resto === 0) return partes.join(" ");
  if (resto < 10) partes.push(UNIDADES[resto]);
  else if (resto < 20) partes.push(DIECIS[resto - 10]);
  else {
    const d = Math.floor(resto / 10);
    const u = resto % 10;
    if (u === 0) partes.push(DECENAS[d]);
    else if (d === 2) partes.push(`VEINTI${UNIDADES[u]}`);
    else partes.push(`${DECENAS[d]} Y ${UNIDADES[u]}`);
  }
  return partes.join(" ");
}

export function numeroALetras(valor: number): string {
  const entero = Math.floor(Math.abs(valor));
  const centimos = Math.round((Math.abs(valor) - entero) * 100);

  if (entero === 0) return `CERO CON ${String(centimos).padStart(2, "0")}/100`;

  const millones = Math.floor(entero / 1_000_000);
  const miles = Math.floor((entero % 1_000_000) / 1000);
  const resto = entero % 1000;

  const partes: string[] = [];
  if (millones > 0) partes.push(millones === 1 ? "UN MILLON" : `${tresCifras(millones)} MILLONES`);
  if (miles > 0) partes.push(miles === 1 ? "MIL" : `${tresCifras(miles)} MIL`);
  if (resto > 0) partes.push(tresCifras(resto));

  return `${partes.join(" ")} CON ${String(centimos).padStart(2, "0")}/100`;
}

export interface VentaDocExtras {
  tipoPagoNombre?: string;
  estadoVentaNombre?: string;
  estadoPagoNombre?: string;
  medioPagoNombre?: string;
  clienteTipoDocumentoNombre?: string;
  tiendaDireccion?: string;
  tiendaTelefono?: string | null;
}

//! "DNI 30489229" / "RUC 20539127374" — tipo + número del cliente
const documentoClienteTexto = (venta: Venta, extras: VentaDocExtras) =>
  [
    extras.clienteTipoDocumentoNombre?.toUpperCase() || (venta.clienteNumeroDocumento ? "DOC" : null),
    venta.clienteNumeroDocumento,
  ]
    .filter(Boolean)
    .join(" ");

//! Ticket de venta formato 80mm — abre el diálogo de impresión del navegador
export async function imprimirTicketVenta(venta: Venta, extras: VentaDocExtras = {}) {
  const [{ default: jsPDF }, logoDataUrl] = await Promise.all([import("jspdf"), obtenerImagenDataUrl(LOGO_URL)]);

  const ancho = 80;
  const margen = 4;
  const anchoUtil = ancho - margen * 2;

  const anchoNombre = 40;
  const tempDoc = new jsPDF({ unit: "mm", format: [ancho, 300] });
  tempDoc.setFontSize(7.5);
  const lineasPorItem = venta.detalles.map(
    (d) => (tempDoc.splitTextToSize(d.productoNombre, anchoNombre) as string[]).length,
  );
  const altura =
    66 +
    lineasPorItem.reduce((a, b) => a + b, 0) * 3.2 +
    venta.detalles.length * 4 +
    42 +
    (Number(venta.costoEnvio) > 0 ? 4 : 0) +
    (Number(venta.montoRecibido) > 0 ? 4 : 0) +
    (Number(venta.vuelto) > 0 ? 4 : 0) +
    (venta.observaciones ? 4 : 0);

  const doc = new jsPDF({ unit: "mm", format: [ancho, Math.max(altura, 130)] });
  let y = 6;

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
  const contactoTienda = [extras.tiendaDireccion, extras.tiendaTelefono ? `Telf: ${extras.tiendaTelefono}` : null]
    .filter(Boolean)
    .join("  ·  ");
  if (contactoTienda) {
    const lineasContacto = doc.splitTextToSize(contactoTienda, anchoUtil) as string[];
    lineasContacto.forEach((linea) => {
      doc.text(linea, ancho / 2, y, { align: "center" });
      y += 3.2;
    });
  }
  const lineaIcono = (icono: "correo" | "web", texto: string) => {
    const iconW = 2.2;
    const gap = 0.9;
    const tw = doc.getTextWidth(texto);
    const x0 = ancho / 2 - (iconW + gap + tw) / 2;
    if (icono === "correo") iconoCorreo(doc, x0, y - 1.65);
    else iconoWeb(doc, x0 + iconW / 2, y - 0.8);
    doc.text(texto, x0 + iconW + gap, y);
    y += 3.2;
  };
  lineaIcono("correo", EMPRESA_CORREO);
  lineaIcono("web", EMPRESA_WEB);
  y += 1.3;

  doc.setLineWidth(0.3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`NOTA DE VENTA : ${venta.codigo}`, ancho / 2, y, { align: "center" });
  y += 5;

  doc.setFontSize(7.5);
  doc.text(venta.clienteNombre || "PÚBLICO GENERAL", margen, y);
  const docCliente = documentoClienteTexto(venta, extras);
  if (docCliente) {
    doc.setFont("helvetica", "normal");
    doc.text(docCliente, ancho - margen, y, { align: "right" });
  }
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(`FECHA: ${fechaFmt(venta.fechaConfirmacion)}`, margen, y);
  doc.text(`HORA: ${horaFmt(venta.fechaConfirmacion)}`, ancho - margen, y, { align: "right" });
  y += 4;

  doc.line(margen, y, ancho - margen, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("Cant", margen, y);
  doc.text("DESCRIPCION", margen + 10, y);
  doc.text("PRECIO", ancho - 24, y, { align: "right" });
  doc.text("TOTAL", ancho - margen, y, { align: "right" });
  y += 1.5;

  doc.line(margen, y, ancho - margen, y);
  y += 3.5;

  doc.setFont("helvetica", "normal");
  venta.detalles.forEach((detalle) => {
    const lineas = doc.splitTextToSize(detalle.productoNombre, anchoNombre) as string[];
    lineas.forEach((linea, i) => {
      if (i === 0) {
        doc.text(String(detalle.cantidad), margen, y);
        doc.text(linea, margen + 10, y);
        doc.text(detalle.precioUnitario.toFixed(2), ancho - 24, y, { align: "right" });
        doc.text(detalle.subtotal.toFixed(2), ancho - margen, y, { align: "right" });
      } else {
        doc.text(linea, margen + 10, y);
      }
      y += 3.2;
    });
    y += 0.8;
  });

  doc.line(margen, y, ancho - margen, y);
  y += 4;

  const impuestoTotal = venta.detalles.reduce((acc, d) => acc + d.impuesto, 0);
  const subtotalProductos = venta.detalles.reduce((acc, d) => acc + d.subtotal, 0);

  doc.setFontSize(7.5);
  doc.text("SUBTOTAL", margen, y);
  doc.text("(S/)", ancho - 24, y, { align: "right" });
  doc.text(subtotalProductos.toFixed(2), ancho - margen, y, { align: "right" });
  y += 3.5;
  doc.text("I.G.V", margen, y);
  doc.text("(S/)", ancho - 24, y, { align: "right" });
  doc.text(impuestoTotal.toFixed(2), ancho - margen, y, { align: "right" });
  y += 3.5;

  if (Number(venta.costoEnvio) > 0) {
    doc.text("COSTO ENVIO", margen, y);
    doc.text("(S/)", ancho - 24, y, { align: "right" });
    doc.text(Number(venta.costoEnvio).toFixed(2), ancho - margen, y, { align: "right" });
    y += 4;
  } else {
    y += 0.5;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TOTAL", margen, y);
  doc.text("(S/)", ancho - 24, y, { align: "right" });
  doc.text(venta.total.toFixed(2), ancho - margen, y, { align: "right" });
  y += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  if (Number(venta.montoRecibido) > 0) {
    doc.text("RECIBIDO", margen, y);
    doc.text("(S/)", ancho - 24, y, { align: "right" });
    doc.text(Number(venta.montoRecibido).toFixed(2), ancho - margen, y, { align: "right" });
    y += 3.5;
  }
  if (Number(venta.vuelto) > 0) {
    doc.text("VUELTO", margen, y);
    doc.text("(S/)", ancho - 24, y, { align: "right" });
    doc.text(Number(venta.vuelto).toFixed(2), ancho - margen, y, { align: "right" });
    y += 4.5;
  } else {
    y += 1;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const letras = doc.splitTextToSize(`SON: ${numeroALetras(venta.total)} SOLES`, anchoUtil) as string[];
  letras.forEach((linea) => {
    doc.text(linea, margen, y);
    y += 3.2;
  });
  y += 0.8;

  if (venta.observaciones) {
    const obs = doc.splitTextToSize(`OBS: ${venta.observaciones}`, anchoUtil) as string[];
    obs.forEach((linea) => {
      doc.text(linea, margen, y);
      y += 3.2;
    });
  }
  if (extras.medioPagoNombre) {
    doc.text(`FORMA DE PAGO: ${extras.medioPagoNombre.toUpperCase()}`, margen, y);
    y += 3.5;
  }
  if (extras.tipoPagoNombre) {
    doc.text(`COND.VENTA: ${extras.tipoPagoNombre.toUpperCase()}`, margen, y);
    y += 3.5;
  }

  y += 1;
  doc.line(margen, y, ancho - margen, y);
  y += 4;
  doc.setFontSize(7);
  doc.text("Gracias por su compra", ancho / 2, y, { align: "center" });

  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}

