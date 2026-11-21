# Admin Dashboard — Plan

## Status

status: done

## Overview

Panel admin penuh di bawah `/dashboard/*`. Fase 1 membuat overview berisi KPI dan antrean aksi. Fase 2 (perubahan saat ini) mengubah dashboard menjadi **benar-benar panel admin**:

- Sidebar hanya menuju halaman `/dashboard/*`, tidak lagi ke `/home/*`. `/home` tetap untuk anggota biasa.
- Akses **ADMIN saja**. `PENGURUS` dan `USER` dialihkan ke `/home` baik di halaman maupun di server action.
- Halaman manajemen: user (ubah role, ban/unban, hapus permanen), event (hapus permanen, atur environment), berita (hapus permanen, publish/unpublish), tiket CS, dan keuangan — semuanya dirender di dalam shell `/dashboard`.
- Semua mutasi memakai server action ber-`TServerPrompt<T>` dengan role check, validasi Zod, dan dialog konfirmasi untuk aksi destruktif.

Fitur yang masih ditunda (butuh schema baru): audit trail, check-in QR, assignment tiket, broadcast history, dokumen anggota, WAJIB KAS.

## Database Model (Prisma)

Tidak ada model atau field baru. Model yang dipakai:

- `User` — `role`, `banned`, `banExpires`, `banReason`, `emailVerified`, `createdAt`, `angkatan`, `jurusan`, `fakultas`.
- `Events` + `Participants` + `CancelLog` — kuota, pendaftaran, `environment`.
- `News` — `environment`, `updatedAt`.
- `CustomerService` + `CustomerServiceFile` — tiket dan lampiran.
- `NotificationSubscription`, `Session` — agregat KPI.

> ⚠️ `Events.creator` dan `News.creator` memakai `onDelete: Cascade`. Menghapus user akan ikut menghapus event dan berita yang dibuatnya (serta `Participants`/`CancelLog` terkait). UI konfirmasi harus menyebutkan ini. File UploadThing yang sudah terunggah tidak otomatis terhapus dari storage — dicatat sebagai keterbatasan fase ini.

## Server Actions

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| getAdminDashboardSnapshot | server/data/admin-dashboard.ts | void | TAdminDashboardSnapshot | admin |
| getAdminUsers | server/data/admin-dashboard.ts | void | TAdminUserRow[] | admin |
| getAdminEvents | server/data/admin-dashboard.ts | void | TAdminEventRow[] | admin |
| getAdminNews | server/data/admin-dashboard.ts | void | TAdminNewsRow[] | admin |
| updateUserRole | server/actions/admin-dashboard.ts | UpdateUserRoleInput | TServerPrompt<void> | admin |
| setUserBan | server/actions/admin-dashboard.ts | SetUserBanInput | TServerPrompt<void> | admin |
| deleteUser | server/actions/admin-dashboard.ts | { userId: string } | TServerPrompt<void> | admin |
| setEventEnvironment | server/actions/admin-dashboard.ts | SetEventEnvironmentInput | TServerPrompt<void> | admin |
| deleteEvent | server/actions/admin-dashboard.ts | { eventId: string } | TServerPrompt<void> | admin |
| setNewsEnvironment | server/actions/admin-dashboard.ts | SetNewsEnvironmentInput | TServerPrompt<void> | admin |
| deleteNews | server/actions/admin-dashboard.ts | { newsId: string } | TServerPrompt<void> | admin |

Semua fungsi `getAdmin*` adalah data function (bukan mutasi) dibungkus `React.cache()`. Semua aksi mutasi:

1. Memanggil `studentAccount()` + `getCurrentUserRole()`; hanya `"ADMIN"` yang lolos.
2. Memvalidasi input dengan Zod dari `schemas/admin-dashboard.ts` via `safeParse`.
3. Menolak aksi terhadap akun sendiri (tidak bisa hapus/ban/demote diri sendiri).
4. Menolak demote ADMIN terakhir yang masih aktif.
5. Mengembalikan `TServerPrompt<void>`; gagal → `{ success: false, error, fieldErrors? }`.

## Client Components

```
features/dashboard/
├── admin-dashboard-page.tsx              # Overview (Phase 1)
└── components/
    ├── admin-kpi-grid.tsx
    ├── admin-action-queue.tsx
    ├── admin-trend-chart.tsx
    ├── admin-distribution-chart.tsx
    ├── admin-capacity-list.tsx
    ├── admin-quick-actions.tsx            # Link diubah ke /dashboard/*
    ├── admin-empty-state.tsx
    ├── admin-users-table.tsx              # Tabel user + search/filter + aksi
    ├── admin-events-table.tsx             # Tabel event + environment + hapus
    ├── admin-news-table.tsx               # Tabel berita + publish + hapus
    ├── admin-tickets-page.tsx             # Wrapper tiket memakai komponen CS admin
    ├── admin-finance-page.tsx             # Wrapper finance
    └── admin-management-shell.tsx         # Header halaman manajemen + back link
```

Skeleton loading dibedakan per route agar tidak memakai satu bentuk untuk semua halaman:

```
components/skeletons/
├── admin-dashboard-skeleton.tsx      # /dashboard (KPI + grafik)
├── admin-management-skeleton.tsx     # Frame header umum halaman manajemen
├── admin-users-skeleton.tsx          # /dashboard/users
├── admin-events-skeleton.tsx         # /dashboard/events
├── admin-news-skeleton.tsx           # /dashboard/news
├── admin-tickets-skeleton.tsx        # /dashboard/tickets
├── admin-ticket-detail-skeleton.tsx  # /dashboard/tickets/[id]
├── admin-finance-skeleton.tsx        # /dashboard/finance
├── admin-event-create-skeleton.tsx   # /dashboard/acara/create
├── admin-news-create-skeleton.tsx    # /dashboard/berita/create
└── admin-settings-skeleton.tsx       # /dashboard/settings
```

Setiap folder route memiliki `loading.tsx` sendiri yang merender skeleton tersebut.

File pendukung di root (sesuai `AGENTS.md` §4):

```
hooks/use-admin-dashboard.ts               # useQuery/useMutation + invalidateQueries
schemas/admin-dashboard.ts                 # Zod schema untuk semua input mutasi
types/admin-dashboard.ts                   # Snapshot + tipe baris tabel
utils/admin-dashboard.ts                   # Pure helper (sudah ada)
server/data/admin-dashboard.ts             # Agregasi + data tabel (React.cache)
server/actions/admin-dashboard.ts          # Mutasi ADMIN-only
components/skeletons/admin-dashboard-skeleton.tsx
components/sidebar/app-sidebar.tsx         # Semua menu → /dashboard/*
components/button-user.tsx                 # Dropdown: "Panel Admin" hanya untuk ADMIN
components/shared/navigation/nav-main-event.tsx # Sidebar/bottom nav /home: link Panel Admin
features/account/profile/tab-pengaturan.tsx     # Pengaturan: baris Panel Admin untuk ADMIN
```

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| /dashboard | ADMIN | DashboardLayout (existing) |
| /dashboard/users | ADMIN | DashboardLayout |
| /dashboard/events | ADMIN | DashboardLayout |
| /dashboard/acara/create | ADMIN | DashboardLayout |
| /dashboard/news | ADMIN | DashboardLayout |
| /dashboard/berita/create | ADMIN | DashboardLayout |
| /dashboard/tickets | ADMIN | DashboardLayout |
| /dashboard/tickets/[id] | ADMIN | DashboardLayout |
| /dashboard/finance | ADMIN | DashboardLayout |
| /dashboard/settings | ADMIN | DashboardLayout |

`DashboardLayout` diberi role check `ADMIN` sehingga seluruh subtree `/dashboard` terlindungi di satu tempat. Server Component tiap halaman dan semua server action tetap mengulang pengecekan (defense in depth).

## Security

- Siapa yang bisa mengakses (role check):
  - `app/(protected)/dashboard/layout.tsx`: `getCurrentUserRole() !== "ADMIN"` → `redirect("/home")`.
  - Server Component halaman dan `getAdmin*()` mengulang pengecekan.
  - Setiap server action mutasi memanggil `authorizeAdmin()` yang melempar `Error("Forbidden")` untuk role selain `ADMIN`; `getCurrentUserRole()` yang error kembali `"USER"` sehingga fail-closed.
- Data apa yang boleh dilihat per role:
  - Hanya ADMIN. Tidak ada tampilan read-only untuk PENGURUS.
  - Tabel user hanya mengembalikan field yang dipakai UI (`id`, `name`, `email`, `username`, `role`, `banned`, `banExpires`, `createdAt`, `angkatan`, `fakultas`). Tidak ada `password`, token, atau row `Account`/`Session` lengkap.
  - Tiket dan keuangan memakai komponen existing dengan batasan data yang sama seperti di `/home`.
- Validasi apa yang ada di server side:
  - Zod: role harus salah satu `USER|ADMIN|PENGURUS|BENDAHARA`; environment harus `local|preview|production`; id wajib UUID/cuid sesuai model; `banExpires` opsional dan harus di masa depan bila diisi.
  - Tidak boleh mengubah role/hapus/ban akun sendiri.
  - Tidak boleh menurunkan role ADMIN terakhir.
  - `fieldErrors` dari Zod diteruskan ke `TServerPrompt` dan ditampilkan sebagai `sonner` toast.

## Design Tokens

CSS variables yang dipakai (contoh: `--primary`, `--muted`, dll):

- `--background`, `--foreground`, `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--muted`, `--muted-foreground`
- `--border`, `--input`, `--ring`
- `--success`, `--warning`, `--danger`, `--info` — badge status outline, bukan fill
- `--danger` untuk tombol destruktif, tetap memakai variant `destructive` yang sudah ada
- `--disabled` / `text-disabled` untuk empty state
- Font: Inter (teks), JetBrains Mono (data/angka)
- Spacing 8px; tidak ada hardcode hex/rgb dan tidak ada shadow pada elemen statis

## Testing Checklist

- [ ] Happy path — ADMIN melihat link "Panel Admin" di sidebar `/home`, dropdown user, dan halaman Pengaturan Profil, lalu masuk ke `/dashboard`; semua menu sidebar tetap di `/dashboard/*`.
- [ ] USER/PENGURUS tidak melihat link "Panel Admin" di ketiga tempat tersebut.
- [ ] Happy path — ADMIN mengubah role user → toast sukses → tabel/refetch berubah.
- [ ] Happy path — ADMIN ban/unban user → status berubah.
- [ ] Happy path — ADMIN hapus user dengan konfirmasi → user dan event/berita miliknya terhapus sesuai cascade.
- [ ] Happy path — ADMIN publish/unpublish berita & event → filter environment berubah.
- [ ] Happy path — ADMIN hapus event/berita dengan konfirmasi → row hilang dari tabel.
- [ ] Unauthorized access → USER/PENGURUS membuka `/dashboard/*` → redirect `/home`.
- [ ] Unauthorized mutation → server action dipanggil langsung oleh non-ADMIN → `success: false` / Forbidden, tidak ada perubahan DB.
- [ ] Self-protection → ADMIN tidak bisa hapus/ban/demote akun sendiri.
- [ ] Last-admin guard → ADMIN terakhir tidak bisa diturunkan role-nya.
- [ ] Input invalid → role/environment/id invalid → `fieldErrors` muncul sebagai toast, DB tidak berubah.
- [ ] Empty state → tabel kosong menampilkan `text-disabled` + satu CTA.
- [ ] Loading → skeleton `/dashboard`, `/users`, `/events`, `/news`, `/tickets`, `/tickets/[id]`, `/finance`, `/acara/create`, `/berita/create`, dan `/settings` berbeda bentuk sesuai konten halamannya.
- [ ] Tidak ada data sensitif → response tidak memuat password/token/row `Account`.
- [x] Unit test util lama tetap lolos (`__tests__/admin-dashboard.test.ts`).
- [x] `pnpm lint` lolos.
- [x] `NODE_OPTIONS=--max-old-space-size=8192 pnpm exec tsc --noEmit` lolos.
- [x] `pnpm build` lolos (28 route terdaftar, termasuk seluruh `/dashboard/*`).

> Checklist role nyata dan destruktif masih perlu dicek manual dengan akun ADMIN sungguhan. Implementasi sudah memakai role gate berlapis dan mencegah aksi terhadap akun sendiri/ADMIN terakhir.
