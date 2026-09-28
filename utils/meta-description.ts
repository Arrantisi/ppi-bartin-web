/**
 * Util untuk membuat meta description / Open Graph description dari konten
 * rich-text (Tiptap) yang masih berupa HTML.
 *
 * Dipakai di `generateMetadata` halaman acara & berita.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201c",
  rdquo: "\u201d",
};

const BLOCK_TAGS = /<\/?(?:p|div|br|hr|li|ul|ol|h[1-6]|tr|td|th|table|section|article|blockquote|pre)\b[^>]*>/gi;

/**
 * Buang seluruh isi `<script>` dan `<style>`, termasuk isinya — bukan hanya
 * tagnya. Kalau hanya tag yang dibuang, isi JavaScript/CSS ikut bocor ke
 * meta description.
 */
function removeNonVisibleBlocks(html: string): string {
  return html.replace(
    /<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
    " ",
  );
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      safeFromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      safeFromCodePoint(parseInt(dec, 10)),
    )
    .replace(/&([a-z]+);/gi, (match, name: string) => {
      const decoded = NAMED_ENTITIES[name.toLowerCase()];
      return decoded ?? match;
    });
}

function safeFromCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

/**
 * Ubah HTML menjadi teks polos.
 *
 * Tag block-level diganti SPASI, bukan dihapus. Kalau tagnya dihapus begitu
 * saja, konten Tiptap seperti `<p>satu</p><p>dua</p>` menjadi `satudua` —
 * dua paragraf menempel jadi satu kata.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";

  return decodeEntities(
    removeNonVisibleBlocks(html).replace(BLOCK_TAGS, " ").replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Buat meta description dari konten rich-text.
 *
 * Panjang hasil dibatasi `maxLength` dan ellipsis hanya ditambahkan kalau
 * teksnya benar-benar dipotong — append "..." tanpa syarat membuat deskripsi
 * pendek tetap berakhiran elipsis.
 */
export function toMetaDescription(
  html: string | null | undefined,
  maxLength = 200,
): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;

  // Batas degenerate: tidak ada ruang cukup untuk memotong + ellipsis.
  if (maxLength <= 3) return text.slice(0, maxLength);

  // Sisakan ruang untuk ellipsis dulu, kalau tidak hasil akhir melebihi
  // maxLength (potong 200 karakter + "..." = 203).
  const budget = Math.max(1, maxLength - 3);
  const sliced = text.slice(0, budget);
  const lastSpace = sliced.lastIndexOf(" ");

  // Potong di batas kata, tapi jangan terlalu banyak memotong (kata terakhir
  // bisa saja jauh lebih pendek dari setengah sisa budget).
  const body = lastSpace > budget * 0.6 ? sliced.slice(0, lastSpace) : sliced;

  return `${body.replace(/[\s.,;:!?-]+$/, "")}...`;
}
