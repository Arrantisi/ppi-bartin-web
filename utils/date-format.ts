import { format } from "date-fns";
import { id } from "date-fns/locale";

export const formattedDate = (tanggal: Date) => {
  const date = new Date(tanggal);
  return format(date, "E, LLL dd, y", { locale: id });
};

export const formattedDateNews = (tanggal: Date) => {
  const date = new Date(tanggal);
  return format(date, "EEE, LLL d", { locale: id });
};

export const formattedDateMeta = (tanggal: Date) => {
  const date = new Date(tanggal);
  return format(date, "EEE, d LLL", { locale: id });
};

export const formattedDeadlineMeta = (tanggal: Date) => {
  const date = new Date(tanggal);
  return format(date, "d LLL", { locale: id });
};

export function mergeTime(date: Date, time?: string): Date {
  if (!time) return date;
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

export function formatDateTime(date: Date): string {
  return format(date, "E, LLL dd, y · HH:mm", { locale: id });
}
