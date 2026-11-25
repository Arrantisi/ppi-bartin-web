> status: done — diimplementasikan 24 Nov 2026. Baris tabel membuka dialog kartu detail; toggle/grid kartu dihapus; urutan terbaru dan badge dokumen tetap aktif. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Buku Besar — Detail Kartu dari Baris Tabel — Plan

## Overview

Tab **Buku Besar** tetap menampilkan tabel transaksi. Koreksi dari implementasi sebelumnya: tidak ada toggle Tabel/Kartu dan tidak ada grid kartu. Ketika **baris tabel diklik** (atau ditekan Enter/Space lewat keyboard), muncul **dialog berisi kartu detail transaksi**. Urutan tetap diurutkan dari **tanggal terbaru** (tie-break nomor baris terbesar), dan kolom Dokumen memakai **badge outline "Ada nota" / "Tanpa nota"**. Sumber data tetap Google Sheets; tidak ada penulisan baru selain CRUD yang sudah ada.

## Database Model (Prisma)

Tidak ada perubahan schema. Field yang dipakai tetap `TFinanceTransaction` (`tanggal`, `rowNumber`, `tautanDokumen`, dll.) dari tab `BUKU BESAR KEUANGAN`.

## Server Actions

Tidak ada server action baru. Role check `BENDAHARA`/`ADMIN` dan validasi Zod tidak berubah.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

## Client Components

File yang dipakai/diubah:

- `finance-data-table.tsx` — hapus state toggle & grid kartu; sorting tanggal descending + `rowNumber` descending; state `detailTransaction`; baris bisa diklik/ditekan untuk membuka dialog; pagination tetap sama.
- `finance-transaction-card.tsx` — dipakai sebagai isi dialog detail (bukan grid). Tombol Edit/Hapus di kartu menutup dialog lalu meneruskan ke callback induk.
- `finance-tokens.tsx` — token bersama: `FinanceArusBadge`, `FinanceMataUangBadge`, `FinanceRekeningToken`, `FinanceDokumenBadge`.
- `finance-columns.tsx` — sel arus, mata uang, rekening, dan dokumen memakai token bersama; tombol aksi dan tautan dokumen menghentikan propagasi klik agar tidak membuka dialog detail.

Komponen dialog memakai `components/ui/dialog.tsx` yang sudah ada, tanpa dependency baru.

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| /home/finance | semua anggota login & profil lengkap | `HomeLayoutComponent` |
| /dashboard/finance | `ADMIN` saja (tidak diubah) | `AdminManagementShell` |

## Security

- Tombol Edit/Hapus pada kartu detail mengikuti `canWrite` yang sama dengan tabel; server action tetap memverifikasi role.
- `tautanDokumen` tetap dibuka di tab baru dengan `rel="noopener noreferrer"`.
- Badge "Tanpa nota" tidak membocorkan URL; badge "Ada nota" hanya menampilkan tautan yang sudah tervalidasi sebagai http(s) oleh parser.

## Design Tokens

- Dialog memakai `DialogContent className="sm:max-w-xl"`, latar `bg-popover`, tanpa perubahan token global.
- Kartu detail: `rounded-2xl border border-border bg-surface p-4`, tanpa shadow.
- Badge dokumen: `Badge variant="outline"` — "Ada nota" memakai `IconFileInvoice` + `IconExternalLink`, "Tanpa nota" memakai `IconFileOff`; teks netral.
- Badge arus tetap memakai `--success`/`--danger` pada ikon saja, sesuai `design-guideline.md`.
- Nomor/tanggal/nominal: `--font-mono`. Spacing grid 8px (`gap-3`, `gap-4`, `p-4`, `pt-4`).

## Testing Checklist

- [x] Happy path: mengklik baris membuka dialog; kartu menampilkan detail transaksi yang sama dengan baris tersebut.
- [x] Keyboard: baris bisa difokuskan, Enter/Space membuka dialog; Escape menutup dialog.
- [x] Klik tombol Edit/Hapus di baris **tidak** membuka dialog detail.
- [x] Klik badge "Ada nota" di baris **tidak** membuka dialog detail, tautan tetap terbuka di tab baru.
- [x] Tombol Edit/Hapus di dalam kartu detail menutup dialog lalu membuka dialog/form yang sesuai.
- [x] Urutan: transaksi tanggal terbaru muncul paling atas; tanggal sama diurutkan dari `rowNumber` terbesar.
- [x] Pagination tetap berfungsi; filter tanpa hasil menampilkan pesan kosong.
- [x] Role: anggota biasa tidak melihat tombol Edit/Hapus di kartu detail; `BENDAHARA`/`ADMIN` melihatnya.
- [x] Verifikasi wajib: `pnpm exec vitest run`, `pnpm lint`, `pnpm build` lolos.
