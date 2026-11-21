import type { TDashboardTrendItem } from "@/types/admin-dashboard";

/** Persentase 0–100 dengan satu angka desimal. Aman untuk 0/0. */
export function toPercent(part: number, total: number): number {
  if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0) return 0;
  const raw = (part / total) * 100;
  return Math.min(100, Math.max(0, Math.round(raw * 10) / 10));
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatDateShort(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return shortDateFormatter.format(date);
}

export function formatDurationHours(hours: number | null): string {
  if (hours === null || !Number.isFinite(hours)) return "—";
  if (hours < 1) return "< 1 jam";
  if (hours < 24) return `${Math.round(hours)} jam`;
  return `${Math.round(hours / 24)} hari`;
}

export function getUtcDayKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/**
 * Membuat bucket harian UTC selama `days` hari berakhir pada `now`.
 * Dipakai agar grafik tetap punya sumbu tanggal walau tidak ada data.
 */
export function buildDailyTrend(
  users: Date[],
  participants: Date[],
  days = 14,
  now: Date = new Date(),
): TDashboardTrendItem[] {
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const buckets = new Map<string, TDashboardTrendItem>();
  for (let i = 0; i < days; i += 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    buckets.set(getUtcDayKey(day), {
      date: getUtcDayKey(day),
      users: 0,
      participants: 0,
    });
  }

  for (const date of users) {
    const bucket = buckets.get(getUtcDayKey(date));
    if (bucket) bucket.users += 1;
  }
  for (const date of participants) {
    const bucket = buckets.get(getUtcDayKey(date));
    if (bucket) bucket.participants += 1;
  }

  return Array.from(buckets.values());
}

export type TProfileCompletenessInput = {
  noTelephone?: string | null;
  nomorSiswa?: string | null;
  angkatan?: string | null;
  jurusan?: string | null;
  fakultas?: string | null;
};

const PROFILE_FIELDS: Array<[keyof TProfileCompletenessInput, string]> = [
  ["noTelephone", "No. Telepon"],
  ["nomorSiswa", "No. Siswa"],
  ["angkatan", "Angkatan"],
  ["jurusan", "Jurusan"],
  ["fakultas", "Fakultas"],
];

export function getMissingProfileFields(row: TProfileCompletenessInput): string[] {
  return PROFILE_FIELDS.filter(([key]) => {
    const value = row[key];
    return !value || String(value).trim() === "";
  }).map(([, label]) => label);
}
