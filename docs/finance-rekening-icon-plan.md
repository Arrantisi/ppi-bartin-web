> status: done — diimplementasikan 24 Nov 2026. Kolom `Rekening` menampilkan account token (ikon + kode + label) dengan nilai lengkap di `title`. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Rekening Column Icon Redesign — Plan

## Overview

Kolom `Rekening` di tabel Buku Besar saat ini hanya menampilkan teks polos dari kolom M sheet (`Rekening Iuran Kas Rupiah`, `Rekening Iuran Kas Lira`, `Dana Fundriser`). Redesign ini menggantinya dengan **account token** berupa ikon + kode mata uang/jenis dana + label pendek, supaya bendahara bisa membedakan sumber dana dalam sekilas tanpa membaca seluruh teks. Tidak ada perubahan data atau penulisan ke sheet.

## Database Model (Prisma)

Tidak ada perubahan schema. Field yang dipakai tetap `TFinanceTransaction.rekeningPenampung` (kolom M `BUKU BESAR KEUANGAN`). Nilai asli hasil probe: 125× `Rekening Iuran Kas Rupiah`, 69× `Rekening Iuran Kas Lira`, 2× `Dana Fundriser`.

## Server Actions

Tidak ada server action baru.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

## Client Components

Daftar file yang akan dibuat di `features/finance/`:

- Tidak ada file baru. Ubah `features/finance/components/finance-columns.tsx` pada kolom `rekeningPenampung`.
- Aturan pemetaan (murni, lokal di file yang sama): `rupiah|idr` → `IconBuildingBank` + kode `IDR`; `lira|try` → `IconCurrencyLira` + kode `TRY`; `fundriser|fundraiser|dana` → `IconPigMoney` + kode `DANA`; selain itu → `IconWallet` + kode `REK.`.
- `title`/{@link aria-label} tetap memakai nilai lengkap dari sheet; label yang terpotong tidak menghilangkan informasi.

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| /home/finance | semua anggota login & profil lengkap | `HomeLayoutComponent` |
| /dashboard/finance | `ADMIN` saja (tidak diubah) | `AdminManagementShell` |

## Security

- Ikon hanya turunan string `rekeningPenampung`; tidak ada data baru yang dikirim ke client.
- Tidak mengubah role check: tombol aksi tetap muncul untuk `BENDAHARA`/`ADMIN`, dan server action tetap memvalidasi peran.
- Nilai asli tetap dirender sebagai teks/atribut `title`, sehingga pengguna pembaca layar mendapat informasi yang sama.

## Design Tokens

- Wadah ikon: `bg-surface-hover`, `border-border`, `rounded-lg`, tanpa shadow (sesuai `design-guideline.md`).
- Ikon: `@tabler/icons-react` (`IconBuildingBank`, `IconCurrencyLira`, `IconPigMoney`, `IconWallet`), warna `text-text-secondary` — tidak memakai warna sebagai satu-satunya pembeda.
- Kode `IDR`/`TRY`/`DANA`: `--font-mono`, `text-text-disabled`.
- Label: `body text-text-primary`, `truncate`.
- Spacing: `gap-2` (8px), ukuran ikon tile `size-8`.

## Testing Checklist

- [ ] Happy path: tiga nilai rekening asli menampilkan ikon + kode yang berbeda (`IDR`, `TRY`, `DANA`).
- [ ] Nilai tak dikenal → fallback `IconWallet` + kode `REK.` tanpa crash.
- [ ] Teks lengkap tetap bisa dibaca lewat `title`, label terpotong tidak menghilangkan informasi.
- [ ] Role: tombol Edit/Hapus tidak berubah.
- [ ] Aksibilitas: ikon ber-`aria-hidden`, informasi tersedia sebagai teks.
- [ ] Verifikasi wajib: `pnpm exec vitest run`, `pnpm lint`, `pnpm build` lolos.
