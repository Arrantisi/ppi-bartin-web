# Link Profil Anggota — Plan

status: planned

## Overview

Setiap anggota PPI mendapat satu alamat web sendiri, contoh `ppibartin.com/link/zidny`. Alamat ini bisa dibagikan ke teman atau orang luar PPI. Siapa pun yang membukanya langsung melihat kartu identitas anggota (foto, nama, jurusan, angkatan, bio singkat) plus tombol-tombol ke Instagram / WhatsApp / GitHub / dll.

Masalah yang diselesaikan: anggota tidak perlu mengirim banyak tautan satu-satu — cukup satu link profil. Tombol di halaman profile memberi tahu anggota bahwa halaman ini ada dan memungkinkan menyalin alamatnya untuk dibagikan.

Keputusan yang sudah disetujui user:
- Fitur berupa halaman publik `/link/[slug]`, bukan sekadar tombol salin link
- Isi halaman: data profil otomatis + tautan sosial opsional
- Tombol ditaruh di profile page dan tab Pengaturan grup "Lainnya"

### Hasil riset data production (19 Nov 2026)

| Pemeriksaan | Hasil | Keputusan |
|---|---|---|
| Total user | 90 | — |
| Punya username | 78 | — |
| Tanpa username | 12 | Perlu fallback slug |
| Duplikat username | 0 | — |
| Huruf kapital | 48 | Tidak boleh pakai raw username sebagai URL |
| Spasi / titik / aksenta / trailing space | 10 | Tidak boleh pakai raw username sebagai URL |
| Slug hasil normalisasi | 0 tabrakan, 0 kosong | Normalisasi aman |

Contoh username bermasalah: `QUBE.`, `Ulwan Khairi`, `Svârtalfr`, `Ratu ` (trailing space), `sabila.hcp`.

**Kesimpulan:** jangan menjadikan `username` sebagai `@unique` dan jangan dipakai langsung sebagai URL. Tambahkan field `linkSlug` terpisah yang URL-safe.

---

## Database Model (Prisma)

Perubahan pada `model User` (field existing tidak diubah):

```prisma
linkSlug      String?  // → String @unique setelah backfill
linkShowEmail Boolean  @default(false)
linkShowPhone Boolean  @default(false)
profileLinks  ProfileLink[]
```

Model baru:

```prisma
model ProfileLink {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label     String
  url       String
  icon      String
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, order])
  @@map("profileLink")
}
```

### Urutan migrasi (wajib berurutan)

1. Tambah `linkSlug String?` (nullable sementara), `linkShowEmail`, `linkShowPhone`, dan tabel `ProfileLink`
2. Buat `scripts/backfill-link-slug.ts` dan jalankan sekali:
   - `username.normalize("NFKD").replace(/\p{Diacritic}/gu, "")`
   - lowercase → `trim()` → ganti `[^a-z0-9]+` dengan `-` → trim `-` → collapse `--`
   - fallback untuk 12 user tanpa username: `user-${id.slice(0, 8)}`
   - bila tetap terjadi tabrakan: tambah suffix `-2`, `-3`, dst.
3. Ubah skema menjadi `linkSlug String @unique`
4. `pnpm prisma generate`

Catatan: tidak ada DDL langsung ke database production tanpa persetujuan eksplisit. Migrasi dibuat sebagai file di `prisma/migrations/` dan di-review dulu.

---

## Server Actions

| Action  | Path                     | Input                  | Output                        | Auth  |
| ------- | ------------------------ | ---------------------- | ----------------------------- | ----- |
| saveProfileLinks | `server/actions/link.ts` | `LinkInput[]` (maks. 8) | `TServerPrompt<ProfileLink[]>` | owner |
| updateLinkVisibility | `server/actions/link.ts` | `{ showEmail, showPhone }` | `TServerPrompt<void>` | owner |
| regenerateLinkSlug | `server/actions/link.ts` | — | `TServerPrompt<string>` | owner (opsional) |
| getPublicLinkProfile | `server/data/link.ts` | `slug: string` | `TPublicLinkProfile` | publik |

Semua action memakai pola `TServerPrompt<T>` dan memanggil `studentAccount()` di awal.

### Validasi server (Zod, di `schemas/link.ts`)

- `url`: `z.url()` + `refine((v) => new URL(v).protocol === "https:")`
- `label`: `z.string().min(1).max(32)`
- `icon`: enum whitelist — `instagram | whatsapp | github | linkedin | x | youtube | tiktok | website`
- maksimal 8 tautan per user
- slug: `z.string().regex(/^[a-z0-9-]+$/).max(40)`

### DTO publik (`TPublicLinkProfile`)

Boleh keluar: `name`, `image`, `username`, `bio`, `jurusan`, `fakultas`, `angkatan`, `linkSlug`, `email` (hanya kalau `linkShowEmail`), `noTelephone` (hanya kalau `linkShowPhone`), `profileLinks` yang `isActive: true`.

Dilarang keluar: `nomorSiswa`, `alamat`, `tanggalLahir`, `role`, `id`, `emailVerified`, data session/account.

---

## Client Components

Semua di `features/link/`:

| File | Fungsi |
|---|---|
| `link-profile-page.tsx` | Shell halaman publik |
| `link-card.tsx` | Kartu identitas + avatar + bio |
| `link-item.tsx` | Baris tautan dengan icon |
| `link-manager.tsx` | Form CRUD tautan di `/home/profile/link` |
| `copy-link-button.tsx` | Salin URL + toast sukses |

Hooks, types, dan utils milik fitur ini tetap taruh di root (`hooks/`, `types/`, `utils/`) sesuai `AGENTS.md §4`.

### Tombol di halaman profile — tanpa komponen baru

Pakai `ClickRow` yang sudah ada di `features/account/profile/tab-pengaturan.tsx:67`:

- `tab-pengaturan.tsx` grup **"Lainnya"** (`:197`) → `ClickRow` "Halaman link saya", ikon `IconLink`, `href="/home/profile/link"`
- `tab-profil.tsx` card **"Pengaturan Cepat"** (`:120`) → baris "Lihat halaman link" + tombol salin

---

## Routes

| URL | Akses | Layout |
|---|---|---|
| `/link/[slug]` | publik, tanpa login | root layout (tanpa sidebar) |
| `/link` | redirect ke `/link/[slug]` sendiri kalau login; kalau tidak, halaman info singkat | root layout |
| `/home/profile/link` | owner (login) | `HomeLayoutComponent` |

Halaman publik tidak boleh memanggil `headers()`/`auth()` — itu akan memaksa dynamic rendering. Gunakan `safeDb` untuk query publik sesuai aturan `docs/file-placement.md`. Jangan tambahkan `generateStaticParams`/`revalidate` di route ini tanpa menyesuaikan (pelajaran dari insiden P0.4 di `docs/maintenance-plan.md`).

---

## Security

- Owner check `userId === session.user.id` di awal `saveProfileLinks`, `updateLinkVisibility`, `regenerateLinkSlug`
- Halaman publik hanya mengembalikan DTO whitelist di atas — bukan row Prisma mentah
- Email & telepon default tersembunyi; hanya keluar kalau pemilik mengaktifkan toggle
- `icon` dari enum, bukan string bebas → mencegah XSS lewat atribut
- URL harus HTTPS → mencegah scheme `javascript:`
- Tautan dengan `isActive: false` tidak ditampilkan di publik
- Tidak ada role khusus; ADMIN/PENGURUS tidak mendapat akses tambahan karena datanya publik

---

## Design Tokens

CSS variables saja, tidak ada hardcode hex/rgb:
`--card`, `--border`, `--surface-hover`, `--text-primary`, `--text-secondary`, `--text-disabled`, `--primary`, `--danger`, `--success`.

- Container kartu: `rounded-xl border border-border bg-card`
- Avatar: `rounded-full`
- Spacing: grid 8px
- Font: Inter (teks), JetBrains Mono (slug/URL)
- Icon: `@tabler/icons-react` (satu library konsisten dengan codebase)
- Status badge: outline, tanpa fill, tanpa shadow di elemen statis

---

## Testing Checklist

- [ ] Happy path: buka `/link/[slug]` muncul foto, nama, jurusan, angkatan, bio, dan tautan aktif
- [ ] Happy path: klik tombol salin → URL tersalin, toast muncul
- [ ] Unauthorized: `/home/profile/link` redirect ke login bila belum login
- [ ] Input invalid: URL `http://` ditolak, lebih dari 8 tautan ditolak, pesan error muncul
- [ ] Empty state: user tanpa tautan tetap melihat kartu + pesan "Belum ada tautan"
- [ ] Privasi: email & telepon tidak muncul saat toggle off, muncul saat toggle on
- [ ] Slug: 12 user tanpa username tetap punya slug fallback yang bisa dibuka
- [ ] Slug: regenerate tidak menimpa slug user lain
- [ ] Tautan nonaktif tidak tampil di halaman publik
- [ ] Tidak ada field sensitif di response (cek Network tab)
- [ ] `pnpm lint` lolos
- [ ] `pnpm build` lolos

---

## Catatan

Plan ini dibuat lebih dulu sesuai `AGENTS.md §1`. Belum ada kode yang ditulis. Saat implementasi dimulai, tandai bagian atas dengan `status: done` setelah semua checklist lolos, dan update `docs/file-placement.md` bila ada struktur direktori baru.
