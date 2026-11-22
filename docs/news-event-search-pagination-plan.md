# Pencarian & Pagination Berita/Acara — Plan

status: done

## Overview

Di halaman protected `/home/berita` dan `/home/acara`, kolom pill di samping tombol `ButtonCreate` masih berupa `<div>` kosong (placeholder). Fitur ini menggantinya dengan input pencarian yang benar-benar berfungsi, dan menambahkan navigasi halaman di bawah daftar agar berita/acara beyond 10 item tetap bisa diakses.

Data sudah diambil lengkap oleh `useNews()` dan `useEventsPage()` (TanStack Query). Karena itu filtering dan pagination dilakukan di client dengan `useMemo`/`useState` — tidak ada perubahan Prisma, server action, atau `server/data`. Pendekatan ini konsisten dengan filter kategori berita yang sudah ada.

Lingkup:

- `/home/berita`: search + pagination + sinkronisasi dengan tab kategori.
- `/home/acara`: search + pagination (konsekuensi logis agar hasil pencarian lebih dari 10 tetap bisa dilihat).
- Halaman publik `/berita` dan `/acara` tidak diubah.

## Database Model (Prisma)

Tidak ada perubahan schema. Model `News` dan `Event` sudah memiliki field yang dicari:

- `News`: `judul`, `catagory`, `slug`, `desckripsi`, `ringkasan`.
- `Event`: `judul`, `lokasi`, `slug`, `deskripsi`.

## Server Actions

| Action | Path | Input | Output | Auth |
| ------ | ---- | ----- | ------ | ---- |
| — | — | — | — | — |

Tidak ada server action baru. Pencarian hanya membaca data yang sudah ada di cache React Query; tidak menambah endpoint atau query database.

## Client Components

| File | Komponen | Fungsi |
| ---- | -------- | ------ |
| `components/shared/content-search.tsx` | `ContentSearch`, `ContentSearchEmpty` | Input pill dengan ikon + tombol hapus; empty state khusus hasil pencarian |
| `components/shared/content-pagination.tsx` | `ContentPagination` | Navigasi prev/next + nomor + ellipsis, memakai `getPaginationItems()` |
| `hooks/use-client-list.ts` | `useClientList<T>()` | State query + halaman, filter case-insensitive, slice per halaman, reset halaman saat query berubah |
| `features/news/berita-catagory.tsx` | `BeritaCatagory` (edit) | Ganti div placeholder, tab jadi controlled, pagination + empty state |
| `features/events/acara/content.tsx` | `CardAcaras` (edit) | Ganti div placeholder, pagination + empty state |

`searchFields` disediakan sebagai fungsi `getSearchText` di module scope agar referensinya stabil (tidak membuat `useMemo` di header computation terus berubah).

## Routes

| URL | Akses | Layout |
| --- | ----- | ------ |
| /home/berita | student | HomeLayoutComponent |
| /home/acara | student | HomeLayoutComponent |

## Security

- Tidak ada jalur data baru. Data tetap berasal dari `getNews()` / `getAllEvents()` yang sudah menerapkan filter environment berdasarkan role di server (`server/data/news.ts`, `server/data/events.ts`).
- Tidak ada data sensitif baru yang dikirim ke client; field yang dipakai untuk pencarian sudah lebih dulu dikirim untuk rendering kartu.
- Filter hanya berjalan di atas data yang sudah lolos otorisasi server — tidak bisa membuka berita/acara environment lain lewat query string.

## Design Tokens

- `bg-card`, `bg-surface`, `border-border` — container input & kartu empty state.
- `text-text-primary`, `text-text-secondary`, `text-text-disabled` — teks.
- `bg-primary`, `text-primary-foreground` — tombol aktif pagination (lewat `Button` variant `default`).
- `focus-visible:ring-ring/30` — fokus input (sudah ada di `InputGroup`).
- Ikon: `@tabler/icons-react` (`IconSearch`, `IconX`, `IconChevronLeft`, `IconChevronRight`).
- Spacing kelipatan 8px; ukuran input mengikuti placeholder lama (`h-10.5` ≈ 42px).

## Testing Checklist

- [ ] Happy path: mengetik judul/kategori berita → daftar menyaring, halaman kembali ke 1
- [ ] Happy path: mengetik judul/lokasi acara → daftar menyaring
- [ ] pagination: tombol prev/next & nomor berpindah halaman, tombol disable di batas
- [ ] pagination: berubahnya tab kategori mengembalikan halaman ke 1
- [ ] Tombol hapus pencarian mengembalikan daftar lengkap
- [ ] Empty state pencarian muncul dengan CTA "Hapus pencarian" (bedakan dari DataKosong)
- [ ] Empty state DataKosong tetap muncul saat seluruh data kosong
- [ ] Keyboard: input bisa difokus, tombol clear & pagination bisa diakses via Tab/Enter
- [ ] Akses unauthorized → redirect tetap seperti sebelumnya
- [ ] `pnpm lint` dan `pnpm build` lolos
