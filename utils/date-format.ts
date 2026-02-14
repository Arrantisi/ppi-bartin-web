import { format } from "date-fns";
import { id } from "date-fns/locale";

export const formattedDate = (tanggal: Date) => {
  const date = new Date(tanggal);
  return format(date, "LLL dd, y", { locale: id });
};
