export const toDotNetDateTime = (value: any): string => {
  if (!value) return "";

  if (typeof value.year === "number" && typeof value.month === "number" && typeof value.day === "number") {
    const year = String(value.year).padStart(4, "0");
    const month = String(value.month).padStart(2, "0");
    const day = String(value.day).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00`;
  }

  const raw = value?.toString?.();
  if (typeof raw === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00`;
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  return "";
};
