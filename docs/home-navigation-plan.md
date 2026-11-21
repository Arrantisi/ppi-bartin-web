# Home Navigation — Plan

status: done

## Overview

Merapikan navigasi portal `/home`: bottom nav (mobile) dan sidebar (desktop) hanya menampilkan empat menu utama — Beranda, Kegiatan, Berita, dan Profil. Menu tambahan seperti Keuangan dan Panel Admin tidak lagi dipajang di navbar, melainkan dikumpulkan di halaman Profil → tab **Pengaturan** → grup **Lainnya**, supaya navbar tetap ringkas dan semua akses tetap ada.

Perubahan kedua: daftar Berita dan Acara dibatasi maksimal **10 item per tampilan** (tab kategori berita dihitung per tab) supaya halaman tidak menampilkan seluruh data sekaligus.

## Database Model (Prisma)

Tidak ada perubahan schema. Hanya perubahan komponen navigasi, profil, dan batas render daftar.

## Server Actions

| Action | Path | Input | Output | Auth |
| ------ | ---- | ----- | ------ | ---- |
| — | — | — | — | — |

Tidak ada server action baru. Link Keuangan/Panel Admin memakai route yang sudah ada.

## Client Components

| File | Perubahan |
| ---- | --------- |
| `components/shared/navigation/nav-main-event.tsx` | Hapus `desktopNavItems` dan `adminNavItem` dari daftar nav; item navbar cukup `navItems` (4 menu) untuk mobile & desktop |
| `features/account/profile/tab-pengaturan.tsx` | Tambah baris "Keuangan" (`/home/finance`) di grup Lainnya; "Panel Admin" (`/dashboard`) tetap tampil untuk ADMIN |
| `features/news/berita-catagory.tsx` | Tiap tab kategori hanya merender 10 berita terbaru |
| `features/events/acara/content.tsx` | Daftar acara `/home/acara` hanya merender 10 acara terbaru |
| `app/(public)/berita/page.tsx` | Daftar berita publik hanya merender 10 berita terbaru |
| `app/(public)/acara/page.tsx` | Daftar acara publik hanya merender 10 acara terbaru |

## Routes

| URL | Akses | Layout |
| --- | ----- | ------ |
| /home | student | HomeLayoutComponent |
| /home/acara | student | HomeLayoutComponent |
| /home/berita | student | HomeLayoutComponent |
| /home/profile | student | HomeLayoutComponent |
| /home/finance | student | HomeLayoutComponent (diakses lewat Profil → Pengaturan) |
| /dashboard | ADMIN | DashboardLayout (diakses lewat Profil → Pengaturan) |
| /berita, /acara | public | Public layout |

## Security

- Navbar tidak lagi menampilkan Panel Admin, tetapi route `/dashboard` tetap dilindungi role gate di layout dashboard — menyembunyikan link bukan menghapus proteksi.
- Link "Panel Admin" di Profil → Pengaturan hanya dirender bila `useCurrentUserRole()` mengembalikan `ADMIN`.
- Route keuangan tetap tunduk pada proteksi layout `(protected)`.
- Tidak ada query/action baru, jadi tidak ada data user tambahan yang terekspos.

## Design Tokens

- Navbar: `bg-surface`, `border-border`, `text-text-disabled`, `text-text-primary` (tidak ada warna baru).
- Baris Pengaturan memakai `iconWrap` existing (`bg-surface-hover`, `text-text-primary`).
- Daftar berita/event memakai kartu existing (`bg-surface`, `border-border`).

## Testing Checklist

- [ ] Mobile & desktop: navbar hanya Beranda, Kegiatan, Berita, Profil
- [ ] Admin: Panel Admin tidak ada di navbar, tapi masih tersedia di Profil → Pengaturan → Lainnya
- [ ] Non-admin: tidak melihat link Panel Admin di Profil
- [ ] Keuangan tersedia di Profil → Pengaturan → Lainnya, tidak ada di navbar
- [ ] `/home/berita`: setiap tab menampilkan maksimal 10 berita
- [ ] `/home/acara`: maksimal 10 acara
- [ ] `/berita` dan `/acara` publik: maksimal 10 item
- [ ] Rute /dashboard tetap menolak non-admin walaupun link disembunyikan
- [ ] `pnpm lint`, `tsc --noEmit`, `vitest run`, `pnpm build` lolos
