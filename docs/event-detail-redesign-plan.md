# Event Detail Redesign — Plan

status: done

## Overview

Redesign halaman detail acara `/acara/[eventSlug]` (dan otomatis `/home/acara/[eventSlug]` karena memakai komponen yang sama) mengikuti arah editorial clean pada detail berita: nav dobel dihapus, hierarki konten dirapikan, info acara dikelompokkan dalam fact strip, serta ditambahkan 3 acara terkait.

Perbaikan perilaku yang ikut disertakan: logika gating saat ini terbalik dari komentar kodenya — peserta yang **sudah daftar** justru link lokasinya disensor dan artikelnya ditutup overlay, sementara yang **belum daftar** bisa mengakses. Setelah redesign: peserta terdaftar melihat link lokasi + artikel penuh; user login yang belum daftar melihat link disensor + overlay CTA daftar; pengunjung publik tetap melihat pesan "Masuk untuk melihat lokasi" dan CTA login.

## Database Model (Prisma)

Tidak ada perubahan schema. Acara terkait diambil dari `useEvents()` yang sudah ada, diurutkan: acara mendatang lebih dulu, lalu terdekat, maksimal 3, tanpa acara saat ini.

## Server Actions

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| —       | —                   | —             | —                | —       |

Tidak ada server action baru. `getEventBySlug()` dan `getAllEvents()` sudah tersedia, termasuk filter environment berbasis role.

## Client Components

| File | Perubahan |
| ---- | --------- |
| `features/events/acara/event-detail/index.tsx` | Hapus bar navigasi dobel; breadcrumb → eyebrow/status → judul → byline + share/aksi → hero `aspect-[16/9]` → fact strip (tanggal, lokasi, kuota, deadline) → peserta → artikel → CTA pendaftaran/login → acara terkait. Perbaiki gating konten. |
| `features/events/acara/event-detail/related-events.tsx` | Baru: 3 kartu acara terkait (gambar atas, judul, tanggal) dari `useEvents()`. |
| `components/shared/navigation/nav-main-event.tsx` | Tidak diubah; topbar sudah transparan dari redesign detail berita. |

Fungsi existing tetap dipertahankan: sanitasi DOMPurify + linkify, dialog perbesar gambar, dialog daftar peserta, `EventActionButton`, `DrawerOpsi` (edit/hapus hanya untuk pemilik), dan `AlertDEelete`.

## Routes

| URL | Akses | Layout |
| --- | ----- | ------ |
| /acara/[eventSlug] | Public | Public layout (Navbar untuk pengunjung, topbar untuk user login) |
| /home/acara/[eventSlug] | student | HomeLayoutComponent |

## Security

- Tidak ada query/action baru; `getAllEvents()` / `getEventBySlug()` tetap memakai `getEnvironmentFilter()` berbasis role.
- Gating diperbaiki: tautan lokasi dan artikel hanya bisa diklik oleh peserta terdaftar; overlay penjaga mencegah klik tidak sengaja pada user login yang belum daftar.
- Aksi edit/hapus tetap dibatasi pemilik oleh `DrawerOpsi` (`userId === creatorId`); redirect hapus mengarah ke `/home/acara` untuk user login.
- Sanitasi HTML dengan DOMPurify + linkify dipertahankan persis, dengan `target="_blank"` + `rel="noopener noreferrer"`.

## Design Tokens

- `border-border`, `bg-surface`, `bg-background` — fact strip, kartu terkait, CTA.
- `text-danger`, `text-warning`, `text-text-disabled` + titik status — status deadline (warna bukan satu-satunya indikator).
- `title-satu`, `subheadline`, `body`, `footnote`, `prose` — tipografi.
- Spacing 8px grid; tanpa shadow pada elemen statis; ikon `@tabler/icons-react`.

## Testing Checklist

- [ ] Pengunjung publik tidak melihat nav dobel; breadcrumb kembali ke `/acara`
- [ ] User login tidak melihat nav dobel; breadcrumb kembali ke `/home/acara`
- [ ] Judul, status deadline, tanggal, lokasi, kuota, dan penulis tampil dengan hierarki jelas
- [ ] Hero image `aspect-[16/9]` tidak distort, `alt` memakai judul acara, tombol perbesar berfungsi
- [ ] **Peserta terdaftar**: link lokasi aktif dan artikel bisa diklik tanpa overlay
- [ ] **User login belum daftar**: link lokasi disensor, overlay mengarah ke tombol daftar
- [ ] **Publik**: lokasi menampilkan pesan masuk, CTA login tampil
- [ ] Dialog daftar peserta tetap berfungsi
- [ ] `EventActionButton` (daftar/batalkan/berakhir/penuh) tetap berfungsi
- [ ] Share & aksi edit/hapus hanya muncul sesuai hak akses
- [ ] 3 acara terkait tampil, tidak menyertakan acara saat ini
- [ ] `pnpm lint` dan `pnpm build` lolos
