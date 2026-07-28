import dayjs from "dayjs";
import "dayjs/locale/es";

const parseNonStandardDate = (date: string): Date | null => {
  // Manejar formato "22-nov-1985" (mes en inglés o español abreviado)
  const match = date.match(/^(\d{1,2})-([a-z]{3})-(\d{4})$/i);
  if (match) {
    const [, day, monthStr, year] = match;
    const months: Record<string, number> = {
      ene: 0,
      jan: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      aug: 7,
      sep: 8,
      set: 8,
      oct: 9,
      nov: 10,
      dic: 11,
      dec: 11,
    };
    const month = months[monthStr.toLowerCase()];
    if (month !== undefined) {
      return new Date(Number(year), month, Number(day));
    }
  }
  return null;
};

export const formatDate = (date: string | Date | null | undefined) => {
  if (date === null || date === undefined || date === "" || date === "0001-01-01T00:00:00") {
    return "—";
  }

  const dateString = typeof date === "string" ? date : date.toISOString();

  // Intentar parsear formato no estándar primero
  const parsedDate = parseNonStandardDate(dateString);
  if (parsedDate && !isNaN(parsedDate.getTime())) {
    return dayjs(parsedDate).locale("es").format("DD-MMM-YYYY");
  }

  // Usar dayjs para formatos estándar
  const dayjsDate = dayjs(dateString);
  if (dayjsDate.isValid()) {
    return dayjsDate.locale("es").format("DD-MMM-YYYY");
  }

  return "—";
};

interface DotNetDateInput {
  year?: number;
  month?: number;
  day?: number;
  toString?: () => string;
}

export const toDotNetDateTime = (value: DotNetDateInput | null | undefined): string => {
  if (!value) return "";

  if (typeof value.year === "number" && typeof value.month === "number" && typeof value.day === "number") {
    const year = String(value.year).padStart(4, "0");
    const month = String(value.month).padStart(2, "0");
    const day = String(value.day).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00`;
  }

  const raw = value.toString?.();
  if (typeof raw === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00`;
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  return "";
};
