export interface CampoPdfEmpleado {
  etiqueta: string;
  valor: string | number | null | undefined;
}

export interface SeccionPdfEmpleado {
  titulo: string;
  campos: CampoPdfEmpleado[];
}

interface ExportarEmpleadoPdfParams {
  nombreCompleto: string;
  codigoEmpleado: string | null;
  estado: string;
  secciones: SeccionPdfEmpleado[];
}

const normalizarValor = (valor: CampoPdfEmpleado["valor"]) =>
  valor === null || valor === undefined || valor === "" ? "—" : String(valor);

const limpiarNombreArchivo = (valor: string) =>
  valor
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();

const obtenerLogoDataUrl = async () => {
  const response = await fetch("/LogoFamet2.png");
  if (!response.ok) return null;

  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
};

export async function exportarEmpleadoPdf({
  nombreCompleto,
  codigoEmpleado,
  estado,
  secciones,
}: ExportarEmpleadoPdfParams) {
  const [{ default: jsPDF }, { default: autoTable }, logoDataUrl] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    obtenerLogoDataUrl(),
  ]);
  const doc = new jsPDF({ format: "a4", unit: "mm" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 30, "F");
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 14, 5, 46, 20);
  }

  doc.setDrawColor(189, 189, 189);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth - 38, 3, 24, 25, 1.5, 1.5, "S");
  doc.setTextColor(117, 117, 117);
  doc.setFontSize(8);
  doc.text("FOTO", pageWidth - 26, 16, { align: "center" });

  doc.setTextColor(25, 118, 210);
  doc.setFontSize(18);
  doc.text("Ficha de empleado", 80, 13);
  doc.setFontSize(11);
  doc.text(nombreCompleto, 80, 21);

  doc.setTextColor(33, 33, 33);
  doc.setFontSize(10);
  doc.text(`Código: ${normalizarValor(codigoEmpleado)}`, 14, 38);
  doc.text(`Estado: ${estado}`, pageWidth - 14, 38, { align: "right" });

  let startY = 44;

  secciones.forEach((seccion) => {
    autoTable(doc, {
      startY,
      head: [[{ content: seccion.titulo, colSpan: 2 }]],
      body: seccion.campos.map(({ etiqueta, valor }) => [etiqueta, normalizarValor(valor)]),
      theme: "grid",
      headStyles: {
        fillColor: [25, 118, 210],
        fontStyle: "bold",
        halign: "left",
      },
      styles: {
        fontSize: 9,
        cellPadding: 2.5,
      },
      columnStyles: {
        0: { cellWidth: 58, fontStyle: "bold", fillColor: [245, 247, 250] },
        1: { cellWidth: 124 },
      },
      margin: { left: 14, right: 14 },
    });
    startY = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  });

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Página ${page} de ${totalPages}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 8, {
      align: "right",
    });
  }

  doc.save(`empleado-${limpiarNombreArchivo(codigoEmpleado ?? nombreCompleto)}.pdf`);
}
