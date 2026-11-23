# News & Events Layout — Plan

status: done

## Overview

Redesign menyeluruh layout halaman daftar dan form create/update untuk berita & acara, di semua breakpoint. Halaman detail **tidak** diubah (sudah didesain ulang terpisah). Tujuannya: konsistensi visual dengan portal home/detail, hierarki konten yang lebih jelas, dan form yang tidak lagi menjadi satu kolom panjang di desktop.

Keputusan scope:
- Daftar: `/home/berita`, `/home/acara`, `/berita`, `/acara`.
- Form: `/home/berita/create`, `/home/berita/update/[slug]`, `/home/acara/create`, `/home/acara/update/[slug]`.
- Form create juga dipakai dashboard (`backHref` berbeda) — perilaku itu dipertahankan.
- Mobile, tablet, dan desktop ikut diperbaiki.

## Database Model (Prisma)

Tidak ada perubahan schema. Semua data masih dari `useNews()`, `useEvents()`, `getNews()`, dan `getAllEvents()`.

## Server Actions

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| —       | —                   | —             | —                | —       |

Tidak ada server action baru. `createNews`/`updateNews`/`createAcara`/`updateAcara` tetap dipakai apa adanya.

## Client Components

| File | Perubahan |
| ---- | --------- |
| `components/shared/content-page-header.tsx` | Baru: header editorial bersama (eyebrow, judul, deskripsi, slot aksi) untuk 4 halaman daftar. |
| `components/layout/content-form-shell.tsx` | Baru: shell form 2 kolom di desktop — rail kiri (kembali, judul, deskripsi, tips) + kartu form kanan, action bar melekat di bawah. |
| `components/cards/card-news.tsx` | Tambah `variant="featured"` (gambar atas `aspect-[16/9]`, judul besar); default `compact` tidak berubah. |
| `components/buttons.tsx` | `ButtonCreate` jadi pill berlabel "Buat berita"/"Buat acara" dengan ikon plus. |
| `features/news/header.tsx`, `features/events/acara/header.tsx` | Pakai `ContentPageHeader`. |
| `features/news/berita-catagory.tsx` | Toolbar search + CTA, tab dalam kapsul scrollable, grid 1/2/3 kolom, item pertama `featured` hanya di tab "all" tanpa pencarian. |
| `features/events/acara/content.tsx` | Toolbar search + CTA, grid 1/2/3 kolom, skeleton disesuaikan. |
| `app/(public)/berita/page.tsx`, `app/(public)/acara/page.tsx` | Pakai `ContentPageHeader`, grid responsif, berita pertama `featured`. |
| `components/field/news-form.tsx`, `components/field/event-form.tsx` | Field dikelompokkan jadi section berjudul, grid 2 kolom di desktop untuk field pendukung, action bar bawah, prop `backHref` opsional. Logika/validasi tidak diubah. |
| `features/news/create/*`, `features/news/update/*`, `features/events/acara/create/*`, `features/events/acara/update/*` | Pakai `ContentFormShell`, teruskan `backHref` sampai ke form, hapus margin ad-hoc dan header ganda. |

## Routes

| URL | Akses | Layout |
| --- | ----- | ------ |
| /home/berita, /home/acara | student | HomeLayoutComponent |
| /berita, /acara | public | Public layout |
| /home/berita/create, /home/acara/create | student | HomeLayoutComponent + ContentFormShell |
| /home/berita/update/[slug], /home/acara/update/[slug] | student (owner) | HomeLayoutComponent + ContentFormShell |
| /dashboard/berita/create | ADMIN | Tetap memakai komponen create yang sama dengan `backHref="/dashboard/news"` |

## Security

- Tidak ada jalur data baru; role & environment filter tetap di server actions/data.
- `backHref` hanya dipakai untuk navigasi UI, bukan untuk otorisasi.
- Aksi create/update tetap tunduk pada `studentAccount()` + ownership check di server action.
- Label tombol, focus ring, `aria-label`, dan `aria-current` dipertahankan.

## Design Tokens

- `bg-surface`, `bg-surface-hover`, `bg-surface-active`, `border-border`, `bg-bg` — header, kapsul tab, kartu form.
- `bg-accent-subtle`, `text-accent` — eyebrow dan aksen tip.
- `text-text-primary`, `text-text-secondary`, `text-text-disabled` — hierarki teks.
- `title-satu`, `subheadline`, `body`, `footnote`, `font-mono` — tipografi.
- Spacing 8px grid; tanpa shadow pada elemen statis; ikon `@tabler/icons-react`.

## Testing Checklist

- [ ] Daftar berita & acara: header, search, CTA, grid 1/2/3 kolom tampil rapi di mobile/tablet/desktop
- [ ] Tab kategori berita scrollable dengan benar, active state jelas
- [ ] Berita featured hanya muncul di tab "all" tanpa pencarian
- [ ] Pagination 10 item per halaman tetap berfungsi
- [ ] `/berita` & `/acara` publik memakai header yang sama, grid tidak berantakan
- [ ] Form create/update: rail kiri + kartu kanan di desktop; satu kolom di mobile
- [ ] Semua field, validasi, toast, dan redirect create/update tetap berfungsi
- [ ] Tombol Batal di form create mengikuti `backHref` (termasuk dashboard)
- [ ] `pnpm lint` dan `pnpm build` lolos
