/**
 * Helper untuk query yang boleh gagal diam-diam.
 *
 * TUJUAN: `next build` meng-*prerender* route saat build. Kalau salah satu query
 * throw karena database tidak terjangkau, seluruh build gagal — bahkan untuk
 * perubahan yang sama sekali tidak menyentuh database. `safeDb` membuat failure
 * itu turun jadi "data kosong" supaya deploy tetap bisa jalan.
 *
 * ⚠️ JANGAN dipakai untuk jalur auth atau operasi kritis.
 * Di auth, kegagalan HARUS menghasilkan error, bukan `[]` — kalau tidak,
 * "gagal cek" akan terlihat sama dengan "tidak punya akses".
 *
 * Gunakan `prisma` langsung untuk: auth check, mutasi, dan apa pun yang
 * kegagalannya tidak boleh ditelan diam-diam.
 */

/** Bungkus satu query Prisma; kembalikan `fallback` kalau error. */
export async function safeDb<T>(
  operation: () => Promise<T>,
  fallback: T,
  context?: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(
      `[safeDb]${context ? ` (${context})` : ""} query gagal, memakai nilai fallback:`,
      error,
    );
    return fallback;
  }
}

/**
 * `generateStaticParams` yang tidak pernah menggagalkan build.
 * Mengembalikan `[]` → Next.js menunda render ke waktu request.
 * Halaman yang sudah `force-dynamic` tidak terpengaruh.
 */
export async function safeStaticParams<T>(
  operation: () => Promise<Array<{ slug: string } & T>>,
  context?: string,
): Promise<Array<{ slug: string } & T>> {
  try {
    return await operation();
  } catch (error) {
    console.error(
      `[safeDb]${context ? ` (${context})` : ""} generateStaticParams gagal, dikembalikan kosong:`,
      error,
    );
    return [];
  }
}
