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
    (venta.clienteNumeroDocumento ? 4 : 0);

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
  doc.text("NOTA DE VENTA", margen, y);
  doc.text(venta.codigo, ancho - margen, y, { align: "right" });
  y += 5;

  doc.setFontSize(8);
  doc.text(venta.clienteNombre || "PÚBLICO GENERAL", ancho / 2, y, { align: "center" });
  y += 3.5;

  const docCliente = documentoClienteTexto(venta, extras);
  if (docCliente) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(docCliente, ancho / 2, y, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    y += 4;
  } else {
    y += 0.5;
  }

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
  const totalGravado = venta.total - impuestoTotal;

  doc.setFontSize(7.5);
  doc.text("TOTAL GRAVADO", margen, y);
  doc.text("(S/)", ancho - 24, y, { align: "right" });
  doc.text(totalGravado.toFixed(2), ancho - margen, y, { align: "right" });
  y += 3.5;
  doc.text("I.G.V", margen, y);
  doc.text("(S/)", ancho - 24, y, { align: "right" });
  doc.text(impuestoTotal.toFixed(2), ancho - margen, y, { align: "right" });
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TOTAL", margen, y);
  doc.text("(S/)", ancho - 24, y, { align: "right" });
  doc.text(venta.total.toFixed(2), ancho - margen, y, { align: "right" });
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const letras = doc.splitTextToSize(`SON: ${numeroALetras(venta.total)} SOLES`, anchoUtil) as string[];
  letras.forEach((linea) => {
    doc.text(linea, margen, y);
    y += 3.2;
  });
  y += 0.8;

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

//! Nota de venta en formato A4 — descarga el PDF
export async function generarNotaVentaPdf(venta: Venta, extras: VentaDocExtras = {}) {
  const [{ default: jsPDF }, { default: autoTable }, logoDataUrl] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    obtenerImagenDataUrl(LOGO_URL),
  ]);

  const doc = new jsPDF({ format: "a4", unit: "mm" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 30, "F");
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 14, 5, 46, 20);
  }

  doc.setTextColor(25, 118, 210);
  doc.setFontSize(18);
  doc.text("NOTA DE VENTA", 80, 13);
  doc.setFontSize(11);
  doc.text(venta.codigo, 80, 21);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.text(`${EMPRESA_NOMBRE}  ·  RUC: ${EMPRESA_RUC}`, 14, 32);
  const contactoTiendaA4 = [
    extras.tiendaDireccion ? `Dirección: ${extras.tiendaDireccion}` : null,
    extras.tiendaTelefono ? `Telf: ${extras.tiendaTelefono}` : null,
  ]
    .filter(Boolean)
    .join("  ·  ");
  if (contactoTiendaA4) {
    doc.text(contactoTiendaA4, 14, 36);
  }
  doc.text(`Correo: ${EMPRESA_CORREO}`, pageWidth - 14, 32, { align: "right" });
  doc.text(`Web: ${EMPRESA_WEB}`, pageWidth - 14, 36, { align: "right" });

  doc.setTextColor(33, 33, 33);
  doc.setFontSize(10);
  doc.text(`Fecha: ${fechaFmt(venta.fechaConfirmacion)} ${horaFmt(venta.fechaConfirmacion)}`, pageWidth - 14, 44, {
    align: "right",
  });

  autoTable(doc, {
    startY: 48,
    head: [[{ content: "DATOS DE LA VENTA", colSpan: 4 }]],
    body: [
      ["Cliente", venta.clienteNombre || "—", "Tienda", venta.tiendaNombre || "—"],
      ["Documento", documentoClienteTexto(venta, extras) || "—", "Atendido por", venta.empleadoAtiendeNombre || "—"],
      ["Tipo de pago", extras.tipoPagoNombre ?? "—", "Estado pago", extras.estadoPagoNombre ?? "—"],
      ["Estado", extras.estadoVentaNombre ?? "—", "", ""],
    ],
    theme: "grid",
    headStyles: { fillColor: [25, 118, 210], fontStyle: "bold", halign: "left" },
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: "bold", fillColor: [245, 247, 250] },
      1: { cellWidth: 60 },
      2: { cellWidth: 32, fontStyle: "bold", fillColor: [245, 247, 250] },
      3: { cellWidth: 55 },
    },
    margin: { left: 14, right: 14 },
  });

  let startY = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  autoTable(doc, {
    startY,
    head: [["Código", "Producto", "Cant.", "P. Unit.", "Desc.", "Subtotal", "IGV", "Total"]],
    body: venta.detalles.map((d) => [
      d.productoCodigo,
      d.productoNombre,
      String(d.cantidad),
      moneda(d.precioUnitario),
      moneda(d.descuentoUnitario),
      moneda(d.subtotal),
      moneda(d.impuesto),
      moneda(d.total),
    ]),
    theme: "grid",
    headStyles: { fillColor: [25, 118, 210], fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
      7: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  startY = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  const impuestoTotal = venta.detalles.reduce((acc, d) => acc + d.impuesto, 0);
  const totalGravado = venta.total - impuestoTotal;
  const pendiente = venta.total - venta.montoPagado;

  autoTable(doc, {
    startY,
    body: [
      ["Total gravado", moneda(totalGravado)],
      ["I.G.V", moneda(impuestoTotal)],
      ...(venta.descuento > 0 ? [["Descuento", `-${moneda(venta.descuento)}`]] : []),
      ["Total", moneda(venta.total)],
      ["Monto pagado", moneda(venta.montoPagado)],
      ...(pendiente > 0.005 ? [["Pendiente", moneda(pendiente)]] : []),
    ],
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", halign: "right", cellWidth: 130 },
      1: { halign: "right", cellWidth: 40 },
    },
    margin: { left: 14, right: 14 },
  });

  startY = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`SON: ${numeroALetras(venta.total)} SOLES`, 14, startY);
  startY += 5;
  doc.setFont("helvetica", "normal");
  if (extras.medioPagoNombre) {
    doc.text(`FORMA DE PAGO: ${extras.medioPagoNombre.toUpperCase()}`, 14, startY);
    startY += 4.5;
  }
  if (extras.tipoPagoNombre) {
    doc.text(`COND.VENTA: ${extras.tipoPagoNombre.toUpperCase()}`, 14, startY);
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`${EMPRESA_NOMBRE} — Nota de venta ${venta.codigo}`, 14, doc.internal.pageSize.getHeight() - 8);
    doc.text(`Página ${page} de ${totalPages}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 8, {
      align: "right",
    });
  }

  doc.save(`nota-venta-${limpiarNombreArchivo(venta.codigo)}.pdf`);
}
