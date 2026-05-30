export const STATUS_PELAJAR_OPTIONS = [
  "TÖMER",
  "D2",
  "D3",
  "S1",
  "S2",
  "S3",
] as const;

const currentYear = new Date().getFullYear();
const angkatanStartYear = currentYear - 7; // angkatan dimulai dari 10 tahun yang lalu

export const ANGKATAN_OPTIONS = Array.from(
  { length: currentYear - angkatanStartYear + 2 },
  (_, index) => String(angkatanStartYear + index),
) as [string, ...string[]];

export const JENIS_KELAMIN_OPTIONS = ["laki-laki", "perempuan"] as const;
export const CATEGORY_VALUES = [
  "beasiswa",
  "akademik",
  "sosial",
  "olahraga",
  "pengumuman",
  "kaderisasi",
] as const;

export const CATAGORY_BERITA = [
  "beasiswa",
  "kegiatan",
  "berita-utama",
  "kabar-kampus",
  "prestasi",
  "artikel",
  "pengumuman",
] as const;
