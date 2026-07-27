import dayjs from "dayjs";

export const formatHoras = (horas: number): string => {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
};

export const formatTime = (time: string | null | undefined) =>
  time ? dayjs(`2000-01-01T${time}`).format("HH:mm") : "—";
