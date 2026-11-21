export type Category =
  | "beasiswa"
  | "akademik"
  | "sosial"
  | "olahraga"
  | "pengumuman"
  | "kaderisasi";

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  category: Category;
  description?: string;
  slug?: string;
  source: "participant" | "entry";
};

export type ViewType = "daily" | "agenda";

export type DialogState = {
  open: boolean;
  mode: "add" | "edit";
  event?: CalendarEvent;
};
