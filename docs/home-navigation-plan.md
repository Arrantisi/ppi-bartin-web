# Home Navigation — Plan

status: done — diperbarui 24 Nov 2026: Keuangan naik jadi menu utama ke-5 di topbar/bottom nav `/home`; baris "Keuangan" di Profil → Pengaturan → Lainnya dihapus.

## Overview

Merapikan navigasi portal `/home`: bottom nav (mobile) dan topbar (desktop/tablet) menampilkan lima menu utama — Beranda, Kegiatan, Berita, **Keuangan**, dan Profil. Topbar menggantikan sidebar desktop yang sebelumnya menyerupai dashboard admin. Keuangan dipromosikan dari Profil → Pengaturan menjadi nav utama karena bukan lagi akses tersembunyi; tautan sheet asli sudah tersedia di header `/home/finance`. Panel Admin tetap tidak dipajang di navbar dan hanya tersedia di Profil → tab **Pengaturan** → grup **Lainnya** (dengan role gate).

Perubahan kedua: daftar Berita dan Acara dibatasi maksimal **10 item per tampilan** (tab kategori berita dihitung per tab) supaya halaman tidak menampilkan seluruh data sekaligus.

## Changelog

### 2026-11-24 — Keuangan jadi nav utama ke-5

- `components/shared/navigation/nav-main-event.tsx`: `navItems` bertambah `{ title: "Keuangan", icon: IconChartBar, url: "/home/finance" }` di antara Berita dan Profil. Satu array yang sama dipakai bottom nav mobile dan topbar desktop, termasuk active state `/home/finance/*`.
- `features/account/profile/tab-pengaturan.tsx`: baris "Keuangan" di grup **Lainnya** dihapus beserta import `IconChartBar`; "Panel Admin" dan "Customer Service" tetap.

### 2026-11-22 — Topbar desktop & bento grid beranda

- `components/shared/navigation/nav-main-event.tsx`: `DesktopSidebar` diganti `HomeTopbar` (sticky, logo kiri, menu dengan active pill `layoutId`, notifikasi + avatar kanan). `BottomNav` mobile tidak berubah. Jumlah menu saat ini lima.
- `components/layout/home-layout.tsx`: lepas `SidebarProvider`/`SidebarInset`, container desktop diperlebar ke `max-w-6xl`.
- `features/home/header.tsx`: jadi hero greeting + akses cepat; avatar/notifikasi pindah ke topbar.
- `features/home/content.tsx` + section acara/berita: susunan bento grid 12 kolom, carousel pakai dots, daftar berita 1 kolom di kolom sempit.
- Karena `HomeLayoutComponent` dipakai juga oleh `(public)/layout.tsx`, topbar desktop ikut muncul di `/berita` dan `/acara` saat user login (disepakati untuk konsistensi).
- Detail: `docs/home-desktop-layout-plan.md`.

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
| `components/shared/navigation/nav-main-event.tsx` | 5 menu (`navItems`: Beranda, Kegiatan, Berita, Keuangan, Profil) dipakai bottom nav mobile + `HomeTopbar` desktop; sidebar desktop dihapus |
| `components/layout/home-layout.tsx` | Tanpa `SidebarProvider`; topbar mobile/desktop dirender sekali, konten desktop `max-w-6xl` |
| `features/home/header.tsx` | Hero greeting + akses cepat; avatar/notifikasi pindah ke topbar |
| `features/home/content.tsx`, `features/home/events/*`, `features/home/news/*` | Bento grid 12 kolom, carousel dots, daftar berita 1 kolom |
| `features/account/profile/tab-pengaturan.tsx` | Baris "Keuangan" dihapus (sudah jadi nav utama); "Panel Admin" (`/dashboard`) tetap tampil untuk ADMIN |
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
| /home/finance | student | HomeLayoutComponent (diakses lewat nav utama "Keuangan") |
| /dashboard | ADMIN | DashboardLayout (diakses lewat Profil → Pengaturan) |
| /berita, /acara | public | Public layout; saat login memakai `HomeLayoutComponent` (topbar desktop) |

## Security

- Navbar tidak lagi menampilkan Panel Admin, tetapi route `/dashboard` tetap dilindungi role gate di layout dashboard — menyembunyikan link bukan menghapus proteksi.
- Link "Panel Admin" di Profil → Pengaturan hanya dirender bila `useCurrentUserRole()` mengembalikan `ADMIN`.
- Route keuangan tetap tunduk pada proteksi layout `(protected)`.
- Tidak ada query/action baru, jadi tidak ada data user tambahan yang terekspos.

## Design Tokens

- Navbar: header `bg-transparent` tanpa blur; kapsul menu `bg-surface/90 backdrop-blur-lg` + `border-border` + `shadow-lg shadow-black/5`; active pill `bg-surface-active` + `text-text-primary` (tidak ada warna baru).
- Hero beranda: `bg-accent-subtle`, `text-accent`, teks `text-text-secondary` — tanpa shadow statis.
- Baris Pengaturan memakai `iconWrap` existing (`bg-surface-hover`, `text-text-primary`).
- Daftar berita/event memakai kartu existing (`bg-surface`, `border-border`).

## Testing Checklist

- [ ] Mobile: bottom nav menampilkan 5 menu — Beranda, Kegiatan, Berita, Keuangan, Profil
- [ ] Desktop/tablet: topbar sticky dengan 5 menu yang sama, active pill mengikuti halaman (termasuk `/home/finance`)
- [ ] Admin: Panel Admin tidak ada di navbar, tapi masih tersedia di Profil → Pengaturan → Lainnya
- [ ] Non-admin: tidak melihat link Panel Admin di Profil
- [ ] Keuangan tersedia sebagai nav utama (mobile + desktop) dan tidak ada lagi di Profil → Pengaturan → Lainnya
- [ ] `/home` desktop: hero + bento grid (keuangan, acara, berita) tampil proporsional
- [ ] `/home/berita` & `/home/acara`: search + pagination 10 item per halaman berfungsi
- [ ] `/berita` dan `/acara` publik saat login mendapat topbar desktop yang sama
- [ ] Rute /dashboard tetap menolak non-admin walaupun link disembunyikan
- [ ] `pnpm lint` dan `pnpm build` lolos
