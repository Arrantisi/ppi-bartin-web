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

const fullDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatDateShort(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return shortDateFormatter.format(date);
}

/** Tanggal lengkap untuk kartu detail admin. */
export function formatDateFull(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return fullDateFormatter.format(date);
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

/** Query param Next.js bisa berupa string, array, atau undefined. */
export function firstSearchParam(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** Halaman invalid jadi 1; batas atas tetap dinormalisasi di data function. */
export function parseAdminPage(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 1;
}

export type TPaginationItem = number | "ellipsis";

/**
 * Deretan halaman untuk navigasi tabel: selalu ada halaman pertama & terakhir,
 * plus tetangga halaman aktif. Celah besar ditandai ellipsis.
 */
export function getPaginationItems(
  current: number,
  total: number,
): TPaginationItem[] {
  if (!Number.isFinite(current) || !Number.isFinite(total) || total < 1) {
    return [1];
  }

  const active = Math.min(Math.max(1, Math.floor(current)), total);
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([1, total, active]);
  const from = Math.max(2, active - 1);
  const to = Math.min(total - 1, active + 1);
  for (let page = from; page <= to; page += 1) pages.add(page);

  // Jika yang terlewat hanya satu halaman, tampilkan langsung (tanpa ellipsis).
  if (from - 2 === 1) pages.add(2);
  if (total - 1 - to === 1) pages.add(total - 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const items: TPaginationItem[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push("ellipsis");
    items.push(page);
  });
  return items;
}
