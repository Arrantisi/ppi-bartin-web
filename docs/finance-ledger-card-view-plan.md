> status: done — diimplementasikan 24 Nov 2026. Toggle Tabel/Kartu, urutan tanggal terbaru, dan badge dokumen aktif di Buku Besar. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Buku Besar — Kartu Transaksi, Urutan Terbaru, Badge Dokumen — Plan

## Overview

Tab **Buku Besar** saat ini hanya menampilkan tabel dengan urutan mengikuti baris sheet (terlama di atas). Fitur ini menambahkan toggle **Tabel / Kartu** agar bendahara bisa memilih tampilan ringkas atau kartu per transaksi, mengurutkan transaksi dari **tanggal terbaru** (tie-break nomor baris terbesar), dan mengganti ikon tautan dokumen dengan **badge outline "Ada nota" / "Tanpa nota"**. Sumber data tetap Google Sheets; tidak ada penulisan baru selain CRUD yang sudah ada.

## Database Model (Prisma)

Tidak ada perubahan schema. Field yang dipakai tetap `TFinanceTransaction` (`tanggal`, `rowNumber`, `tautanDokumen`, dll.) dari tab `BUKU BESAR KEUANGAN`.

## Server Actions

Tidak ada server action baru. Role check `BENDAHARA`/`ADMIN` dan validasi Zod tidak berubah.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

## Client Components

File baru di `features/finance/components/`:

- `finance-tokens.tsx` — komponen tampilan bersama: `FinanceArusBadge`, `FinanceMataUangBadge`, `FinanceRekeningToken`, `FinanceDokumenBadge`. Dipakai ulang oleh tabel dan kartu supaya tidak ada duplikasi pemetaan ikon.
- `finance-transaction-card.tsx` — satu kartu transaksi (content-led): nomor + tanggal, badge arus/mata uang, keterangan, nominal mono, rekening, dokumen, serta tombol Edit/Hapus bila `canWrite`.

File yang diubah:

- `finance-data-table.tsx` — state `view: "tabel" | "kartu"`, segmented control dengan `aria-pressed`, sorting `tanggal` descending + `rowNumber` descending, pagination dipakai bersama kedua view.
- `finance-columns.tsx` — sel arus, mata uang, rekening, dan dokumen memakai komponen token bersama.
- `components/skeletons/finance-skeleton.tsx` — tidak diubah (toggle berada di dalam panel yang sudah termuat).

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| /home/finance | semua anggota login & profil lengkap | `HomeLayoutComponent` |
| /dashboard/finance | `ADMIN` saja (tidak diubah) | `AdminManagementShell` |

## Security

- Tombol Edit/Hapus pada kartu mengikuti `canWrite` yang sama dengan tabel; server action tetap memverifikasi role.
- `tautanDokumen` tetap dibuka di tab baru dengan `rel="noopener noreferrer"`.
- Badge "Tanpa nota" tidak membocorkan URL; badge "Ada nota" hanya menampilkan tautan yang sudah tervalidasi sebagai http(s) oleh parser.

## Design Tokens

- Kartu: `rounded-2xl border border-border bg-surface`, hover `bg-surface-hover`, tanpa shadow.
- Badge dokumen: `Badge variant="outline"` — "Ada nota" memakai `IconFileInvoice` + `IconExternalLink`, "Tanpa nota" memakai `IconFileOff`; teks netral (`text-text-primary` / `text-text-disabled`).
- Badge arus tetap memakai `--success`/`--danger` pada ikon saja, sesuai `design-guideline.md`.
- Nomor/tanggal/nominal: `--font-mono`. Spacing grid 8px (`gap-3`, `gap-4`, `p-4`, `pt-4`).
- Segmented control: dua `Button` dengan `aria-pressed`, aktif memakai `variant="secondary"`, nonaktif `variant="ghost"`.

## Testing Checklist

- [x] Happy path: toggle **Tabel / Kartu** berfungsi; state tidak mengubah data atau filter.
- [x] Urutan: transaksi tanggal terbaru muncul paling atas di kedua view; tanggal sama diurutkan dari `rowNumber` terbesar.
- [x] Pagination: halaman kartu memakai pageIndex/pageSize yang sama dengan tabel; reset saat filter menyusut.
- [x] Badge dokumen: transaksi dengan nota menampilkan "Ada nota" dan tautan bisa diklik; tanpa nota menampilkan "Tanpa nota".
- [x] Role: anggota biasa tidak melihat tombol Edit/Hapus di kartu; `BENDAHARA`/`ADMIN` melihatnya.
- [x] Empty state: filter tanpa hasil tetap menampilkan pesan di kedua view.
- [x] Aksibilitas: `aria-pressed` benar, ikon `aria-hidden`, tautan dokumen punya `aria-label`.
- [x] Verifikasi wajib: `pnpm exec vitest run`, `pnpm lint`, `pnpm build` lolos.
