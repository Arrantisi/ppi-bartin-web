export type TNewsCategoryTone = "neutral" | "urgent" | "info" | "success" | "accent";

const CATEGORY_TONES: Readonly<Record<string, TNewsCategoryTone>> = {
  pengumuman: "urgent",
  "berita-utama": "accent",
  beasiswa: "info",
  "kabar-kampus": "info",
  prestasi: "success",
  kegiatan: "success",
  artikel: "neutral",
};

/** Kategori berita dipetakan ke nada warna bermakna; kategori tak dikenal netral. */
export function getNewsCategoryTone(category?: string | null): TNewsCategoryTone {
  const key = category?.trim().toLowerCase();
  if (!key) return "neutral";
  return CATEGORY_TONES[key] ?? "neutral";
}

/** Warna teks label kategori (selalu menemani teks, bukan satu-satunya penanda). */
export const newsCategoryToneStyles: Record<TNewsCategoryTone, string> = {
  neutral: "text-text-secondary",
  urgent: "text-warning",
  info: "text-info",
  success: "text-success",
  accent: "text-accent",
};

/** Titik kecil sebelum label supaya warna tidak bergantung pada teks saja. */
export const newsCategoryDotStyles: Record<TNewsCategoryTone, string> = {
  neutral: "bg-text-disabled",
  urgent: "bg-warning",
  info: "bg-info",
  success: "bg-success",
  accent: "bg-accent",
};
