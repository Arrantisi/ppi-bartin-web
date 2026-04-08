# PPI Bartın Web

Aplikasi web **Perhimpunan Pelajar Indonesia (PPI) Bartın, Turki** — portal untuk mahasiswa Indonesia: autentikasi, profil, acara (events), dan berita.

---

## Daftar isi

1. [Ringkasan](#ringkasan)
2. [Stack teknologi](#stack-teknologi)
3. [Fitur utama](#fitur-utama)
4. [Prasyarat](#prasyarat)
5. [Pemula: Node.js, pnpm, dan npm](#pemula-nodejs-pnpm-dan-npm)
6. [Memulai proyek lokal](#memulai-proyek-lokal)
7. [Variabel lingkungan](#variabel-lingkungan)
8. [Struktur folder](#struktur-folder)
9. [Arsitektur singkat](#arsitektur-singkat)
10. [Database & Prisma](#database--prisma)
11. [Autentikasi](#autentikasi)
12. [Upload file](#upload-file)
13. [Keamanan](#keamanan)
14. [Skrip npm/pnpm](#skrip-npmpnpm)
15. [Build & deployment](#build--deployment)
16. [Lisensi & kontribusi](#lisensi--kontribusi)

---

## Ringkasan

| Item | Keterangan |
|------|------------|
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router) |
| **Bahasa** | TypeScript |
| **UI** | React 19, Tailwind CSS 4, komponen Radix/Base UI |
| **Database** | PostgreSQL via [Prisma](https://www.prisma.io/) 7 |
| **Auth** | [Better Auth](https://www.better-auth.com/) + Google OAuth |
| **State / data** | TanStack Query, server actions & data layer di `server/` |

---

## Stack teknologi

- **Runtime & framework:** Next.js, React Compiler (`next.config.ts`)
- **Styling:** Tailwind CSS 4, `tw-animate-css`, tema gelap/terang (`next-themes`)
- **Form & validasi:** TanStack Form, Zod
- **Animasi:** Motion / Framer Motion
- **Ikon:** Tabler Icons, Phosphor, Lucide
- **Monitoring:** Vercel Speed Insights
- **Storage upload:** UploadThing (gambar acara/berita)
- **Klien Supabase:** `NEXT_PUBLIC_*` (integrasi tambahan sesuai kebutuhan)

---

## Fitur utama

- **Login** dengan Google (Better Auth)
- **Lengkapi profil** — alur redirect jika data siswa (`nomorSiswa`) atau username belum ada
- **Beranda & navigasi** — area `(protected)/home/*` dengan bottom nav
- **Events** — daftar, detail, buat/ubah acara, pendaftaran peserta
- **News** — daftar, detail, kategori, buat/ubah berita
- **Profil pengguna** — lihat & perbarui data
- **PWA ringan** — `manifest.json`, meta apple web app di `app/layout.tsx`
- **Web push notification** — subscribe perangkat via service worker dan kirim notifikasi broadcast dari API

---

## Prasyarat

- **Node.js** (disarankan LTS sesuai Next 16) — lihat [Pemula: Node.js, pnpm, dan npm](#pemula-nodejs-pnpm-dan-npm)
- **pnpm** — wajib untuk repo ini (`package.json` memakai `only-allow pnpm`)
- **PostgreSQL** — untuk database aplikasi & shadow DB (migrasi Prisma)

---

## Pemula: Node.js, pnpm, dan npm

Bagian ini untuk yang baru pertama kali menyetup lingkungan. **Di proyek ini, perintah yang dipakai adalah `pnpm`**, bukan `npm`/`yarn`.

### 1. Pasang Node.js

Node.js menyertakan runtime JavaScript dan **npm** (package manager bawaan).

1. Unduh installer **LTS** dari [https://nodejs.org](https://nodejs.org), atau pakai version manager seperti [nvm](https://github.com/nvm-sh/nvm) / [fnm](https://github.com/Schniz/fnm) jika Anda terbiasa dengan banyak versi Node.
2. Setelah terpasang, buka terminal dan cek:

   ```bash
   node -v
   npm -v
   ```

   Jika angka versi muncul, Node dan npm sudah siap.

### 2. Apa bedanya npm dan pnpm?

| | **npm** | **pnpm** |
|---|---------|----------|
| Asal | Ikut terpasang bersama Node.js | Harus dipasang tambahan |
| Fungsi | Menginstall dependency dari `package.json` | Sama — mengelola dependency proyek |
| Proyek ini | **Tidak dipakai untuk `install`** (akan diblokir) | **Wajib** untuk install & skrip |

**pnpm** umumnya lebih hemat disk (hard link) dan cepat; tim memilih satu package manager agar `lockfile` (`pnpm-lock.yaml`) konsisten.

### 3. Pasang pnpm

Pilih **salah satu** cara:

**A — lewat Corepack (disarankan, sudah ada di Node modern)**

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

**B — lewat npm (sekali pakai npm untuk memasang pnpm secara global)**

```bash
npm install -g pnpm
```

Cek versi:

```bash
pnpm -v
```

### 4. Di repo ini: selalu `pnpm`, bukan `npm install`

Di `package.json` ada skrip `preinstall` yang memakai `only-allow pnpm`. Artinya:

- Jalankan **`pnpm install`** untuk mengunduh dependency.
- Jika Anda menjalankan **`npm install`**, instalasi akan **gagal** dengan pesan yang meminta memakai pnpm — itu disengaja agar lockfile tidak tertukar.

### 5. Setara perintah (jika Anda biasa pakai npm)

| Kebiasaan npm | Setara pnpm di proyek ini |
|---------------|---------------------------|
| `npm install` | `pnpm install` |
| `npm run dev` | `pnpm dev` |
| `npm run build` | `pnpm build` |
| `npx prisma migrate dev` | `pnpm exec prisma migrate dev` |
| `npx some-package` | `pnpm dlx some-package` (setara unduh-sekali-jalankan) |

Setelah pnpm terpasang, lanjut ke [Memulai proyek lokal](#memulai-proyek-lokal).

---

## Memulai proyek lokal

```bash
git clone <url-repo-anda>
cd ppi-bartin-web
pnpm install
```

1. Salin template environment dan isi variabel (lihat [Variabel lingkungan](#variabel-lingkungan)):

   ```bash
   cp .env.example .env.local
   ```

2. Sinkronkan skema ke PostgreSQL (pilih salah satu):

   **Opsi A — `db push` (praktis untuk lokal / eksperimen)**  
   Tanpa membuat file migrasi; skema langsung disamakan dengan `schema.prisma`.

   ```bash
   pnpm exec prisma db push
   ```

   **Opsi B — `migrate dev` (disarankan jika pakai riwayat migrasi)**  
   Membuat migrasi di `prisma/migrations` dan menerapkannya. Pastikan `SHADOW_DATABASE_URL` di `.env.local` sudah benar (dipakai Prisma untuk shadow DB).

   ```bash
   pnpm exec prisma migrate dev
   ```

   Setelah salah satu opsi di atas, klien Prisma sudah bisa dipakai (`pnpm install` juga menjalankan `prisma generate` lewat `postinstall`).

3. Jalankan pengembangan:

   ```bash
   pnpm dev
   ```

   Buka [http://localhost:3000](http://localhost:3000).

---

## Variabel lingkungan

Validasi runtime memakai `@t3-oss/env-core` di `lib/env.ts`. Pastikan nilai berikut terisi:

### Server

| Variabel | Keterangan |
|----------|------------|
| `DATABASE_URL` | URL koneksi PostgreSQL (Prisma) |
| `SHADOW_DATABASE_URL` | DB shadow untuk migrasi Prisma |
| `BETTER_AUTH_URL` | URL publik aplikasi (mis. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Secret acak untuk sesi Better Auth |
| `GOOGLE_CLIENT_ID` | Client ID OAuth Google |
| `GOOGLE_CLIENT_SECRET` | Client Secret OAuth Google |
| `UPLOADTHING_TOKEN` | Token UploadThing untuk upload file |
| `VAPID_PRIVATE_KEY` | Kunci privat VAPID untuk mengirim web push notification |

### Client (`NEXT_PUBLIC_*`)

| Variabel | Keterangan |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kunci anonim Supabase |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Kunci publik VAPID untuk subscribe push di browser |

> **Catatan:** Jangan commit file `.env` berisi secret. Gunakan `.env.example` di repo (boleh ditambahkan tim) sebagai template tanpa nilai sensitif.

---

## Struktur folder

Ringkasan hierarki penting (bukan semua file):

```
ppi-bartin-web/
├── .env.example               # Template variabel lingkungan (aman di-commit)
├── app/
│   ├── layout.tsx                 # Root: font, tema, provider, PWA meta
│   ├── loading.tsx              # UI loading global route
│   ├── globals.css              # Design tokens & gaya global
│   ├── login/                   # Halaman login
│   ├── complite-profile/        # Lengkapi profil (redirect dari protected)
│   ├── (protected)/             # Layout: auth + cek nomor siswa
│   │   ├── layout.tsx
│   │   ├── home/                # Beranda, events, news, profile
│   │   └── dashboard/           # Dashboard (jika dipakai)
│   └── api/
│       ├── auth/[...all]/       # Handler Better Auth
│       ├── uploadthing/         # Router UploadThing
│       ├── subscribe/           # Simpan/update push subscription browser
│       └── send-notification/   # Endpoint kirim web push broadcast
├── components/                  # UI: cards, event, news, ui/, dll.
├── hooks/                       # use-events, use-news, use-users, ...
├── lib/
│   ├── auth.ts                  # Konfigurasi server Better Auth
│   ├── auth-client.ts           # Klien auth
│   ├── env.ts                   # Validasi env
│   ├── notifications.ts         # Helper registrasi service worker + push subscription
│   ├── send-push.ts             # Util server untuk kirim push ke seluruh subscriber
│   └── generated/prisma/        # Output Prisma client (generate)
├── prisma/
│   └── schema.prisma            # Skema PostgreSQL
├── public/                      # Asset statis, manifest, logo
├── server/
│   ├── actions/                 # Server actions (acara, news, user, ...)
│   └── data/                    # Query/fetch data untuk RSC & hooks
├── utils/                       # Helper (format tanggal, image URL, dll.)
├── next.config.ts
├── package.json
├── tsconfig.json                # Alias `@/*` → root proyek
└── README.md
```

---

## Arsitektur singkat

1. **Routing** — File-based routing Next.js; grup `(protected)` membungkus halaman yang membutuhkan sesi.
2. **Protected layout** — Memanggil `auth.api.getSession`, redirect ke `/login` atau `/complite-profile` jika syarat profil belum terpenuhi (`app/(protected)/layout.tsx`).
3. **Data** — Pola umum: `server/data/*` untuk fungsi akses data; `server/actions/*` untuk mutasi; hook TanStack Query di `hooks/*` untuk klien.
4. **Path alias** — Import dengan `@/...` mengacu ke root repository (`tsconfig.json`).

---

## Database & Prisma

- **Provider:** PostgreSQL  
- **Client output:** `lib/generated/prisma` (sesuai `schema.prisma`)

### `db push` vs `migrate`

| | **`prisma db push`** | **`prisma migrate dev`** |
|---|----------------------|---------------------------|
| **Fungsi** | Mendorong perubahan skema langsung ke DB | Membuat file migrasi + menerapkan ke DB |
| **Folder `migrations/`** | Tidak menambah file migrasi | Menambah/mengubah migrasi versi |
| **Kapan dipakai** | Dev cepat, prototipe, sinkron lokal | Tim ingin riwayat migrasi & deploy terkontrol |
| **Shadow DB** | Tidak wajib untuk push | `migrate dev` membutuhkan `SHADOW_DATABASE_URL` |

**Setelah mengubah `schema.prisma`:**

```bash
# Cepat — tanpa file migrasi baru
pnpm exec prisma db push

# Atau — buat migrasi + terapkan (nama migrasi opsional)
pnpm exec prisma migrate dev --name deskripsi_perubahan
```

Regenerasi klien (jika perlu manual):

```bash
pnpm exec prisma generate
```

**Produksi / CI** — biasanya memakai migrasi yang sudah ada di repo:

```bash
pnpm exec prisma migrate deploy
```

### Model utama

- **User** — profil, relasi ke `Events`, `News`, `Participants`, `Account`, `Session`
- **Events** — acara; **Participants** — many-to-many user–event
- **News** — berita dengan slug unik
- **dataSiswa** — referensi data siswa (id unik)
- **Verification** — alur verifikasi Better Auth
- **NotificationSubscription** — menyimpan endpoint + key (`auth`, `p256dh`) untuk web push

### Web push notification

Alur fitur notifikasi yang saat ini terpasang:

1. Browser mendaftarkan service worker (`public/sw.js`) dan membuat subscription dengan kunci `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
2. Subscription dikirim ke `POST /api/subscribe` untuk di-upsert ke tabel `NotificationSubscription`.
3. Endpoint `POST /api/send-notification` (atau util server `lib/send-push.ts`) mengambil semua subscription dan mengirim push secara paralel.
4. Subscription invalid (status 404/410) dibersihkan otomatis dari database.

---

## Autentikasi

- **Better Auth** menangani sesi; route API di `app/api/auth/[...all]/route.ts`.
- **Google** sebagai penyedia OAuth — kredensial dari env `GOOGLE_*`.
- Sesi dan akun tersimpan sesuai model Prisma (`Session`, `Account`).

Untuk detail implementasi, baca `lib/auth.ts` dan dokumentasi [Better Auth](https://www.better-auth.com/docs).

---

## Upload file

- **UploadThing** — konfigurasi di `app/api/uploadthing/` (`core.ts`, `route.ts`).
- Gambar diizinkan dari host yang dikonfigurasi di `next.config.ts` (`images.remotePatterns`), mis. `utfs.io`, `lh3.googleusercontent.com`, `d9i7wgmc1q.ufs.sh`.

---

## Keamanan

Ringkasan praktik yang relevan dengan codebase ini — bukan pengganti audit keamanan formal.

### Rahasia & konfigurasi

- **Jangan commit** file `.env`, `.env.local`, atau kredensial ke repositori. Gunakan `.env.example` hanya sebagai nama variabel tanpa nilai sensitif.
- **`BETTER_AUTH_SECRET`** harus panjang dan acak (mis. `openssl rand -base64 32`). Ganti jika pernah bocor; secret lemah berarti risiko pemalsuan sesi.
- **`GOOGLE_CLIENT_SECRET`**, **`UPLOADTHING_TOKEN`**, **`DATABASE_URL`**, dan kunci server lainnya hanya boleh ada di **variabel server** / platform hosting, bukan di kode atau di variabel `NEXT_PUBLIC_*`.
- Validasi env di **`lib/env.ts`** membantu mencegah aplikasi jalan dengan konfigurasi kosong atau salah di build/runtime — tetap periksa pesan error saat deploy.

### Variabel `NEXT_PUBLIC_*`

- Nilai dengan prefix ini **terbundel ke bundle klien** dan bisa dibaca siapa saja yang membuka DevTools. Hanya letakkan data yang memang untuk publik (mis. URL Supabase anon, bukan service role key).
- Jangan menaruh secret database, token server, atau kunci privat di nama variabel `NEXT_PUBLIC_*`.

### Autentikasi & sesi

- **Better Auth** menangani sesi di server; route dilindungi memverifikasi sesi di **`app/(protected)/layout.tsx`** (bukan hanya menyembunyikan UI di klien).
- Di **produksi**, layani aplikasi lewat **HTTPS** dan set **`BETTER_AUTH_URL`** ke URL HTTPS canonical (domain final). OAuth Google membutuhkan **Authorized redirect URI** yang cocok dengan konfigurasi Better Auth / Google Cloud Console.
- Putar ulang kredensial OAuth jika client secret pernah terpapar.

### Basis data

- **`DATABASE_URL`** hanya untuk server; koneksi tidak diekspos ke browser.
- Batasi akses PostgreSQL dengan firewall / allowlist IP di lingkungan produksi; gunakan user DB dengan privilege minimal yang dibutuhkan aplikasi.

### Upload & konten

- **UploadThing** memakai token server (`UPLOADTHING_TOKEN`); pastikan aturan upload di `app/api/uploadthing/core.ts` sesuai kebijakan (tipe file, ukuran) dan tinjau dokumentasi UploadThing untuk hardening.
- **`images.remotePatterns`** di `next.config.ts` membatasi sumber gambar Next/Image — jangan membuka pola ke domain yang tidak Anda percaya.

### Dependensi & pemeliharaan

- Jalankan **`pnpm audit`** atau peralatan CI secara berkala; perbarui dependensi untuk patch keamanan.
- Ikuti advisori dari Next.js, React, Prisma, dan Better Auth saat rilis penting.

### Checklist singkat sebelum produksi

- [ ] Semua secret di panel hosting, bukan di repo  
- [ ] `BETTER_AUTH_URL` = URL produksi HTTPS  
- [ ] Redirect URI OAuth Google sudah mencakup domain produksi  
- [ ] Database tidak dapat diakses publik tanpa autentikasi  
- [ ] HTTPS aktif di edge/hosting  

---

## Skrip npm/pnpm

| Perintah | Fungsi |
|----------|--------|
| `pnpm dev` | Server pengembangan Next.js |
| `pnpm build` | Build produksi |
| `pnpm start` | Jalankan hasil build |
| `pnpm lint` | ESLint |
| `pnpm install` | Install + `prisma generate` (postinstall) |

---

## Build & deployment

1. Set semua variabel lingkungan di platform hosting (Vercel, dll.).
2. Pastikan `BETTER_AUTH_URL` mengarah ke domain produksi.
3. Terapkan skema DB di lingkungan produksi: `pnpm exec prisma migrate deploy` (bukan `db push`, kecuali Anda sengaja memakai alur khusus).
4. `pnpm build` harus sukses tanpa error TypeScript/ESLint.

---

## Lisensi & kontribusi

Proyek ini **private** (`"private": true` di `package.json`). Untuk kontribusi internal: buat branch fitur, PR dengan deskripsi jelas, dan ikuti konvensi commit tim.

---

*Dokumen ini menggambarkan struktur dan alur utama pada saat penulisan; sesuaikan jika modul baru ditambahkan.*
