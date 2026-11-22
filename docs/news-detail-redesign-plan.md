# News Detail Redesign — Plan

status: done

## Overview

Redesign halaman detail berita `/berita/[slug]` (dan otomatis `/home/berita/[slug]` karena memakai komponen yang sama) menjadi tampilan editorial yang modern dan elegan. Fokus: menghilangkan nav dobel, memperbaiki hierarki judul/byline/gambar, typography artikel yang nyaman, serta menambahkan 3 berita terkait.

Perubahan topbar: header tidak memakai `backdrop-blur` lagi (`bg-transparent`); efek blur tetap hanya pada kapsul 4 menu utama.

## Database Model (Prisma)

Tidak ada perubahan schema. Berita terkait diambil dari `useNews()` yang sudah ada difilter berdasarkan `catagory` yang sama, dengan fallback ke berita lain bila tidak ada.

## Server Actions

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| —       | —                   | —             | —                | —       |

Tidak ada server action baru. `getNewsBySlug()` dan `getNews()` sudah tersedia.

## Client Components

| File | Perubahan |
| ---- | --------- |
| `features/news/news-detail/index.tsx` | Hapus bar navigasi dobel; susun breadcrumb → eyebrow → judul → byline + share/aksi → hero `aspect-[16/9]` → artikel → CTA publik → berita terkait. |
| `features/news/news-detail/related-news.tsx` | Baru: 3 kartu berita terkait (gambar atas, kategori, judul, tanggal) dari `useNews()`. |
| `components/shared/navigation/nav-main-event.tsx` | Header topbar jadi `bg-transparent` tanpa blur; kapsul menu tetap `bg-surface/90 backdrop-blur-lg`. |

## Routes

| URL | Akses | Layout |
| --- | ----- | ------ |
| /berita/[slug] | Public | Public layout (Navbar untuk pengunjung, topbar untuk user login) |
| /home/berita/[slug] | student | HomeLayoutComponent |

## Security

- Tidak ada query/action baru. `useNews()` tetap tunduk pada filter environment berbasis role di `server/data/news.ts`.
- Aksi edit/hapus tetap hanya muncul untuk pemilik (perbandingan `userId` vs `creatorId` di `DrawerOpsi`).
- Sanitasi HTML dengan DOMPurify + linkify dipertahankan persis.

## Design Tokens

- `bg-transparent` — header topbar (tanpa blur).
- `bg-surface/90 backdrop-blur-lg`, `border-border`, `shadow-lg shadow-black/5` — kapsul 4 menu.
- `border-border`, `bg-surface`, `bg-surface-hover` — breadcrumb, byline, kartu terkait, CTA.
- `newsCategoryToneStyles` / `newsCategoryDotStyles` — label kategori (tetap token, bukan hardcode).
- `title-satu`, `subheadline`, `body`, `footnote`, `prose` — tipografi.
- Spacing 8px grid; tanpa shadow pada elemen statis.

## Testing Checklist

- [ ] Pengunjung publik tidak melihat nav dobel; breadcrumb kembali ke `/berita`
- [ ] User login tidak melihat nav dobel; breadcrumb kembali ke `/home/berita`
- [ ] Judul, kategori, tanggal, dan estimasi baca tampil dengan hierarki jelas
- [ ] Hero image `aspect-[16/9]` tidak distort, `alt` memakai judul berita
- [ ] Artikel tetap sanitized, tautan dibuka di tab baru
- [ ] Tombol share & salin link berfungsi
- [ ] Aksi edit/hapus hanya muncul untuk penulis
- [ ] 3 berita terkait tampil, tidak menyertakan artikel saat ini
- [ ] CTA login publik tetap tampil
- [ ] Topbar transparan, kapsul menu tetap blur
- [ ] `pnpm lint` dan `pnpm build` lolos
