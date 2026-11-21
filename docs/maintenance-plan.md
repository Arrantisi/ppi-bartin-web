# Maintenance & Health Audit PPI Bartın — Plan

status: p0-done · db-terhubung

> Audit dilakukan 26 Sep 2026, pada commit `1e8e3c4` (branch `dev-preview`, last commit 24 Jun 2026 — **~3 bulan tidak ada commit**).
> Semua temuan di bawah berbasis bukti output command, bukan asumsi.
>
> **P0 selesai 26 Sep 2026** — lihat detail di section "P0 Completion Log" di akhir file.
> **P0.3 (koneksi DB) selesai 28 Sep 2026** — `.env` sudah menunjuk ke DB production
> `jhuazrfwbuimzuaktalb`, drift nol, `pnpm lint` + `pnpm build` lolos. Detail & koreksi di
> section "P0.3 Discovery Log".

---

## Overview

### Pertanyaan: perlu update apa, perlu major update tidak?

**Jawaban: TIDAK perlu major rewrite. Tapi WAJIB ada 3 perbaikan kritis + 4 perbaikan infrastruktur.**

#### Yang sudah sehat (alasan tidak perlu rewrite)

| Aspek | Bukti |
| --- | --- |
| Lint bersih | `pnpm lint` → 0 error |
| TypeScript build | `✓ Compiled successfully in 18.5s` / `Finished TypeScript in 12.9s` (gagal di tahap koneksi DB, bukan di TypeScript) |
| Arsitektur | `TServerPrompt<T>` konsisten, `React.cache()` di `server/actions/account.ts`, TanStack Query untuk client fetch |
| Tidak ada manual fetch | `await fetch(` di client = **0 hasil** |
| Tidak ada debt marker | `TODO/FIXME/HACK/XXX` = **0 hasil** |
| Typing disiplin | `: any` / `as any` hanya **7** di seluruh project |
| Auth coverage | 15 file server action, **42** referensi auth check |
| Codebase wajar | 304 file TS/TSX, 46.9k LOC (termasuk Prisma generated ±35k) |
| Empty state | `DataKosong` dipakai di 9 tempat, sesuai aturan §7 |

Fondasi, arsitektur, dan disiplin kode **sudah benar**. Rewrite besar justru membuang waktu dan menambah risiko regresi.

#### Yang rusak (alasan harus ada update)

Tiga bulan tanpa commit **bukan** karena project selesai dan stabil, tapi karena **tidak ada yang memaksa verifikasi**. `AGENTS.md` §12 mewajibkan `pnpm lint` + `pnpm build`, tapi **tidak ada CI** (§1.3), jadi aturan itu tidak pernah dieksekusi otomatis. Akibatnya 2 security hole lolos ke branch utama tanpa pernah ketahuan.

---

## Priority 0 — KRITIS: Security & Build (kerjakan duluan)

### 0.1 `/api/export/participants` — TIDAK ADA AUTH CHECK SAMA SEKALI

**File:** `app/api/export/participants/route.ts`

**Bukti:**
```bash
$ grep -n "auth\|Account\|role\|session" app/api/export/participants/route.ts
# tidak ada hasil sama sekali
```

Route ini bisa diakses siapa saja (tanpa login) cukup dengan mengetahui `eventId`, lalu men-download CSV berisi **data pribadi peserta**:

| Field yang bocor |
| --- |
| `nama_lengkap` |
| `nomor_öğrenci` (NIM) |
| `email` |
| `jenis_kelamin` |
| `fakultas` |
| `jurusan` |
| `angkatan` |

**Risiko:** `eventId` bertipe `cuid` — bukan rahasia, tapi bisa dikumpulkan dari halaman publik `/acara` dan `/acara/[eventSlug]`. Bot, scraper, atau alumni bisa mengunduh basis data peserta. Melanggar `AGENTS.md` §8.

**Fix:**
1. Tambahkan `studentAccount()` + `getCurrentUserRole()` check
2. Validasi `eventId` dengan Zod (`z.cuid()`)
3. **Ownership/role check:** hanya `ADMIN`/`PENGURUS` pemilik event (`event.createdById === session.user.id`) atau role `ADMIN` global yang boleh export
4. Return **403** kalau tidak berhak — jangan diam-diam return data kosong
5. Tambahkan `Cache-Control: no-store` supaya tidak ter-cache CDN

---

### 0.2 `deleteUploadedFile` — Server action TANPA auth & tanpa validasi

**File:** `server/actions/delete-upload.ts`

**Bukti** — file ini tidak punya satu pun proteksi:
```ts
"use server";
import { UTApi } from "uploadthing/server";
const utapi = new UTApi();

export async function deleteUploadedFile(fileKey: string) {
  if (!fileKey) return { success: false };
  const key = fileKey.startsWith("http") ? fileKey.split("/f/")[1] : fileKey;
  if (!key) return { success: false };
  await utapi.deleteFiles(key);
  return { success: true };
}
```

Tidak ada `studentAccount()`. Tidak ada `getCurrentUserRole()`. Tidak ada Zod. Tidak ada pengecekan kepemilikan file.

**Kenapa ini berbahaya:** `"use server"` action **dipetakan ke endpoint HTTP publik** oleh Next.js. Siapa pun — tanpa login — bisa mengirim request server action dengan `fileKey` arbitrer lalu **menghapus file milik orang lain** (foto tiket customer service, avatar, dsb). Ini **data destruction vector**, bukan sekadar info disclosure.

**Bug tambahan:** `fileKey.split("/f/")[1]` untuk URL `https://utfs.io/f/abc123` menghasilkan `abc123`, tapi untuk `https://utfs.io/f/abc123?x=1` menghasilkan `abc123?x=1` — `deleteFiles` gagal diam-diam tapi fungsi tetap return `{ success: true }`.

**Fix:**
1. `const { user } = await studentAccount()` — return `{ success: false, error: "Unauthorized" }` bila tidak login
2. Validasi `fileKey` dengan Zod + whitelist prefix yang boleh dihapus
3. **Ownership check:** file hanya boleh dihapus oleh pemilik record-nya (mis. `CustomerServiceFile` dengan `ticket.userId === user.id`)
4. Batasi hanya file bertipe `customerServiceFile` — jangan sampai bisa menghapus avatar/berita orang lain
5. Parse URL dengan `new URL()` bukan `.split()`, return error kalau `key` invalid
6. Ganti return type ke `TServerPrompt<void>` sesuai §7

---

### 0.3 `pnpm build` GAGAL — build butuh live DB & host DB di `.env` sudah mati

**Bukti:**
```
$ pnpm build
✓ Compiled successfully in 18.5s
Finished TypeScript in 12.9s
Error [DriverAdapterError]: (ENOTFOUND) tenant/user postgres.jokafaklwlxiztqefnoj not found
Error: Failed to collect page data for /acara/[eventSlug]
```

**Dua masalah terpisah:**

**(a) `.env` berisi project Supabase yang sudah tidak hidup.** Host `postgres.jokafaklwlxiztqefnoj` menghasilkan `tenant/user ... not found` — project-nya sudah dihapus atau diganti di sisi Supabase.

> **🟢 RESOLUSI SEBAGIAN (28 Sep 2026): project pengganti sudah ditemukan lewat Supabase MCP.**
> Ref baru = `jhuazrfwbuimzuaktalb` → `https://jhuazrfwbuimzuaktalb.supabase.co`.
> **Ini adalah database PRODUCTION yang hidup, dengan data nyata** (lihat "P0.3 Discovery Log" di bawah).
> Yang masih kurang hanya **password database** — tidak bisa diambil lewat MCP API (secret memang tidak
> di-expose). Harus di-copy manual dari Supabase Dashboard → Settings → Database → Connection string.

**(b) Arsitektur: `next build` hard-dependency ke database.** Halaman `/acara/[eventSlug]` di-*generate* saat build, jadi `next build` harus query DB. Kalau DB tidak terjangkau selama 1 menit, **deploy gagal total** — bahkan untuk perubahan yang sama sekali tidak menyentuh database.

**Fix:**
1. **Pisahkan env lokal vs produksi** — `.env.local` untuk dev dengan DB dev, dan dokumentasikan bahwa build production butuh akses DB
2. Tandai route yang datanya berubah cepat agar tidak di-*prerender* saat build
3. Andalkan ISR (`export const revalidate = N`) untuk halaman yang cocok, dan `force-dynamic` untuk yang benar-benar dynamic
4. Alternatif lebih bersih: pindahkan fetching ke Client Component + React Query, sehingga `next build` tidak perlu DB sama sekali
5. Update bagian "Deploy ke produksi" di README dengan urutan langkah yang benar

#### P0.3 Discovery Log — 28 Sep 2026 (Supabase MCP)

MCP Supabase sudah di-authenticate ke project `jhuazrfwbuimzuaktalb`. Hasil investigasi:

**1. Project ini adalah DB production yang hidup — datanya ada semua.**

`tools.supabase.list_tables` melaporkan `rows: 0` (cache basi — **jangan dipercaya**). Query langsung
via `execute_sql` menunjukkan sebaliknya:

| Tabel | Rows |
| --- | --- |
| `user` | 84 |
| `account` | 84 |
| `session` | 262 |
| `participants` | 85 |
| `dataSiswa` | 192 |
| `news` | 21 |
| `events` | 6 |
| `customerService` | 0 |
| `calendarEntry` | 0 |

> **Peringatan:** ini DB production berisi data pribadi 84 siswa. **Jangan** menjalankan `apply_migration`,
> DDL, atau `DELETE`/`UPDATE` tanpa persetujuan eksplisit user.

**2. `supabase_migrations` kosong** — `list_migrations` = `[]`. Mengonfirmasi temuan **1.1** berlaku
pada DB production: schema di-*push* via `prisma db push`, tidak pernah ada history migration.
`prisma migrate deploy` di README memang no-op.

**3. Postosi keamanan: terkunci, bukan terbuka.** `get_advisors({type:"security"})` → **`{lints: []}`**
(bersih). RLS memang **nonaktif di 13 tabel**, tapi jalur datanya tertutup karena role anonim tidak
punya grant sama sekali:

| Role | `USAGE` on `public` | `SELECT` on tabel |
| --- | --- | --- |
| `anon` | ❌ | ❌ |
| `authenticated` | ❌ | ❌ |
| `service_role` | ❌ | ❌ |
| `supabase_admin` | ✅ | ✅ |

`information_schema.table_privileges` → `[]` (nol grant tabel untuk anon/authenticated/service_role/PUBLIC).
Diverifikasi empiris: 5 request ke PostgREST dengan anon key semuanya **401** `permission denied for schema public`.

**⚠️ Ini securityby-accident, bukan desain.** Kalau ada yang nanti menjalankan
`GRANT USAGE ON SCHEMA public TO anon, authenticated` (langkah "perbaikan" yang sangat umum saat
query Supabase JS mysteriously gagal), maka RLS-off + nol policy = **public read/write penuh** atas
`session.token` dan `account.password`. Fix yang benar untuk RLS bukan `ENABLE ROW LEVEL SECURITY`
saja — perlu RLS + policy yang benar-benar membatasi.

**4. ✅ Realtime BEKERJA — payload dikosongkan (verifikasi end-to-end 28 Sep 2026).**

Prediksi awal saya ("Realtime mati karena `supabase_realtime_admin` `SELECT = false`") **SALAH**, dan
diperbaiki di sini. Uji end-to-end sebenarnya (subscribe sebagai anonim → insert baris uji via
`psql` → amati payload):

| Tabel | Handshake | Event tiba? | Payload |
| --- | --- | --- | --- |
| `news` | `SUBSCRIBED` | ✅ ya | `{}` — **kosong** |
| `events` | `SUBSCRIBED` | ✅ ya | `{}` — **kosong** |
| `participants` | `SUBSCRIBED` | — | — |
| `user` | `SUBSCRIBED` | — | — |

Artinya:

1. **App tetap berfungsi.** `realtime-provider.tsx` & `data-table.tsx` hanya memakai event sebagai
   *signal* untuk `queryClient.invalidateQueries()` — mereka **tidak pernah membaca payload**. Data
   diambil ulang lewat Prisma yang punya akses penuh. Pola invalidate ini benar.
2. **Tidak ada kebocoran data.** Realtime men'strip seluruh kolom karena peran anonim tidak punya
   `SELECT`. Notifikasi perubahan sampai, isi baris tidak. Ini justru hasil yang benar.
3. Tes yang hanya melihat status `SUBSCRIBED` **tidak cukup** untuk menyimpulkan apa pun —
   handshake ≠ aliran data. Tes payload wajib dilakukan.

> Catatan: `verification` (tabel tanpa FK) tidak menghasilkan event sama sekali, berbeda dari
> `news`/`events`. Belum ditelusuri; tidak berdampak ke app karena tabel itu tidak disubscribe.

**5. 7 foreign key tanpa index** (`unindexed_foreign_keys`, level INFO) — `cancelLog_eventId_fkey`,
`customerService_readById_fkey`, `customerService_resolvedById_fkey`, `events_userId_fkey`, dan lainnya.
Performansi, bukan keamanan. Prioritas rendah.

**6. ✅ NOL DRIFT — `schema.prisma` identik dengan DB production** (28 Sep 2026).
Perbandingan 13 tabel / 120 kolom lewat dump `psql` vs parser `schema.prisma`: tidak ada tabel atau
kolom yang hanya ada di salah satu sisi, nullability konsisten di semua kolom.

> Cara verifikasi: `prisma migrate diff` **tidak bisa dipakai** di project ini. Prisma versi ini sudah
> menghapus `--from-url` dan `--to-schema-datamodel`; `--from-config-datasource` + `--to-schema`
> menggantung di transaction pooler, dan menolak saat `DATABASE_URL` = `SHADOW_DATABASE_URL`.
> Perbandingan manual via `psql` + parser adalah cara yang dapat diulang.

> **Next action (28 Sep 2026): P0.3 SELESAI.** `.env` terhubung ke DB production, drift nol,
> `pnpm lint` dan `pnpm build` lolos, data terbaca di runtime. Lanjut ke P1.

#### Troubleshooting: `(ENOTFOUND) tenant/user postgres.<ref> not found`

Gejalanya: login `POST /api/auth/sign-in/social` → 500, dan halaman publik kena error yang sama.
Selama sesi ini masalah ini muncul **3 kali** dengan 2 penyebab berbeda. Cek berurutan:

| # | Gejala | Penyebab | Solusi |
| --- | --- | --- | --- |
| 1 | `ENOTFOUND` dari `pnpm build` | `.env` masih project lama | ganti `DATABASE_URL` |
| 2 | `ENOTFOUND` padahal `.env` sudah benar | **dev server start sebelum `.env` diperbaiki** | restart `pnpm dev` |
| 3 | `ENOTFOUND` setelah semuanya terlihat benar | `.env` ter-overwrite file lain | `grep DATABASE_URL .env` |

**Poin 2 yang paling sering terlewat:** Next.js memuat `.env` ke `process.env` **sekali saat start**,
dan `Pool` di `lib/db/index.ts` dibuat saat module di-load. Mengedit `.env` **tidak** mengubah pool
yang sudah jadi — harus `Ctrl+C` lalu `pnpm dev` lagi.

**Diagnosis cepat:**
```bash
grep DATABASE_URL .env | sed -E 's|://([^:]+):[^@]*@|://\1:***@|'   # nilainya benar?
ps -eo pid,lstart,command | grep "next dev"                          # server start kapan?
```
Kalau `.env` benar tapi server start **sebelum** waktu `.env` diubah → itu penyebab no 2.

> **⚠️ JANGAN pakai string 5432 untuk `DATABASE_URL`.** Nilai `.env` lama:
> ```
> DATABASE_URL        → port 6543 (transaction pooler) + ?pgbouncer=true&connection_limit=3&pool_timeout=30
> SHADOW_DATABASE_URL → port 5432 (session pooler)
> ```
> `DATABASE_URL` sengaja di-6543 dengan `connection_limit=3` — itu fix **EMAXCONNSESSION** dari commit
> terakhir. Memasang string session-mode 5432 akan **meregresi fix tersebut**. Host sama, port berbeda,
> jadi cukup ganti port-nya. Region project: `aws-1-ap-south-1` (Mumbai) — IPv4 & TCP 5432/6543
> sudah diverifikasi terbuka dari mesin ini.

> **`.env` ternyata hampir benar.** `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
> **sudah** menunjuk ke project baru (`jhuazrfwbuimzuaktalb`, diverifikasi via decode payload JWT).
> Yang basi hanya `DATABASE_URL` + `SHADOW_DATABASE_URL` yang masih ke `jokafaklwlxiztqefnoj`
> (host lama sama sekali tidak resolve — `ENOTFOUND`).
> Jadi yang dibutuhkan user hanya **satu hal: password database**.

---

## Priority 1 — INFRASTRUKTUR (agar plan ini tidak expire lagi)

### 1.1 `prisma/migrations/` — TIDAK ADA

**Bukti:**
```bash
$ ls prisma/
schema.prisma          # hanya ini

$ git ls-files prisma/
prisma/schema.prisma    # tidak ada migration yang di-track

$ git check-ignore prisma/migrations
# NOT ignored (just doesnt exist)
```

Ini kritikal untuk reproducibility. README menyuruh menjalankan command yang tidak akan melakukan apa-apa:

- Setup lokal: `prisma db push` (tidak ada history, tidak ada tracking)
- Deploy produksi: README menyuruh `prisma migrate deploy` — **command ini no-op karena nol migration**

**Dampak:**
1. Tidak ada rollback plan kalau schema production salah
2. Dev baru tidak bisa setup DB dengan migration, hanya dengan `db push`
3. Tidak bisa membuat DB baru (staging, demo BSF 2026)
4. Drift antara `schema.prisma` dan DB production **tidak terdeteksi**

**Fix:**
1. `pnpm exec prisma migrate dev --name init_baseline` — buat migration baseline dari schema sekarang
2. Verifikasi hasilnya match dengan DB production (`prisma migrate diff`) sebelum commit
3. Ganti `prisma db push` di README dengan `migrate deploy`
4. Tambahkan section migrasi di README

---

### 1.2 Tidak ada `.env.example`, dan 3 env var bypass `lib/env`

**Bukti:** `ls .env*` hanya menghasilkan `.env`. `AGENTS.md` §9 mewajibkan: "Jika butuh env variable baru, tambahkan di `lib/env.ts` **dan** dokumentasikan di `.env.example`".

**Env var yang dipakai tapi tidak terdaftar di `lib/env`:**

| Var | Dipakai di | Masalah |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `app/layout.tsx:25` | `process.env` langsung, hardcoded fallback `http://localhost:3000` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `lib/push/client.ts:9`, `lib/push/server.ts:19,73` | `process.env` langsung + non-null assertion `!` |
| `VAPID_PRIVATE_KEY` | `lib/push/server.ts:20,74` | `process.env` langsung + non-null assertion `!` |

Ketiganya **melanggar `AGENTS.md` §9**. Kalau salah ketik, errornya baru muncul saat runtime, bukan saat startup.

**Fix:**
1. Tambahkan ketiga var ke `lib/env/index.ts` (section `server` dan `client`)
2. Replace semua `process.env.X` dengan `env.X`
3. Hapus non-null assertion `!` — Zod sudah menjamin
4. Bikin `.env.example` berisi semua key dengan placeholder
5. Rapikan `lib/env/index.ts` — sekarang pakai **tabs**, sedangkan project standardize 2 spaces

---

### 1.3 Tidak ada CI

**Bukti:** `ls .github` tidak ada.

`AGENTS.md` §12 mewajibkan `pnpm lint` + `pnpm build` setiap selesai, tapi tidak ada automation. Tidak ada yang memaksa `pnpm build` setelah 3 bulan, dan tidak ada yang sadar ada 2 security hole. Kalau GitHub Actions aktif sejak dulu, 0.1 dan 0.2 sudah ketahuan 3 bulan lalu.

**Fix:** bikin `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          # + seluruh env var lain yang required oleh lib/env
```

Karena `next build` butuh DB (lihat 0.3), pakai **secret DB read-only** untuk job build. Alternatif yang lebih aman: pisahkan job `typecheck` (hanya `tsc --noEmit`, tanpa DB) yang jalan di PR, dan job `build` penuh yang hanya jalan di branch utama.

---

### 1.4 Tidak ada observability

Hanya ada `@vercel/speed-insights` (web vitals). Tidak ada:
- Error monitoring (Sentry atau sejenisnya) — production error tidak ada yang tahu
- `instrumentation.ts` — tidak ada custom logging
- Structured logger — semua `console.log` (4 tempat) tanpa level maupun context
- Health check endpoint

Untuk aplikasi yang dipakai selama event BSF, ini gap operasional nyata. Kalau production error terjadi saat hari event, tidak ada cara diagnose selain screenshot dari user.

---

## Priority 2 — DOKUMENTASI vs REALITAS (drift)

### 2.1 `docs/performance-plan.md` — klaim tidak sesuai kenyataan

**File:** `docs/performance-plan.md`, marked `status: done`

**Evidence of drift:**
```
### 2.2 Konsolidasi Icon Library — ✅ SELESAI     ← tidak sesuai kenyataan
```

**Realita:**
```bash
$ grep -rl "@tabler/icons-react" app components features | wc -l
64                                     # 64 file masih pakai Tabler

$ grep -rl "lucide-react" app components features | wc -l
1                                      # hanya 1 file pakai Lucide
```

`AGENTS.md` §7 bilang "Satu library konsisten (**Lucide preferred**)", dan commit `eb65130 chore: add lucide-react dependency` menunjukkan niat konsolidasi — tapi **tidak pernah dieksekusi**. 64 dari 65 file masih Tabler.

**Item yang masih terbuka di plan tapi tidak pernah dikerjakan:**

| Item | Status di plan | Catatan |
| --- | --- | --- |
| 1.5 Public List Pages Client Component | 🔴 | perlu verifikasi ulang |
| 4.2 `getCurrentUserRole().then(setRole)` anti-pattern | 🔴 | tidak ditemukan lagi di kode, plan perlu di-update |
| 2.4 `schemas/index.ts` barrel | ⚠️ | sudah tidak ada, plan perlu di-update |
| 2.5 Ganti favicon ke WebP | — | `app/*.ico` tidak ada |
| 2.6 Optimasi `next/image` untuk LCP | — | 18 pemakaian, belum dioptimasi |

**Fix:** update plan → turunkan `status: done` ke `in-progress`, koreksi item 2.2, dan pindahkan sisa item ke backlog P3/P4.

---

### 2.2 `docs/email-password-plan.md` — fitur diklaim selesai, tapi TIDAK ADA di kode

**Bukti:**
```bash
$ grep -rn "emailAndPassword" lib/
# tidak ada hasil

$ cat features/account/auth/login-page.tsx
<GoogleProvider />       # hanya Google, tidak ada form email/password
```

Plan file ada (4.1 KB) dan commit `d5abfab` mengklaim `feat(auth): tambah email/password login`. Tapi `lib/auth/server.ts` hanya punya `socialProviders.google` — **tidak ada config `emailAndPassword`**. Login page hanya render `<GoogleProvider />`.

**Fix:** pilih salah satu:
- **(a) Implementasikan** email/password, kalau memang masih dibutuhkan
- **(b) Hapus plan file-nya** dan catat di commit bahwa fitur dibatalkan

Jangan biarkan plan file menyesatkan.

---

### 2.3 Plan file tidak lengkap

Fitur yang ada tapi tidak punya plan file (`AGENTS.md` §1/§2 mewajibkan plan file per fitur):

| Fitur | Plan file |
| --- | --- |
| `features/account` (auth, profile) | ❌ tidak ada |
| `features/notifications` (web push) | ❌ tidak ada |
| `features/uploads` (UploadThing) | ❌ tidak ada |
| `features/dashboard` | ❌ tidak ada |
| `features/realtime` (Supabase realtime) | ❌ tidak ada |
| `features/events` | ✅ `event-plan.md` |
| `features/calendar` | ✅ `calendar-plan.md` |
| `features/customer-service` | ✅ `customer-service-plan.md` |
| `features/news` | ✅ `news-plan.md` |

**Fix:** backfill plan file singkat untuk fitur yang belum pernah didokumentasikan (nama fitur, routes, role requirements — tidak perlu template lengkap).

---

### 2.4 `design-guideline.md` — DI-GITIGNORE

**Bukti:**
```bash
$ grep design .gitignore
/design-guideline.md        # di-ignore

$ ls design-guideline.md
# MISSING
```

`AGENTS.md` §5 mewajibkan `design-guideline.md` sebagai design system source of truth. Tapi file ini **tidak ada di repo** — hilang untuk semua contribributor, CI, dan AI agent. Cuma ada di mesin kamu.

**Fix:**
1. Hapus `/design-guideline.md` dari `.gitignore`
2. Commit file-nya
3. Kalau file-nya memang sudah tidak ada, buat ulang minimal token warna, font, dan spacing

---

### 2.5 `docs/Sistem Skor Wasit Voli BSF 2026.md` — belum jadi plan file

File ini (6.9 KB) sangat detail — alur wasit, kartu merah, time-out, dll. Tapi:
- Nama file tidak mengikuti konvensi `<fitur>-plan.md` yang diwajibkan `AGENTS.md` §1
- Tidak punya marker `status:`
- Belum diformalkan jadi plan file

**Fix:** rename ke `docs/referee-scoring-plan.md`, tambahkan `status: proposed`, lengkapi section Database Model + Server Actions sesuai template `AGENTS.md` §1. Ini juga akan jadi dasar fitur terbesar berikutnya.

---

## Priority 3 — DEPENDENCY HYGIENE (drift ±3 bulan)

### 3.1 Dua library Base UI terinstall bersamaan

```bash
$ pnpm outdated | grep base-ui
@base-ui-components/react  1.0.0-rc.0  →  DEPRECATED
@base-ui/react             1.1.0         →  1.8.0
```

Duplikat, dan satu sudah deprecated. Dipakai di 10+ file `components/ui/`.

**Fix:**
1. `pnpm remove @base-ui-components/react`
2. Pastikan semua import sudah dari `@base-ui/react`
3. Update ke 1.8.0, cek breaking changes

### 3.2 `react-hook-form` terinstall tapi TIDAK DIPAKAI

```bash
$ grep -rl "react-hook-form" app components features schemas
# tidak ada hasil
```

0 import. Project sudah standardize `@tanstack/react-form` (§7). Ini dead dependency yang tidak perlu.

**Fix:** `pnpm remove react-hook-form`

### 3.3 Dua library toast paralel

`goey-toast` dan `sonner` keduanya aktif:
```bash
$ grep -rl "goey-toast" app components features
app/layout.tsx
components/notification-alert.tsx

$ grep -rl "sonner" app components features
components/ui/sonner.tsx
components/shared/confirm-delete-dialog.tsx
components/field/news-form.tsx
```

`AGENTS.md` §7 bilang "Error → sonner toast". Goey-toast masih dipakai di 2 file.

**Fix:** migrasi 2 file goey-toast → sonner, lalu `pnpm remove goey-toast`

### 3.4 Duplikasi Radix UI

Beberapa file masih pakai `@radix-ui/react-*` individual (4 file) sementara mayoritas sudah ke unified `radix-ui` (3 file). `@radix-ui/react-dialog` 1.1.15 → 1.1.23 available.

**Fix:** konsolidasi ke `radix-ui` unified, lalu `pnpm remove` package yang tidak dipakai.

### 3.5 Update dependency (minor/patch)

| Package | Current | Latest | Catatan |
| --- | --- | --- | --- |
| `next` | 16.2.2 | 16.3.6 | minor |
| `react` / `react-dom` | 19.2.3 | 19.3.0 | minor |
| `@prisma/client` | 7.6.0 | 7.10.0 | cek changelog |
| `better-auth` | 1.5.6 | 1.7.6 | baca changelog dulu — auth library sering breaking |
| `@tanstack/react-query` | 5.90.20 | 5.104.0 | minor |
| `@tanstack/react-table` | 8.21.3 | 9.2.4 | **major** — baca changelog, belum tentu aman |
| `tailwindcss` | 4.1.18 | 4.3.3 | minor |
| `zod` | 4.3.6 | 4.6.5 | minor |
| `@supabase/supabase-js` | 2.95.3 | 2.117.2 | minor |
| `@tabler/icons-react` | 3.36.1 | 3.48.0 | minor, atau hapus jika konsolidasi ke Lucide |
| `shadcn` | 4.4.0 | 4.21.0 | dev tooling |

**Fix:** update minor/patch satu per satu dengan `pnpm build` di antaranya. `@tanstack/react-table` 8 → 9 pisahkan karena major.

---

## Priority 4 — ERROR RESILIENCE & POLISH

### 4.1 Tidak ada `error.tsx` sama sekali

```bash
$ find app -name "error.tsx" -o -name "global-error.tsx" -o -name "not-found.tsx"
# tidak ada hasil

$ find app -name "page.tsx" | wc -l
25
```

25 halaman, **0 error boundary**, 0 `not-found.tsx`, dan hanya 1 `loading.tsx` dengan 0 `<Suspense>`. Kalau ada server action yang crash, user melihat halaman error default Next.js — branded, bisa understood, dan tidak ada cara recovery.

**Fix:**
1. `error.tsx` di `app/(protected)/layout.tsx` dan `app/(public)/layout.tsx` (catch-all per segment)
2. `app/not-found.tsx` global dengan CTA ke beranda
3. `global-error.tsx` sebagai catch-all terakhir
4. Pertimbangkan `loading.tsx` dengan skeleton di route yang paling sering dibuka (`AGENTS.md` §7 mewajibkan skeleton dari `components/skeletons/`)

### 4.2 `console.log` tanpa level

4 `console.log` tanpa level maupun context. Untuk production debugging yang terstruktur, ini kurang.

**Fix:** `console.error` untuk error, `console.warn` untuk warning, atau setup logger sederhana.

### 4.3 `prisma/schema.prisma` punya whitespace noise

`git status` menunjukkan `prisma/schema.prisma` modified, dan diff-nya **hanya perataan spasi** dari `prisma format` — tidak ada perubahan schema. Noise ini sebaiknya di-commit sekali agar tidak membingungkan, atau di-revert.

---

## Priority 5 — TESTING (backlog, tidak wajib sekarang)

`AGENTS.md` §11 mewajibkan unit test untuk utils pure yang kompleks, tapi `__tests__/` tidak ada sama sekali dan Vitest belum terinstall. Utils yang layak diuji: `utils/calendar-utils.ts`, `utils/date-format.ts`, `utils/slug.ts`, dan validator Zod di `schemas/`.

**Fix (opsional):** setup Vitest, tulis test untuk `utils/` dan validator auth.

---

## Roadmap / Prioritas Eksekusi

| Phase | Isi | Estimasi | Risiko |
| --- | --- | --- | --- |
| **P0** | Fix 2 security hole + restore build | 2–3 jam | rendah |
| **P1** | Migrations + `.env.example` + CI + observability | 1–2 hari | sedang |
| **P2** | Koreksi docs + un-ignore design guideline | 2–3 jam | rendah |
| **P3** | Dependency cleanup + update minor | 3–4 jam | sedang |
| **P4** | Error boundaries + polish | 1–2 jam | rendah |
| **P5** | Testing setup | 1–2 hari | rendah |

**Rekomendasi: kerjakan P0 lebih dulu.** 0.1 dan 0.2 adalah vulnerability production yang bisa dieksploitasi sekarang juga, dan perbaikannya kecil (tidak ada migrasi DB, tidak ada perubahan UI).

---

## Testing Checklist (P0)

- [ ] `GET /api/export/participants?eventId=X` tanpa login → **403**
- [ ] `GET /api/export/participants?eventId=X` sebagai student biasa → **403**
- [ ] `GET /api/export/participants?eventId=X` sebagai admin pemilik event → **200 + CSV**
- [ ] `GET /api/export/participants` tanpa `eventId` → **400**
- [ ] `GET /api/export/participants?eventId=INVALID` → **400** (Zod)
- [ ] `deleteUploadedFile` tanpa login → `{ success: false }`
- [ ] `deleteUploadedFile` dengan `fileKey` milik orang lain → `{ success: false }`
- [ ] `deleteUploadedFile` dengan `fileKey` milik sendiri → `{ success: true }`, file terhapus
- [ ] `pnpm lint` → 0 error
- [ ] `pnpm build` → sukses

---

## Out of Scope (untuk sekarang)

- Major rewrite / migrasi framework → tidak perlu, arsitektur sudah baik
- Migrasi Prisma 6 → 7 → sudah di 7.6
- Test coverage menyeluruh → P5, backlog
- Redesign UI → tidak ada keluhan
- pindah hosting → tidak perlu

---

## Notes

- Semua temuan sudah diverifikasi dengan output command, bukan asumsi
- Plan ini **melengkapi** `AGENTS.md`, tidak mengoverride-nya
- Kalau ada temuan yang tidak cocok dengan realita (misal `prisma/migrations` sengaja tidak di-track), update plan ini dan catat alasannya
- Setelah P0 selesai, mark `status: done` di baris atas dan tambahkan checklist per-item

---

## P0 Completion Log — 26 Sep 2026

> ## ⚠️ REGRESI P0 — 28 Sep 2026: kerjaan hilang, sudah dikerjakan ulang
>
> Pada 28 Sep 2026 ditemukan bahwa **seluruh perbaikan kode P0 tidak ada lagi** di working tree,
> padahal dokumen ini tetap mengklaim "selesai". Kondisi yang terverifikasi:
>
> | File | Expected | Aktual |
> | --- | --- | --- |
> | `app/api/export/participants/route.ts` | auth + ownership | 0 auth check, file 70 baris versi lama |
> | `server/actions/delete-upload.ts` | auth + Zod + ownership | 0 dari 6 penanda keamanan |
> | `lib/db/safe.ts` | ada | **file tidak ada** |
> | 4 halaman publik | pakai `safeDb` | 0 file memakainya |
> | 2 pemanggil client | cek `result.success` | kembali ke `await` telanjang |
>
> Tidak ada stash, tidak ada branch lain, tidak ada worktree — `git log` hanya sampai `1e8e3c4`.
> Hanya `mtime` (28 Sep 09:39) yang membuktikan file-file itu pernah ditulis lalu dikembalikan.
> `docs/maintenance-plan.md` selamat karena untracked, dan karena itu dokumen ini sempat
> **berbohong** soal status P0.
>
> ### Dampak: kebocoran PII production AKTIF kembali, dan terverifikasi nyata
>
> Setelah `.env` terhubung ke DB production, endpoint langsung diuji:
>
> ```
> GET /api/export/participants?eventId=cedcf149-...
> → HTTP 200, tanpa login, tanpa cookie
> → 23 baris CSV: nama_lengkap, nomor_öğrenci, email, angkatan, fakultas, jurusan, jenis_kelamin
> ```
>
> ### Setelah diperbaiki ulang
>
> ```
> tanpa auth          → HTTP 401  {"error":"Unauthorized"}
> eventId tidak valid → HTTP 401  {"error":"Unauthorized"}
> eventId acak        → HTTP 401  {"error":"Unauthorized"}
> / /acara /berita /login → HTTP 200, data tetap tampil
> ```
>
> `pnpm lint` bersih, `pnpm build` lolos, `pnpm start` terverifikasi.
>
> ### Pelajaran
>
> 1. **Perubahan yang tidak di-commit tidak ada.** Tempel kode ini ke percakapan, bukan ke git.
> 2. **Halaman yang bersih secara git belum tentu aman.** Selalu uji keirling ke endpoint yang
>   _rawas_ setelah smirk, jangan hanya relies on `git status`.
> 3. **Jangan biarkan dokumen mengklaim sesuatu yang tidak ada di kode.** Kalau plan tracker
>    Independent, harus diverifikasi ulang terhadap filesystem sebelum dipercaya.

### 0.1 `/api/export/participants` — DONE (diperbaiki ulang 28 Sep 2026)

**Diperbaiki di:** `app/api/export/participants/route.ts` (rewrite)

| Fix | Status |
| --- | --- |
| `studentAccount()` guard, return 401 | ✅ |
| `getCurrentUserRole()` + role check | ✅ |
| Ownership check (`event.userId === session.user.id`) | ✅ |
| Zod validation `eventId` | ✅ |
| `Cache-Control: no-store` (anti cache CDN) | ✅ |
| Sanitize filename (anti header injection) | ✅ |
| `console.log` → `console.error` | ✅ |
| Return 404 kalau event tidak ada (sebelumnya 200) | ✅ |

Otorisasi final: **pembuat acara ATAU committee (`ADMIN`/`PENGURUS`)**. Gate di client (`userCreatorId === userId`) tetap dipertahankan sebagai UX, tapi tidak lagi jadi satu-satunya lapis.

**Verifikasi runtime** (server production di `:3111`):
```
GET /api/export/participants?eventId=abc123def456  → HTTP 401 {"error":"Unauthorized"}
GET /api/export/participants                       → HTTP 401 {"error":"Unauthorized"}
GET /api/export/participants?eventId=ckq1r2s3u…    → HTTP 401 {"error":"Unauthorized"}
```
Sebelum fix: ketiganya mengembalikan **200 + CSV berisi NIM/email/nama/fakultas/jenis kelamin**.

### 0.2 `deleteUploadedFile` — DONE

**Diperbaiki di:** `server/actions/delete-upload.ts` (rewrite), plus 2 client caller

| Fix | Status |
| --- | --- |
| `studentAccount()` guard | ✅ |
| Zod `fileKeySchema` (format + panjang) | ✅ |
| Parse URL dengan `new URL()`, buang query/hash | ✅ (bug lama: `?x=1` ikut jadi key) |
| Ownership check DB (avatar/news/event/ticket) | ✅ |
| Bypass untuk `ADMIN`/`PENGURUS` | ✅ |
| Return type `TServerPrompt<void>` | ✅ |
| `console.error` + pesan error jelas | ✅ |
| 2 client caller cek `.success` (tidak lagi lie "dihapus") | ✅ |

**Model ownership:** kalau `fileKey` masih direferensikan record milik user lain → **ditolak**. Kalau tidak direferensikan record mana pun (orphan) → boleh, karena itu alur normal untuk semua call site internal (`news.ts`, `acara.ts`, `profile.ts`, `user.ts`, `customer-service-admin.ts` semuanya menghapus row dulu, baru bersihkan file).

**File yang ikut berubah:**
- `features/uploads/upload-photo-profile.tsx` — cek `result.success`
- `features/uploads/upload-event-news.tsx` — cek `result.success`

**Verifikasi:** `extractFileKey` + `fileKeySchema` diuji dengan 11 kasus (key mentah, URL, URL+query, karakter ilegal, path traversal, string kosong, path non-`/f/`) → **11/11 PASS**. Guard ikut ter-*bundle* di output build (dicek via grep chunk SSR).

### 0.3 Build — DONE (code), BLOCKED (kredensial)

**Diperbaiki di:** `lib/db/safe.ts` (baru), 4 halaman publik

| Fix | Status |
| --- | --- |
| `safeDb(operation, query, fallback)` | ✅ |
| `safeStaticParams()` untuk `generateStaticParams` | ✅ |
| `generateMetadata`wrapped `safeDb` (acara + berita) | ✅ |
| List page `/acara` + `/berita` wrapped `safeDb` | ✅ |
| `pnpm build` sukses | ✅ |

**Build sebelum fix:**
```
Error [DriverAdapterError]: (ENOTFOUND) tenant/user postgres.jokafaklwlxiztqefnoj not found
Error: Failed to collect page data for /acara/[eventSlug]
```

**Build sesudah fix:**
```
✓ Compiled successfully in 20.8s
✓ Finished TypeScript in 12.3s
[safeDb] "generateStaticParams" gagal, memakai fallback.
[safeDb] "acara:list" gagal, memakai fallback.
[safeDb] "berita:list" gagal, memakai fallback.
✓ Generating static pages using 7 workers (23/23) in 2.3s
```

Deploy tidak lagi gagal total hanya karena DB tidak terjangkau. Halaman publik tetap 200 dengan empty state, lalu terisi sendiri saat revalidate.

> **Penting — sudah tidak berlaku (28 Sep 2026):** waktu build di atas, `DATABASE_URL` masih menunjuk ke
> project lama yang mati, jadi `safeDb` ter-trigger dan halaman publik merender empty state.
> **Sekarang `.env` sudah menunjuk ke DB production `jhuazrfwbuimzuaktalb`**, drift nol, dan
> `safeDb` tidak lagi ter-trigger saat build — data production ikut ter-prerender.
> Build dengan DB hidup (28 Sep 2026): `✓ Compiled successfully in 16.9s`,
> `✓ Generating static pages using 7 workers (44/44) in 4.2s`, tanpa satu pun baris `[safeDb]`.

### Verifikasi akhir

```
pnpm lint              → 0 error
pnpm exec tsc --noEmit → 0 error
pnpm build             → sukses, 23/23 static pages
```

---

## P0.4 — Route detail acara & berita 500 di produksi (28 Sep 2026)

Ditemukan saat verifikasi pra-deploy ke `main`, **bukan** oleh `pnpm build`.

### Gejala

`GET /acara/<slug>` → **500** untuk semua slug, termasuk slug yang benar-benar ada di DB.
`GET /berita/<slug>` → 200 (route-nya kebetulan diklasifikasi dynamic, jadi tidak terkena).

### Akar masalah

`generateStaticParams` + `revalidate` + `dynamicParams` sudah ditambahkan ke kedua route, padahal
body halaman memanggil `auth.api.getSession({ headers: await headers() })`. Keduanya tidak bisa
coexist:

| Tahap | Yang terjadi |
| --- | --- |
| Build | Next menandai route SSG (`●`) |
| Prerender | `headers()` memicu `DYNAMIC_SERVER_USAGE`, prerender **dibatalkan** |
| Artefak | **0 file HTML** di `.next/server/app` untuk `/acara` maupun `/berita` |
| Runtime | Route tetap SSG → on-demand render → lempar `DYNAMIC_SERVER_USAGE` lagi → **500** |

`pnpm build` tetap hijau karena Next mencetak `Generating static pages (44/44)` tanpa menandai
route itu gagal.

### Kenapa lolos dari audit awal

Audit 26 Sep hanya menjalankan `lint` + `build`. `pnpm dev` **tidak** menunjukkan masalah ini
karena dev server tidak melakukan prerender. Yang dibutuhkan adalah `next start` terhadap build
production.

### Status regresi

`origin/main` (196805b) **tidak** punya `generateStaticParams` di kedua file tersebut — dikonfirmasi
via `git diff`. Jadi ini regresi yang hendak ikut naik ke `main`, bukan kerusakan lama.

### Perbaikan

Hapus `generateStaticParams`, `revalidate`, `dynamicParams` dari kedua route. Halaman detail
wajib dinamis karena bergantung pada session. `safeDb` di `generateMetadata` dan
`utils/meta-description.ts` tetap dipakai.

### Verifikasi (production build + `next start` + DB production)

```
/ /berita /acara /login                        200
/berita/indikasi-penipuan                      200
6 acara dari DB (slug asli)                    200, title asli bukan fallback
/acara/<slug ngawur>                           200 (handled client-side)
/api/export/participants tanpa auth             401
/home/* tanpa auth                             200 shell, tanpa data di HTML
DYNAMIC_SERVER_USAGE di log                    0
```

Aturan pencegahannya sudah ditulis di `docs/file-placement.md`, termasuk perintah verifikasi
wajib sebelum deploy.

---

## P0.5 — Build Vercel gagal: import map Turbopack rusak (28 Sep 2026)

### Gejala

Deploy ke `main` gagal dengan 28 error, semuanya pola sama:

```
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
Error while looking up import map: next/font/google queries have exactly one entry
```

Satu error per `@font-face` (4 weight Inter + 2 weight JetBrains_Mono, lintas subset).

### Diagnosis

Bukan masalah `next/font/google`. Yang penting:

| Pemeriksaan | Hasil |
| --- | --- |
| Pemanggilan di `app/layout.tsx` | Benar - `Inter` + `JetBrains_Mono`, `subsets: ["latin"]`, tanpa loop, tanpa dynamic import |
| Build lokal dengan `.next` di-cache | Lolos |
| Build lokal setelah `.next` dihapus total | Lolos |
| `pnpm install --frozen-lockfile` | Lockfile sinkron |
| `next@16.2.2` di package.json vs terinstall | Sama |
| Jumlah salinan `next` di `node_modules` | Satu |
| `packageManager` di package.json | **Tidak ada** |

Penyebab terkuat: `experimental.optimizePackageImports: ["@tabler/icons-react"]` - satu-satunya
perubahan Turbopack-specific di deploy ini. Opsi itu memaksa Turbopack menganalisis seluruh barrel
package (ribuan export) dan **memanipulasi import map**. Import map yang rusak membuat resolver
gagal mencari `@vercel/turbopack-next/internal/font/google/font`, yaitu virtual module milik
Turbopack sendiri. Manifestasinya sebagai error font karena font loader juga di-resolve lewat
import map yang sama.

Mengapa hanya di Vercel: build lokal memakai Turbopack yang sama dan lolos, jadi ini
environmental - rusak karena konfigurasi di environment Vercel, bukan karena kode.

### Perbaikan

1. Hapus `experimental.optimizePackageImports`. Barrel `@tabler/icons-react` (65 file pemakai)
   tidak cocok untuk option ini.
2. Pin `packageManager: "pnpm@10.29.2"` di `package.json`. Sebelumnya field ini tidak ada,
   sehingga Vercel memakai pnpm default-nya yang bisa berbeda dari versi lokal.

### Belum terverifikasi

Perubahan ini **belum bisa dibuktikan di sisi Vercel** dari mesin ini. Kalau build masih gagal,
langkah berikutnya: pindahkan font ke `next/font/local` supaya build tidak bergantung pada
unduhan dari Google sama sekali.

### Catatan lanjutan

`@tabler/icons-react` masih dipakai di 65 file, `lucide-react` di 1 file. Konsolidasi icon yang
diklaim selesai di `docs/performance-plan.md` ternyata tidak terealisasi.

### Yang belum dikerjakan (perlu credential / keputusan)

- ~~`.env` masih berisi Supabase project yang sudah tidak hidup~~ — **sudah selesai 28 Sep 2026.**
  `.env` sudah menunjuk ke DB production `jhuazrfwbuimzuaktalb` (port 6543 + parameter pgbouncer),
  drift nol terhadap `prisma/schema.prisma`, dan data terbaca di runtime.
- **Password DB production belum dirotasi** — nilainya sempat tampil di riwayat chat. Perlu lewat
  Supabase Dashboard, lalu update `DATABASE_URL` + `SHADOW_DATABASE_URL` di `.env` (dan **restart
  `pnpm dev`**, karena Next.js memuat `.env` hanya sekali saat start).
- **`BETTER_AUTH_URL` di Vercel belum diverifikasi** — di `.env` lokal nilainya `http://localhost:3000`.
  Kalau Vercel juga begitu, login Google akan gagal karena callback URL salah.
- P1–P5 belum mulai.

