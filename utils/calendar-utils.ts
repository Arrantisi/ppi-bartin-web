import {
  format,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { id } from "date-fns/locale/id";
import type { CalendarEvent } from "@/types/calendar";

export function formatDateHeader(date: Date): string {
  return format(date, "EEEE, d MMMM yyyy", { locale: id }).toUpperCase();
}

export function formatShortDateHeader(date: Date): string {
  return format(date, "EEE, d MMM yyyy", { locale: id }).toUpperCase();
}

export function formatEventTime(date: Date, time?: string): string {
  if (time) return time;
  return format(date, "HH:mm");
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy", { locale: id });
}

export function getEventsForDate(
  events: CalendarEvent[],
  date: Date,
): CalendarEvent[] {
  return events.filter((event) => isSameDay(event.date, date));
}

export function getEventDates(events: CalendarEvent[]): string[] {
  return events.map((event) => format(event.date, "yyyy-MM-dd"));
}

export function getUniqueEventDates(events: CalendarEvent[]): string[] {
  return [...new Set(getEventDates(events))];
}

export function hasEventOnDate(events: CalendarEvent[], date: Date): boolean {
  return events.some((event) => isSameDay(event.date, date));
}

export function isDateSelected(date: Date, selectedDate: Date): boolean {
  return isSameDay(date, selectedDate);
}

export function isDateToday(date: Date): boolean {
  return isToday(date);
}

export function sortEventsByDate(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getDaysInMonth(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
}

export function getCalendarDays(date: Date): (Date | null)[] {
  const firstDay = startOfMonth(date);
  const lastDay = endOfMonth(date);
  const startPad = firstDay.getDay();
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  const padded: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) {
    padded.push(null);
  }
  padded.push(...days);

  return padded;
}

export function groupEventsByDate(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = format(event.date, "yyyy-MM-dd");
    const existing = groups.get(key) || [];
    existing.push(event);
    groups.set(key, existing);
  }
  return groups;
}
