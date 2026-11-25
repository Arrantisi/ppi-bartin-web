> status: done — diimplementasikan 24 Nov 2026. Dialog dibatasi tinggi dan bisa di-scroll, footer tombol sticky, form dipadatkan, tanggal memakai shadcn Calendar/Popover. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Form Finance — Seragamkan Design ke shadcn — Plan

## Overview

Seluruh kontrol/form di modul finance sudah memakai primitives shadcn (`Input`, `Textarea`, `Select`, `Button`, `Field`, `Dialog`), tetapi `finance-transaction-form.tsx` masih memiliki penyimpangan pola shadcn Field: `FieldLabel` pada field `Select` tidak punya `htmlFor`, `SelectTrigger` hanya mengandalkan `aria-label`, `FieldError` tidak punya `id` dan tidak dihubungkan dengan `aria-describedby`, status invalid belum diteruskan ke `data-invalid`, error server memakai `<p role="alert">` buatan sendiri, dan belum ada `FieldDescription` maupun pengelompokan section seperti form acara/berita.

Fitur ini merapikan **lapisan tampilan** form transaksi finance agar mengikuti komposisi shadcn `Field` yang sudah dipakai form lain, tanpa mengubah logika `@tanstack/react-form`, Zod schema, server action, atau perilaku penulisan Google Sheets. Toolbar dan filter Wajib Kas sudah shadcn, hanya diselaraskan kecil (search `type="search"` dan ukuran trigger filter).

Keputusan tambahan: `datalist` pada Kategori / Penanggung jawab / Rekening penampung **dipertahankan**. Elemen ini hanya sumber autocomplete native dan tidak memiliki tampilan visual; menggantinya dengan `Select` akan melarang user memasukkan nilai baru yang belum ada di sheet. Input tetap memakai shadcn `Input`.

Koreksi lanjutan: implementasi pertama menambahkan tiga heading section dan lima `FieldDescription` sehingga dialog terlalu panjang. Karena `DialogContent` tidak membatasi tinggi dan body scroll terkunci saat modal, tombol Simpan terkubur dan tidak bisa di-scroll. Perbaikan: `DialogContent` dibatasi `max-h-[calc(100dvh-2rem)]` + `overflow-y-auto`, footer form di-`sticky bottom-0`, heading section dan sebagian deskripsi dihapus agar form lebih pendek, serta field Tanggal diganti dari `<Input type="date">` native ke shadcn `Calendar` + `Popover` lewat komponen baru `finance-date-picker.tsx` (di-`next/dynamic`).

## Database Model (Prisma)

Tidak ada perubahan schema. Field yang dipakai tetap `TCreateFinanceTransaction` / `TUpdateFinanceTransaction` dari `schemas/finance.ts`.

## Server Actions

Tidak ada server action baru dan tidak ada perubahan kontrak.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

## Client Components

- `features/finance/components/finance-transaction-form.tsx`
  - Tambah helper lokal `toErrorList`, `isFieldInvalid`, `describedBy`, dan `FieldMessage` untuk menyatukan konversi error + aksesibilitas.
  - Setiap `Field`: `data-invalid`, `FieldLabel id/htmlFor`, kontrol `id` + `aria-invalid` + `aria-describedby`, `FieldError id`.
  - `SelectTrigger` diberi `id`, `aria-labelledby`, `aria-describedby`, `aria-invalid` (selain `aria-label` yang tetap ada sebagai fallback).
  - Error server memakai `FieldError` dengan `id="finance-server-error"`.
  - Footer aksi memakai `sticky bottom-0 z-10 border-t border-border bg-popover` agar tombol Simpan/Batal selalu terlihat.
  - Field Tanggal memakai `FinanceDatePicker` (bukan `Input type="date"`).
- `features/finance/components/finance-date-picker.tsx` (baru) — trigger `Button variant="outline"` + `Popover` + shadcn `Calendar`, menerima nilai ISO `yyyy-MM-dd`, menampilkan tanggal dengan locale Indonesia, menutup popover setelah memilih.
- `components/ui/dialog.tsx` — `DialogContent` diberi `max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain` supaya dialog panjang bisa di-scroll (berlaku juga untuk dialog lain).
- `features/finance/components/finance-action-dialog.tsx` — tidak ada perubahan struktur; memanfaatkan batas tinggi `DialogContent` yang baru.
- `features/finance/components/finance-wajib-kas.tsx` — `type="search"` pada input cari dan `size="sm"` pada trigger Select agar selaras dengan toolbar.
- `features/finance/components/finance-toolbar.tsx` — tidak diubah; sudah memakai `Input`/`Select` shadcn dengan `aria-label` dan sentinel `"all"`.
- `features/finance/components/finance-action-dialog.tsx`, `finance-delete-dialog.tsx` — tidak diubah; sudah memakai `Dialog`/`Button` shadcn.

Tidak ada file baru di `components/ui/` maupun `features/finance/`.

## Routes

| URL            | Akses                                  | Layout                |
| -------------- | -------------------------------------- | --------------------- |
| /home/finance  | semua anggota login & profil lengkap   | `HomeLayoutComponent` |
| /dashboard/finance | `ADMIN` saja (tidak diubah)       | `AdminManagementShell` |

## Security

- Tidak ada perubahan otorisasi. Role check `BENDAHARA`/`ADMIN` tetap berada di server action.
- Tidak ada data sensitif baru yang tampil. Seluruh pesan error tetap berasal dari schema/server, dibersihkan menjadi teks sebelum dirender.
- `tautanDokumen` tetap divalidasi http(s) oleh Zod di client dan server.

## Design Tokens

- `Field`, `FieldLabel`, `FieldError`, `Input`, `Textarea`, `Select`, `Button`, `Spinner`, `Calendar`, `Popover` — semua dari `components/ui/`.
- `DialogContent`: `max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain`; footer form: `sticky bottom-0 z-10 bg-popover border-t border-border`.
- Error: `FieldError` memakai `text-destructive` (= `--danger` lewat `@theme`), bukan class danger buatan sendiri.
- Form dipadatkan: tanpa heading section; grid 8px (`gap-3`, `gap-4`, `pt-2`).
- Tidak ada hardcode hex/rgb, shadow statis, atau colored button fill baru.

## Testing Checklist

- [x] Dialog panjang bisa di-scroll; tombol Simpan/Batal tetap terlihat lewat footer sticky dan transaksi bisa disubmit.
- [x] Field Tanggal membuka shadcn Calendar lewat Popover; memilih tanggal mengisi ISO `yyyy-MM-dd`; Escape menutup popover.
- [x] Happy path create: semua field terisi, kategori/PIC/rekening bisa dipilih dari saran **atau** diketik manual, submit berhasil.
- [x] Happy path edit: nilai lama tampil di date picker, edit berhasil, `rowNumber` tidak berubah.
- [x] Setiap `FieldLabel` terhubung ke kontrol (`htmlFor` ↔ `id`); Select dan date picker juga punya `aria-labelledby`/`aria-describedby`.
- [x] Error validasi: pesan muncul lewat `FieldError` dengan `id`, kontrol dapat `aria-invalid` + `aria-describedby` yang benar.
- [x] Error server: tampil lewat `FieldError` dan tetap tidak menutup dialog.
- [x] Autocomplete native tetap berfungsi untuk nilai baru.
- [x] Filter toolbar & Wajib Kas tetap berfungsi; Select bisa dibuka/dipilih via keyboard.
- [x] Role: `BENDAHARA`/`ADMIN` tetap melihat form; `USER` tidak melihat tombol Tambah.
- [x] Verifikasi wajib: `pnpm exec vitest run`, `pnpm lint`, `pnpm build` lolos.
