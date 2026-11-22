# Home Desktop Layout — Plan

status: done

## Overview

Portal `/home` desktop saat ini memakai `DesktopSidebar` + `SidebarInset` dengan konten `max-w-4xl`, sehingga tampilannya hampir identik dengan `DashboardLayout` (admin). Fitur ini mengganti navigasi desktop/tablet dengan topbar horizontal sticky dan menyusun ulang konten beranda menjadi grid "bento" yang lebih modern, tanpa mengubah bottom nav mobile.

Keputusan scope:
- Berlaku untuk seluruh `/home/*` karena `HomeLayoutComponent` dipakai bersama.
- Mobile (< `md`) tetap memakai `BottomNav` yang sudah ada.
- `HomeLayoutComponent` juga dipakai `(public)/layout.tsx` untuk user login, jadi topbar ikut muncul di `/berita` dan `/acara` publik saat session aktif — disepakati untuk konsistensi.

## Changelog

### 2026-11-22 — Kapsul nav melayang

- `components/shared/navigation/nav-main-event.tsx`: border-b header dihilangkan; background jadi `bg-bg/60 backdrop-blur-md`.
- Logo kiri dan notifikasi/profil kanan jadi elemen polos tanpa border/kartu; teks logo & nama profil hanya tampil di `lg` untuk menghindari tabrakan di `md`.
- 4 menu utama dibungkus kapsul `absolute left-1/2` dengan `bg-surface/90 backdrop-blur-lg` + `shadow-lg shadow-black/5`; active pill memakai `bg-surface-active` + `border-border`.
- Container topbar sekarang `w-full px-4 md:px-6` tanpa `max-w-6xl`, menghilangkan margin samping yang sebelumnya membuat nav terasa sempit.

## Database Model (Prisma)

Tidak ada perubahan schema. `useProfileUser()` sudah menyediakan nama/avatar untuk topbar.

## Server Actions

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| —       | —                   | —             | —                | —       |

Tidak ada server action baru. Semua data masih berasal dari query yang sudah ada.

## Client Components

| File | Perubahan |
| ---- | --------- |
| `components/shared/navigation/nav-main-event.tsx` | `DesktopSidebar` diganti `HomeTopbar`: logo kiri, 4 link tengah dengan active pill `layoutId`, notifikasi + avatar kanan. `BottomNav` tetap. |
| `components/layout/home-layout.tsx` | Lepas `SidebarProvider`/`SidebarInset`; render `NavMainEvent` sekali + `motion.main` dengan container konten desktop `max-w-6xl` (topbar sendiri full width). |
| `features/home/header.tsx` | Berubah jadi hero greeting card (nama, sapaan, tanggal, akses cepat). Avatar & notifikasi dipindah ke topbar. |
| `features/home/content.tsx` | Grid 12 kolom di `lg`: keuangan full, acara ~7, berita ~5. |
| `features/home/finance-shortcut.tsx` | Disesuaikan jadi kartu ringkas di grid. |
| `features/home/events/acara-mendatang.tsx` | Section header seragam dengan ikon + link panah. |
| `features/home/news/berita-terbaru.tsx` | Section header seragam, buang padding mobile lama. |
| `features/home/events/render-event.tsx` | Carousel menyesuaikan kolom (1 slide per kolom di desktop). |
| `features/home/news/render-news.tsx` | Daftar berita 1 kolom di dalam kolom sempit, 4 item. |

## Routes

| URL | Akses | Layout |
| --- | ----- | ------ |
| /home/* (protected) | student | HomeLayoutComponent (topbar di desktop) |
| /berita, /acara (public, login) | student | HomeLayoutComponent (topbar di desktop) |

## Security

- Tidak ada jalur data baru. Topbar hanya memakai `useProfileUser()` yang sudah tunduk pada proteksi query existing.
- Link Panel Admin tetap tidak ditampilkan di navbar; aksesnya lewat Profil → Pengaturan dan role gate di `/dashboard` tidak berubah.
- Tidak ada data sensitif baru yang dikirim ke client.

## Design Tokens

- Header `bg-bg/60 backdrop-blur-md` tanpa border; kapsul menu `bg-surface/90 backdrop-blur-lg`, `border-border`, `shadow-lg shadow-black/5`.
- `bg-surface-hover`, `border-border`, `text-text-primary` — active pill & hover.
- `bg-accent-subtle`, `text-accent` — aksen hero/quick action, tanpa hardcode warna.
- `text-text-secondary`, `text-text-disabled` — teks pendukung.
- Spacing 8px grid; radius mengikuti token; tanpa shadow pada elemen statis.
- Ikon `@tabler/icons-react`.

## Testing Checklist

- [ ] Desktop/tablet: topbar sticky tampil, 4 menu sesuai, active state benar
- [ ] Mobile: bottom nav tetap tampil, topbar tidak muncul
- [ ] Klik notifikasi & avatar profil berfungsi / tidak error
- [ ] Hero greeting menampilkan nama + sapaan + tanggal
- [ ] Bento grid: keuangan full, acara & berita proporsional di `lg`
- [ ] Link "Lihat lebih banyak" masih menuju route yang benar
- [ ] User login di `/berita` & `/acara` publik mendapat topbar yang sama
- [ ] Keyboard: link topbar bisa di-Tab, focus ring terlihat, `aria-current` benar
- [ ] `pnpm lint` dan `pnpm build` lolos
