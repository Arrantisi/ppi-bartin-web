# Financial Dashboard — Plan

## Overview

Menampilkan laporan keuangan PPI Bartın secara transparan dengan sinkronisasi dua arah antara dashboard web dan Google Sheets. Google Sheets tetap menjadi *single source of truth* agar bendahara bisa terus bekerja di spreadsheet, sementara anggota melihat ringkasan pemasukan, pengeluaran, dan saldo tanpa membuka Sheets. Sebelumnya `components/sections/finance-section.tsx` hanya berisi placeholder "Upcoming" / "Menunggu Peluncuran", jadi tidak ada akses laporan yang terstruktur.

Stack: Next.js App Router, TypeScript, `googleapis`, TanStack Query, Shadcn UI, Tailwind CSS, Vercel, Better Auth.

**Keputusan sudah dikonfirmasi:** dashboard ditempatkan di `/home/finance` dengan `HomeLayoutComponent`; role penulis adalah `BENDAHARA` baru (perlu migrasi enum `Role`), dengan `ADMIN` tetap diizinkan sebagai superuser; konflik edit memakai *last-write-wins*; `DELETE` mengosongkan nilai baris via `values.clear` daripada menghapus baris fisik agar `rowNumber` tetap stabil.

### Rollout bertahap

- **Phase 1 — Quick link (sudah diimplementasikan):** `FinanceSection` dipasang di `app/page.tsx` antara `Hero` dan `Footer`, dengan akses dari nav `/#finance` dan footer. Shortcut serupa juga dipasang di portal `/home` lewat `features/home/finance-shortcut.tsx`. Tombol membuka URL Google Sheets dari env `NEXT_PUBLIC_FINANCE_SHEET_URL` dengan `target="_blank" rel="noopener noreferrer"`; render-nya dipisah ke client component `components/shared/finance-sheet-link.tsx` agar prop elemen `<a>` tidak melintas dari Server Component ke Client Component. Env bersifat opsional agar build tetap lolos sebelum link dari bendahara tersedia; jika kosong, tombol fallback "Menunggu Peluncuran" dalam keadaan disabled. Perlu deploy setelah `NEXT_PUBLIC_FINANCE_SHEET_URL` diisi di Vercel.
- **Phase 2 — Google Cloud & Sheet (sedang dikerjakan):**
  - Buat/aktifkan project GCP `ppi-bartin-finance` dan aktifkan Google Sheets API.
  - Buat Service Account, download key JSON, catat `client_email` dan `private_key`.
  - *Share* spreadsheet ke `client_email` sebagai **Editor**.
  - Catat `SPREADSHEET_ID` dari URL sheet sebagai `GOOGLE_SHEET_ID`.
  - Finalisasi struktur kolom (posisi tidak diubah lagi) dan kirim contoh 3 baris ke agent.
- **Phase 3 — Backend:** `pnpm add googleapis`; helper `lib/google-sheets.ts`; env didaftarkan di `lib/env/index.ts` **dan** `.env.example`; Zod schema di `schemas/finance.ts`; tipe di `types/finance.ts`; server action + route handler `GET`.
- **Phase 4 — Frontend:** dashboard di `features/finance/`, hook `hooks/use-finance.ts`, `useQuery` dengan `refetchInterval: 5000` hanya saat tab aktif dan cache server ~30 detik untuk menjaga kuota Google Sheets API; `useMutation` + `invalidateQueries` untuk tulisan dari web.
- **Phase 5 — Testing & migrasi:** uji sinkronisasi dua arah, deploy + verifikasi env produksi, lalu tombol Phase 1 diganti navigasi ke `/home/finance`.

### File pendukung di luar `features/`

`lib/google-sheets.ts`, `lib/env/index.ts` (sudah ditambah `NEXT_PUBLIC_FINANCE_SHEET_URL`), `.env.example` (sudah dibuat), `prisma/schema.prisma` (enum `Role` + `BENDAHARA`), `schemas/finance.ts`, `types/finance.ts`, `hooks/use-finance.ts`, `app/api/finance/route.ts`, `app/(protected)/home/finance/page.tsx`, `components/skeletons/finance-skeleton.tsx`, dan update `docs/file-placement.md` saat kode dibuat. `components/sections/finance-section.tsx` sudah dimodifikasi untuk Phase 1.

## Database Model (Prisma)

Tidak ada model Prisma baru. Google Sheets adalah satu-satunya penyimpanan transaksi, jadi tidak ada tabel/relasi baru dan tidak ada migrasi schema untuk data keuangan.

Role check memakai enum `Role` pada `prisma/schema.prisma` melalui kolom `User.role`. Perlu ditambah nilai `BENDAHARA` (migrasi Prisma) sebelum implementasi. Penulis transaksi adalah `BENDAHARA`, dengan `ADMIN` sebagai superuser. Tidak ada tabel keuangan baru.

Kontrak data sementara (menyesuaikan contoh sheet yang belum diterima):

```ts
TFinanceTransaction = {
  rowNumber: number;     // baris Sheets, 1-based (header = baris 1)
  tanggal: string;       // ISO yyyy-MM-dd
  keterangan: string;
  pemasukan: number;     // 0 jika tidak ada
  pengeluaran: number;   // 0 jika tidak ada
  saldo: number;
};

TFinanceSnapshot = {
  transactions: TFinanceTransaction[];
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoAkhir: number;
  updatedAt: string;     // ISO datetime
};
```

## Server Actions

Semua action memakai `"use server"`, memvalidasi input dengan Zod di server, dan mengembalikan `TServerPrompt<T>` sesuai `types/index.ts`.

| Action | Path | Input | Output | Auth |
| --- | --- | --- | --- | --- |
| getFinanceSnapshot | server/actions/finance.ts | `void` | `TServerPrompt<TFinanceSnapshot>` | student |
| createFinanceTransaction | server/actions/finance.ts | `CreateFinanceTransactionSchema` | `TServerPrompt<TFinanceTransaction>` | BENDAHARA/ADMIN |
| updateFinanceTransaction | server/actions/finance.ts | `UpdateFinanceTransactionSchema` | `TServerPrompt<TFinanceTransaction>` | BENDAHARA/ADMIN |
| deleteFinanceTransaction | server/actions/finance.ts | `DeleteFinanceTransactionSchema` | `TServerPrompt<void>` | BENDAHARA/ADMIN |

- `app/api/finance/route.ts` hanya menangani `GET` untuk polling `useQuery` dan mengembalikan `TFinanceSnapshot` sebagai JSON HTTP (bukan `TServerPrompt`). `POST`/`PUT`/`DELETE` tidak dipakai di route handler — semuanya lewat server action di atas.
- `CreateFinanceTransactionSchema` / `UpdateFinanceTransactionSchema`: `tanggal` (ISO date), `keterangan` (min. 2 karakter), `pemasukan` dan `pengeluaran` (`number` non-negatif, salah satu harus > 0). `UpdateFinanceTransactionSchema` menambahkan `rowNumber` (int positif). `DeleteFinanceTransactionSchema`: `rowNumber` (int positif) yang diverifikasi masih ada di sheet sebelum `values.clear`.
- Setiap mutasi: cek role lebih dulu → `safeParse` → tulis ke Sheets → kembalikan hanya field yang dibutuhkan client (jangan mengembalikan kredensial atau row mentah dari API).

## Client Components

Daftar file di `features/finance/`:

- `finance-page.tsx` — wrapper halaman (server component ringan) yang memakai `HomeLayoutComponent`.
- `components/finance-dashboard.tsx` — orkestrasi `useQuery` polling, summary, tabel, dan aksi admin.
- `components/finance-summary-cards.tsx` — kartu Total Pemasukan, Total Pengeluaran, Saldo Akhir.
- `components/finance-data-table.tsx` — tabel riwayat mutasi dengan `@tanstack/react-table`, pencarian/filter, dan pagination.
- `components/finance-columns.tsx` — definisi kolom tabel (termasuk kolom aksi edit/hapus untuk admin).
- `components/finance-transaction-form.tsx` — form tambah/edit dengan `@tanstack/react-form` + `components/ui/field`.
- `components/finance-action-dialog.tsx` — dialog/drawer untuk form tambah & edit (admin).
- `components/finance-delete-dialog.tsx` — konfirmasi hapus via `AlertDialog`, bukan `confirm()` native.
- `components/finance-empty-state.tsx` — empty state `text-disabled` terpusat + satu CTA.

Shared pendukung: `hooks/use-finance.ts` (`useQuery` + `useMutation` dengan `invalidateQueries` pada key `["finance"]`), `types/finance.ts`, `schemas/finance.ts`, dan `components/skeletons/finance-skeleton.tsx`.

## Routes

| URL | Akses | Layout |
| --- | --- | --- |
| `/` (section `#finance`) | public | Landing page — tombol Phase 1 membuka `NEXT_PUBLIC_FINANCE_SHEET_URL` |
| `/home` | student | HomeLayoutComponent — shortcut laporan keuangan di `HomeContent` |
| `/home/finance` | student | HomeLayoutComponent |
| `/api/finance` | student (GET) | Route Handler (JSON, dipakai `useQuery`) |

Setelah Phase 5, tombol di landing page diganti `Link` ke `/home/finance`.

## Security

- **Auth check di server:** `getFinanceSnapshot()` dan route handler `GET` memanggil `studentAccount()`; jika belum login → redirect ke halaman login. Server action mutasi memanggil `getCurrentUserRole()` dan hanya mengizinkan `BENDAHARA` / `ADMIN`. Karena `getCurrentUserRole()` mengembalikan `"USER"` saat error, perlakunya tetap **fail-closed** (ditolak).
- **Role-based UI:** tombol tambah/edit/hapus hanya dirender untuk `BENDAHARA`/`ADMIN` (via `hooks/use-current-role.ts`), tapi penyembunyian UI bukan pengganti pengecekan di server.
- **Ownership:** data bersifat organisasi, bukan milik per user — tidak ada ownership check, tetapi role check wajib pada setiap mutasi.
- **Validasi server side:** semua input melewati Zod di `schemas/finance.ts`; `rowNumber` harus int positif dan diverifikasi terhadap daftar baris yang sedang dibaca sebelum update/clear.
- **Formula injection:** string dari user yang diawali `=`, `+`, `-`, atau `@` diawali `'` sebelum ditulis ke Sheets.
- **Kredensial:** `GOOGLE_PRIVATE_KEY` dan `GOOGLE_CLIENT_EMAIL` hanya diakses lewat `env` dari `lib/env/index.ts`, tidak pernah dikirim ke client atau dikembalikan dari action. Service account diberi akses **Editor** hanya pada sheet ini; akun user tidak diberi akses tulis ke Sheets.
- **Error handling:** action mengembalikan pesan generik via `TServerPrompt` (tanpa stack trace), client menampilkan `sonner` toast.

## Design Tokens

- Warna: `--bg`, `--surface`, `--border`, `--text-primary`, `--text-secondary`, `--text-disabled`, `--accent`, `--success`, `--danger`, `--warning`, `--info`. Status badge memakai token status dengan gaya **outline**, tanpa *fill*.
- Font: `--font-sans` (Inter) untuk teks, `--font-mono` (JetBrains Mono) untuk angka, tanggal, dan `rowNumber`.
- Spacing: kelipatan 8px lewat `--space-sm` (8px), `--space-md` (16px), `--space-lg` (24px), `--space-xl` (32px).
- Radius: `--radius-card`, `--radius-control`, `--radius-chip`.
- Shadow: tidak ada shadow pada elemen statis (token shadow bernilai `none`).
- Type scale: `title-satu`, `title-tiga`, `body`, `subheadline`, `footnote` sesuai kelas yang sudah ada.
- Komponen: Button 4 variant (`primary`, `outline`, `ghost`, `destructive`), Card variant B (content-led), skeleton di `components/skeletons/`, empty state `text-disabled` terpusat + satu CTA.

## Testing Checklist

- [ ] **Phase 1:** dengan `NEXT_PUBLIC_FINANCE_SHEET_URL` terisi, tombol "Lihat Laporan Keuangan" muncul di landing page **dan** portal `/home`, serta membuka sheet di tab baru; tanpa env, tombol fallback disabled muncul tanpa error build.
- [ ] **Role BENDAHARA:** enum Prisma sudah dimigrasi; user `BENDAHARA` (dan `ADMIN`) bisa CRUD, role lain ditolak.
- [ ] **Happy path — read:** sheet berisi data → tabel dan 3 kartu summary tampil, angka sesuai perhitungan baris.
- [ ] **Happy path — create:** admin tambah transaksi → baris baru muncul di Sheets dan di dashboard setelah `invalidateQueries`.
- [ ] **Happy path — update:** admin edit `rowNumber` tertentu → hanya baris itu berubah di Sheets, baris lain tidak bergeser.
- [ ] **Happy path — delete:** admin hapus → nilai baris dikosongkan, `rowNumber` lain tetap stabil.
- [ ] **Unauthorized access → redirect:** belum login mengakses `/home/finance` → redirect ke login; role `USER` tidak melihat tombol CRUD dan server action tetap menolak dengan `success: false`.
- [ ] **Input invalid → error message muncul:** tanggal salah, keterangan kosong, atau kedua nominal 0 → `fieldErrors` muncul di field dan toast `sonner`.
- [ ] **Empty state → tampil dengan benar:** sheet kosong → teks "Belum ada transaksi" dengan `text-disabled` terpusat + satu CTA untuk admin.
- [ ] **Sinkronisasi arah 1:** edit langsung di Google Sheets → dashboard berubah otomatis dalam ~5 detik.
- [ ] **Sinkronisasi arah 2:** input dari dashboard → baris muncul di Sheets dengan format rapi.
- [ ] **Kuota & polling:** beberapa user bersamaan tidak menghasilkan 429 dari Google Sheets API.
- [ ] **Environment:** `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `NEXT_PUBLIC_FINANCE_SHEET_URL` terdaftar di `lib/env/index.ts` + `.env.example` dan tidak bocor ke client bundle.
- [ ] **Verifikasi wajib:** `pnpm lint` lalu `pnpm build` lolos; smoke test produksi `pnpm build && PORT=3111 pnpm start` + `curl` ke `/home/finance` tidak menghasilkan 500.
