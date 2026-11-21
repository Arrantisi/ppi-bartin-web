# Admin Dashboard — Plan

## Status

status: done

## Overview

Panel admin penuh di bawah `/dashboard/*`. Fase 1 membuat overview berisi KPI dan antrean aksi. Fase 2 mengubah dashboard menjadi **benar-benar panel admin**. Fase 2.2 (perubahan saat ini) menambahkan kontrol tabel, kartu detail, dan identitas visual:

- Sidebar hanya menuju halaman `/dashboard/*`, tidak lagi ke `/home/*`. `/home` tetap untuk anggota biasa. Logo sidebar dashboard memakai aset PPI Bartin (`/logo-ppi-webp.webp`), bukan ikon generik.
- Akses **ADMIN saja**. `PENGURUS`, `BENDAHARA`, dan `USER` dialihkan ke `/home` baik di halaman maupun di server action.
- Halaman manajemen: user (ubah role, ban/unban, hapus permanen), event (hapus permanen, atur environment), berita (hapus permanen, publish/unpublish), tiket CS, dan keuangan — semuanya dirender di dalam shell `/dashboard`.
- Tabel user/event/berita memakai **filter dan pagination server-side**, maksimal **10 baris per halaman**, dengan navigasi Sebelumnya/Berikutnya di bawah tabel (query param `q`, `role`/`environment`, `page`).
- Tabel event/berita memakai `table-fixed` dengan lebar kolom persentase, teks panjang di-clamp/truncate, dan select selebar sel. `SidebarInset` serta wrapper konten dashboard memakai `min-w-0` agar konten tabel tidak mendorong halaman melebar — tidak ada scroll horizontal halaman.
- Navigasi tabel tidak hanya Sebelumnya/Berikutnya: `AdminTablePagination` menampilkan nomor halaman (halaman aktif ditandai `aria-current`), ellipsis untuk rentang panjang, dan tombol prev/next. Rumus derivasi ada di `getPaginationItems()` (`utils/admin-dashboard.ts`) dan punya unit test.
- Kartu detail event/berita dikunci dengan `overflow-x-hidden` + `min-w-0`; slug dipecah (`break-all`), badge dibatasi lebar, dan deskripsi `break-words` supaya dialog tidak bisa digeser horizontal.
- Dashboard overview diberi aksen warna tipis tetap memakai token: chip ikon KPI/system strip `bg-{success|warning|danger|info}/10`, batang grafik aktivitas `chart-3`/`chart-4`, kartu "Diperbarui" ber-border `accent/20`, dan badge antrean berwarna outline sesuai urgensi. Tidak ada hex/rigid warna baru.
- Setiap tabel memiliki menu **Customize Column** untuk menyembunyikan/menampilkan kolom data; kolom Aksi selalu terlihat dan minimal satu kolom data harus tetap aktif.
- Kolom **Aksi** dirapikan jadi satu tombol ellipsis (`AdminRowActions`): "Lihat detail", aksi khusus (ban/unban atau export peserta), lalu "Hapus" di menu yang sama. Konfirmasi hapus memakai mode controlled agar dialog tidak bertabrakan dengan dropdown.
- Klik judul pada baris atau menu **Lihat detail** membuka kartu dialog berisi informasi lengkap record. Detail diambil saat dibuka lewat server action ADMIN-only dan TanStack `useQuery`, bukan dikirim bersama daftar.
- Desain kartu dibedakan per entitas: **user** memakai grup "Identitas / Akun & akses / Aktivitas", **event** memakai hero statistik tanggal + kuota dengan progress bar dan seksi "Tentang acara / Metadata", **berita** memakai pratinjau artikel dengan blok ringkasan berkutipan, isi artikel, dan informasi publikasi.
- Dialog blokir user dapat mengisi `banReason` dan `banExpires` opsional; keduanya divalidasi Zod di server.
- Semua mutasi memakai server action ber-`TServerPrompt<T>` dengan role check, validasi Zod, dan dialog konfirmasi untuk aksi destruktif.

Fitur yang masih ditunda (butuh schema baru): audit trail, check-in QR, assignment tiket, broadcast history, dokumen anggota, WAJIB KAS.

## Database Model (Prisma)

Tidak ada model atau field baru untuk fitur admin. Model yang dipakai:

- `User` — `role`, `banned`, `banExpires`, `banReason`, `emailVerified`, `createdAt`, `angkatan`, `jurusan`, `fakultas`, `noTelephone`, `jenisKelamin`, `alamat`, `bio`, `statusPelajar`.
- `Events` + `Participants` + `CancelLog` — kuota, pendaftaran, `environment`, `lokasi`, `deskripsi`, `persyaratan`.
- `News` — `environment`, `ringkasan`, `desckripsi`, `updatedAt`.
- `CustomerService` + `CustomerServiceFile` — tiket dan lampiran.
- `NotificationSubscription`, `Session`, `Account`, `CalendarEntry` — agregat KPI dan cascade penghapusan user.

> ⚠️ `Events.creator`, `News.creator`, `Participants.user`, `CancelLog.user`, `Session.user`, `Account.user`, `NotificationSubscription.user`, dan `CalendarEntry.user` memakai `onDelete: Cascade`. `CustomerService.user` **tidak** punya cascade, jadi `deleteUser` menghapus tiket buatan target lebih dulu di dalam satu transaksi sebelum menghapus user, serta mengosongkan `readById`/`resolvedById` pada tiket yang ditangani target. UI konfirmasi menyebutkan cascading ini.
>
> File UploadThing (foto profil, gambar event/berita, lampiran tiket) ikut dibersihkan lewat `deleteUploadedFile()`. Kegagalan penghapusan file dicatat di log dan **tidak** membatalkan transaksi database; hal ini tercatat sebagai keterbatasan fase ini.

## Server Actions

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| getAdminDashboardSnapshot | server/data/admin-dashboard.ts | void | TAdminDashboardSnapshot | admin |
| getAdminUsers | server/data/admin-dashboard.ts | `(page, query, role)` | `TAdminTablePage<TAdminUserRow>` | admin |
| getAdminEvents | server/data/admin-dashboard.ts | `(page, query, environment)` | `TAdminTablePage<TAdminEventRow>` | admin |
| getAdminNews | server/data/admin-dashboard.ts | `(page, query, environment)` | `TAdminTablePage<TAdminNewsRow>` | admin |
| getAdminUserDetail | server/data/admin-dashboard.ts | `userId` | `TAdminUserDetail \| null` | admin |
| getAdminEventDetail | server/data/admin-dashboard.ts | `eventId` | `TAdminEventDetail \| null` | admin |
| getAdminNewsDetail | server/data/admin-dashboard.ts | `newsId` | `TAdminNewsDetail \| null` | admin |
| getAdminUserDetailAction | server/actions/admin-dashboard.ts | `userId` | `TServerPrompt<TAdminUserDetail \| null>` | admin |
| getAdminEventDetailAction | server/actions/admin-dashboard.ts | `eventId` | `TServerPrompt<TAdminEventDetail \| null>` | admin |
| getAdminNewsDetailAction | server/actions/admin-dashboard.ts | `newsId` | `TServerPrompt<TAdminNewsDetail \| null>` | admin |
| updateUserRole | server/actions/admin-dashboard.ts | UpdateUserRoleInput | TServerPrompt<void> | admin |
| setUserBan | server/actions/admin-dashboard.ts | SetUserBanInput | TServerPrompt<void> | admin |
| deleteUser | server/actions/admin-dashboard.ts | { userId: string } | TServerPrompt<void> | admin |
| setEventEnvironment | server/actions/admin-dashboard.ts | SetEventEnvironmentInput | TServerPrompt<void> | admin |
| deleteEvent | server/actions/admin-dashboard.ts | { eventId: string } | TServerPrompt<void> | admin |
| setNewsEnvironment | server/actions/admin-dashboard.ts | SetNewsEnvironmentInput | TServerPrompt<void> | admin |
| deleteNews | server/actions/admin-dashboard.ts | { newsId: string } | TServerPrompt<void> | admin |

Fungsi daftar `getAdminUsers/Events/News` di `server/data/` dibungkus `React.cache()`, melakukan role check, lalu menjalankan filter `contains` (case-insensitive) dan pagination di database. Halaman bertanggung jawab membaca query param; tabel menerima hasil page dan URL pagination. Tiga fungsi detail **tidak** memakai `React.cache()` karena dipanggil dari Server Action — hasil `null` dari pemanggilan sebelumnya tidak boleh terbawa ke kartu yang dibuka ulang. Detail dipanggil lewat server action ber-`TServerPrompt<T>` agar bisa dipakai client `useQuery` tanpa membawa Prisma ke bundle client. `useAdminDetail` memakai `staleTime: 0`, `gcTime: 0`, dan `refetchOnMount: "always"`; dialog menyediakan tombol **Muat ulang** saat error/empty. Semua aksi mutasi:

1. Memanggil `studentAccount()` + `getCurrentUserRole()`; hanya `"ADMIN"` yang lolos. Role lain mengembalikan `{ success: false, error: "Forbidden" }` (fail-closed).
2. Memvalidasi input dengan Zod dari `schemas/admin-dashboard.ts` via `safeParse`.
3. Menolak aksi terhadap akun sendiri (tidak bisa hapus/ban/demote diri sendiri); tombol di baris akun sendiri juga dinonaktifkan.
4. Menolak menurunkan/menghapus **ADMIN terakhir yang masih aktif** (`banned !== true`).
5. Menghapus tiket CS milik target sebelum `user.delete()`, lalu membersihkan file terkait di luar transaksi.
6. Mengembalikan `TServerPrompt<void>`; gagal → `{ success: false, error, fieldErrors? }`. `fieldErrors` ditampilkan sebagai toast `sonner`.

## Client Components

```
features/dashboard/
├── admin-dashboard-page.tsx              # Overview (Phase 1)
├── settings-page.tsx                     # Halaman pengaturan admin
└── components/
    ├── admin-kpi-grid.tsx
    ├── admin-action-queue.tsx
    ├── admin-trend-chart.tsx
    ├── admin-distribution-chart.tsx
    ├── admin-capacity-list.tsx
    ├── admin-quick-actions.tsx            # Link diubah ke /dashboard/*
    ├── admin-empty-state.tsx
    ├── admin-management-shell.tsx         # Header halaman manajemen + back link
    ├── admin-confirm-delete.tsx           # Dialog konfirmasi destruktif
    ├── admin-column-toggle.tsx            # Customize Column (DropdownMenuCheckboxItem)
    ├── admin-detail-dialog.tsx            # Kartu detail generik (loading/error/empty)
    ├── admin-users-table.tsx              # Tabel user + filter/pagination + kolom + detail + aksi
    ├── admin-events-table.tsx             # Tabel event + environment + export + detail + hapus
    ├── admin-news-table.tsx               # Tabel berita + publish + detail + hapus
    ├── admin-tickets-page.tsx             # Wrapper tiket memakai komponen CS admin
    └── admin-finance-page.tsx             # Wrapper finance
```

Ketiga tabel menerima `page: TAdminTablePage<T>` dari Server Component, mengirim ulang `q`/filter/`page` lewat `router.push()`, menampilkan maksimal 10 baris + navigasi di bawah tabel, dan menyimpan state visibilitas kolom secara lokal. Judul baris dan tombol **Detail** membuka `AdminDetailDialog` yang mengambil data lewat hook detail. `AdminUsersTable` juga menerima `currentUserId` untuk menonaktifkan aksi pada baris sendiri serta dialog blokir dengan alasan dan tanggal berakhir opsional.

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
hooks/use-admin-dashboard.ts               # useMutation + useQuery detail + sonner toast fieldErrors
schemas/admin-dashboard.ts                 # Zod schema untuk semua input mutasi
types/admin-dashboard.ts                   # Snapshot, TAdminTablePage<T>, baris, dan tipe detail
utils/admin-dashboard.ts                   # Pure helper (termasuk format tanggal lengkap)
server/data/admin-dashboard.ts             # Agregasi + tabel filter/pagination + detail (React.cache)
server/actions/admin-dashboard.ts          # Mutasi & detail ADMIN-only
components/skeletons/admin-dashboard-skeleton.tsx
components/sidebar/app-sidebar.tsx         # Semua menu → /dashboard/* + logo PPI Bartin
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

`DashboardLayout` diberi role check `ADMIN` sehingga seluruh subtree `/dashboard` terlindungi di satu tempat. Data `getAdmin*()` mengulang pengecekan, dan halaman overview juga memanggil `getCurrentUserRole()` secara eksplisit. Halaman manajemen lain bergantung pada role check layout + data function; server action selalu mengulang pengecekan (defense in depth).

## Security

- Siapa yang bisa mengakses (role check):
  - `app/(protected)/dashboard/layout.tsx`: `getCurrentUserRole() !== "ADMIN"` → `redirect("/home")`.
  - `getAdmin*()` dan halaman overview mengulang pengecekan.
  - Setiap server action, termasuk tiga action detail, memanggil `authorizeAdmin()`; role selain `ADMIN` mengembalikan `Forbidden`. `getCurrentUserRole()` yang error kembali `"USER"` sehingga fail-closed.
- Data apa yang boleh dilihat per role:
  - Hanya ADMIN. Tidak ada tampilan read-only untuk PENGURUS.
  - Tabel user hanya mengembalikan field yang dipakai UI (`id`, `name`, `email`, `username`, `nomorSiswa`, `role`, `banned`, `banExpires`, `createdAt`, `angkatan`, `fakultas`). `nomorSiswa` dipakai untuk pencarian. Tidak ada `password`, token, atau row `Account`/`Session` lengkap.
  - Kartu detail mengambil field tambahan milik ADMIN (telepon, alamat, bio, alasan blokir, deskripsi acara/berita) **hanya saat dibuka**, tetap tanpa password/token.
  - Tiket dan keuangan memakai komponen existing dengan batasan data yang sama seperti di `/home`.
- Validasi apa yang ada di server side:
  - Zod: role harus salah satu `USER|ADMIN|PENGURUS|BENDAHARA`; environment harus `local|preview|production`; `userId` berupa string alfanumerik 1–128 karakter karena dibuat Better Auth (32 karakter, **bukan** UUID) — memakai `z.uuid()` membuat semua detail/mutasi user gagal; `eventId`/`newsId` tetap wajib UUID sesuai `@default(uuid())` Prisma; query detail memakai `adminDetailIdSchema` (string 1–128 karakter, terpisah dari schema mutasi); `banReason` maks. 300 karakter; `banExpires` opsional dan harus di masa depan bila diisi.
  - Filter/pagination dinormalisasi di server: `page` dibatasi ≥ 1 dan ≤ total halaman; role/environment di luar enum diabaikan menjadi `ALL`.
  - Tidak boleh mengubah role/hapus/ban akun sendiri.
  - Tidak boleh menurunkan/menghapus ADMIN aktif terakhir; ADMIN yang `banned` tidak dihitung sebagai aktif.
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
- Font: Inter (teks), JetBrains Mono (data/angka, termasuk input tanggal blokir dan nilai kartu detail)
- Spacing 8px; tidak ada hardcode hex/rgb dan tidak ada shadow pada elemen statis

## Testing Checklist

- [ ] Happy path — ADMIN melihat link "Panel Admin" di sidebar `/home`, dropdown user, dan halaman Pengaturan Profil, lalu masuk ke `/dashboard`; sidebar dashboard memakai logo PPI Bartin dan semua menunya tetap di `/dashboard/*`.
- [ ] USER/PENGURUS/BENDAHARA tidak melihat link "Panel Admin" di ketiga tempat tersebut.
- [ ] Happy path — ADMIN mengubah role user → toast sukses → tabel/refetch berubah.
- [ ] Happy path — ADMIN memblokir user lewat dialog (alasan + tanggal berakhir opsional) → status dan antrean "Blokir akan berakhir" berubah; buka blokir menghapus keduanya.
- [ ] Happy path — ADMIN hapus user dengan konfirmasi → user, tiket, event/berita miliknya terhapus sesuai cascade/transaksi, file terkait dibersihkan.
- [ ] Happy path — ADMIN publish/unpublish berita & event → filter environment berubah.
- [ ] Happy path — ADMIN hapus event/berita dengan konfirmasi → row hilang dari tabel dan file gambar dibersihkan.
- [ ] Tabel — setiap halaman menampilkan maksimal 10 baris; navigasi Sebelumnya/Berikutnya di bawah tabel berfungsi dan info halaman sesuai total data.
- [ ] Customize Column — menu kolom menampilkan/menyembunyikan kolom data di ketiga tabel; kolom Aksi tetap ada dan tombol Reset filter mengembalikan keadaan awal.
- [ ] Kartu detail — klik judul baris/tombol Detail di user, event, dan berita menampilkan skeleton saat memuat lalu informasi lengkap; error/empty punya pesan jelas; non-ADMIN tidak bisa memanggil action detail.
- [ ] Kartu detail user menampilkan data (bukan "Data tidak ditemukan") untuk user dengan ID Better Auth non-UUID; kartu event punya statistik + progress bar kuota, kartu berita punya pratinjau artikel.
- [ ] Kartu yang pernah Gagal/Kosong harus bisa dimuat ulang dengan tombol **Muat ulang** (cache detail tidak menyimpan `null` antarpembukaan).
- [ ] Kolom Aksi di ketiga tabel hanya satu tombol ellipsis; menu berisi detail, aksi khusus, dan hapus; konfirmasi hapus tetap muncul dan aksi terhadap akun sendiri tetap disabled.
- [ ] Kartu detail event/berita tidak bisa digeser horizontal walau judul, slug, atau deskripsi sangat panjang.
- [ ] Navigasi tabel menampilkan nomor halaman + ellipsis; halaman aktif terbaca oleh pembaca layar; klik nomor berpindah halaman.
- [ ] Dashboard overview memiliki aksen warna dari token (chip KPI, grafik, badge antrean) tanpa warna hardcode.
- [ ] Unauthorized access → USER/PENGURUS/BENDAHARA membuka `/dashboard/*` → redirect `/home`.
- [ ] Unauthorized mutation → server action dipanggil langsung oleh non-ADMIN → `success: false` dengan error `Forbidden`, tidak ada perubahan DB.
- [ ] Self-protection → tombol role/blokir/hapus pada baris akun sendiri disabled; server juga menolak.
- [ ] Last-admin guard → ADMIN aktif terakhir tidak bisa diturunkan role-nya atau dihapus; ADMIN yang banned tidak dihitung.
- [ ] Input invalid → role/environment/id/tanggal invalid → `fieldErrors` muncul sebagai toast, DB tidak berubah.
- [ ] Empty state → tabel kosong menampilkan `text-disabled` + satu CTA reset filter.
- [ ] Loading → skeleton `/dashboard`, `/users`, `/events`, `/news`, `/tickets`, `/tickets/[id]`, `/finance`, `/acara/create`, `/berita/create`, dan `/settings` berbeda bentuk sesuai konten halamannya.
- [ ] Tidak ada data sensitif → response tidak memuat password/token/row `Account`.
- [x] Unit test util & validasi ID admin lolos (`__tests__/admin-dashboard.test.ts`, 24 test).
- [x] `pnpm lint` lolos.
- [x] `NODE_OPTIONS=--max-old-space-size=8192 pnpm exec tsc --noEmit` lolos.
- [x] `pnpm build` lolos (28 route terdaftar, termasuk seluruh `/dashboard/*`).

> Checklist role nyata dan destruktif masih perlu dicek manual dengan akun ADMIN sungguhan. Implementasi sudah memakai role gate berlapis, transaksi penghapusan, dan mencegah aksi terhadap akun sendiri/ADMIN aktif terakhir.
