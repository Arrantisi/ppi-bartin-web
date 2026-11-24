> status: done — koreksi 24 Nov 2026: blok "Transaksi terbaru" dihapus sesuai permintaan (juga menghilangkan `RangeError: Invalid time value` dari tanggal transaksi sheet), format tanggal footer diamankan bila `updatedAt` tidak valid. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Ringkasan DKE di Halaman Home — Plan

## Overview

Kartu **Transparansi Keuangan** di `/home` saat ini hanya berisi judul, satu kalimat, dan tautan eksternal ke Google Sheet. Pengguna harus membuka sheet atau `/home/finance` untuk melihat angka. Fitur ini menggabungkan ringkasan DKE langsung ke kartu shortcut yang sudah ada: saldo dana + arus kas, rekap Wajib Kas, dan penyerapan anggaran. **Transaksi terbaru sengaja tidak ditampilkan di `/home`** — rincian tetap di `/home/finance` dan sheet bendahara. Tidak ada section baru terpisah, tidak ada tabel Prisma baru, dan Google Sheets tetap single source of truth.

Data diambil sekali di server dengan `getFinanceSnapshot()` (sudah `React.cache()` dan auth) lalu diteruskan ke komponen presentasional server-only. Tidak ada polling di `/home`; polling 5 detik tetap hanya di `/home/finance`.

Koreksi runtime: beberapa baris buku besar memiliki nilai `tanggal` yang tidak bisa dikonversi ke `Date` valid, sehingga `date-fns/format` melempar `RangeError: Invalid time value` di `TransactionRow`. Karena blok transaksi memang tidak diperlukan di beranda, komponen dan sorting-nya dihapus total. Format tanggal di footer juga dijaga agar tidak pernah menerima `Invalid Date`.

## Database Model (Prisma)

Tidak ada perubahan schema. Sumber data: tab `DASHBOARD`, `BUKU BESAR KEUANGAN`, dan `WAJIB KAS` dari spreadsheet bendahara yang sama dengan dashboard finance.

## Server Actions

Tidak ada server action baru dan tidak ada penulisan ke sheet.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

## Client Components

- `features/home/finance-shortcut.tsx` — diubah jadi server component `async`; memanggil `getFinanceSnapshot()` dalam `try/catch`, merender `FinanceSummary` bila data tersedia, dan fallback netral + `FinanceSheetLink` bila gagal. Header kartu dan CTA existing dipertahankan.
- `features/home/finance-summary.tsx` (baru, server-only) — menerima `TFinanceSnapshot`, merender empat kartu ringkas:
  1. **Saldo dana** dari `report.funds` (label + IDR, plus TRY bila > 0).
  2. **Arus kas** dari `snapshot.totals` (**bukan** `report.totals` yang statis): pemasukan/pengeluaran/saldo IDR dan TRY, ikon arus memakai `--success`/`--danger`.
  3. **Wajib Kas** dari `wajibKas.summary`: total / lunas / tunggakan.
  4. **Penyerapan anggaran** dari `report.budget`: agregat pagu/realisasi/sisa + persentase realisasi.
  - Tidak merender `snapshot.transactions` sama sekali. Footer meta memakai helper `formatUpdatedAt` yang mengembalikan `"-"` bila `updatedAt` bukan tanggal valid.
- `features/home/content.tsx` — membungkus `FinanceShortcut` dengan `Suspense` agar acara/berita tetap tampil saat data finance dimuat.
- `components/skeletons/finance-home-skeleton.tsx` (baru) — skeleton kecil berbentuk kartu shortcut, bukan `FinanceSkeleton` penuh.
- `components/shared/finance-sheet-link.tsx` — tidak diubah; tetap dipakai sebagai CTA laporan lengkap.

Komponen baru tidak memakai `"use client"`. Ikon memakai `@tabler/icons-react` dengan `aria-hidden`; angka memakai `--font-mono` melalui `font-mono`; formatter memakai `formatFinanceAmount` dari `utils/finance-parser.ts`.

## Routes

| URL          | Akses                                  | Layout                |
| ------------ | -------------------------------------- | --------------------- |
| /home        | semua anggota login & profil lengkap   | `HomeLayoutComponent` |
| /home/finance | semua anggota login & profil lengkap  | `HomeLayoutComponent` |

Tidak ada route atau `force-dynamic` baru. `(protected)/layout.tsx` tetap menjadi gerbang auth.

## Security

- `getFinanceSnapshot()` memanggil `studentAccount()`; bila session hilang, komponen menampilkan fallback netral dan tidak membocorkan pesan error mentah.
- Data organisasi boleh dilihat semua anggota login, tetapi **yang ditampilkan di home sengaja dibatasi**: tidak ada `nama` anggota Wajib Kas, `penerima`, `pengirim`, `penanggungJawab`, `rekeningPenampung`, `tautanDokumen`, `rowNumber`, atau rincian `unit` anggaran. Detail tetap di `/home/finance`.
- Badge "Data contoh" wajib tampil bila `kpiSource === "dummy"`.
- Tautan sheet tetap `target="_blank"` dengan `rel="noopener noreferrer"`.

## Design Tokens

- Kartu: `rounded-3xl border border-border bg-card`, tanpa shadow statis; grid 8px (`gap-3`, `gap-4`, `p-5`, `p-6`).
- Warna netral pada angka (`text-text-primary`) dan label (`text-text-secondary`/`text-text-disabled`); hijau `--success` / merah `--danger` **hanya pada ikon** arus kas, sesuai `design-guideline.md`.
- Mode dummy memakai `--warning` pada badge outline.
- Font: sans untuk label, `font-mono` untuk angka dan tanggal; ukuran `subheadline` / `body` / `footnote`.
- Progress realisasi anggaran memakai latar `bg-surface-hover` dan isi `bg-primary` (monokron), bukan warna semantik.

## Testing Checklist

- [x] `/home` menampilkan 4 blok ringkasan di dalam kartu Transparansi Keuangan yang sudah ada (tanpa section baru terpisah).
- [x] Saldo dana dan arus kas menampilkan angka sesuai sheet; KPI arus kas berasal dari `snapshot.totals`, bukan `report.totals`.
- [x] Ringkasan Wajib Kas dan agregat penyerapan anggaran tampil benar.
- [x] Tidak ada blok/daftar transaksi di HTML `/home`, sehingga tanggal transaksi yang tidak valid tidak bisa memicu `RangeError`.
- [x] Footer tetap render (`-` sebagai waktu) bila `updatedAt` tidak valid.
- [x] Tidak ada nama anggota, PIC, penerima/pengirim, rekening, tautan dokumen, atau `rowNumber` yang bocor di HTML `/home`.
- [x] Badge "Data contoh" muncul when `FINANCE_USE_DUMMY_DATA=true`.
- [x] Google Sheets gagal → fallback netral "Ringkasan belum tersedia" + CTA, halaman home tidak 500.
- [x] Suspense skeleton tampil saat data finance masih dimuat; acara/berita tetap terender.
- [x] Tautan laporan eksternal tetap membuka tab baru dan CTA tidak berubah.
- [x] Aksesibilitas: ikon `aria-hidden`, angka bisa dibaca, status tidak hanya mengandalkan warna.
- [x] Verifikasi wajib: `pnpm exec vitest run`, `pnpm lint`, `pnpm build` lolos.
