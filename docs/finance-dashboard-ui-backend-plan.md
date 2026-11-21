# Financial Dashboard UI/UX & Backend — Plan

> status: done (implementasi selesai; verifikasi produksi menunggu kredensial Google Sheets)

## Overview

Rencana implementasi lanjutan Phase 3–4 untuk `Financial Dashboard`. Tujuannya: pengguna login bisa melihat ringkasan dan riwayat transaksi keuangan langsung dari Google Sheets, tanpa membuka spreadsheet. Bendahara (`BENDAHARA`) dan `ADMIN` bisa menambah, mengedit, dan menghapus transaksi dari dashboard; perubahan ditulis kembali ke tab `BUKU BESAR KEUANGAN`, lalu tab `DASHBOARD` milik bendahara yang menghitung ulang.

File plan ini melengkapi `docs/ppi_bartin_financial_dashboard_plan.md` dengan detail **tampilan**, **interaksi**, dan **alur backend** sebelum kode ditulis.

Catatan implementasi: skrip `build` di `package.json` menaikkan `NODE_OPTIONS=--max-old-space-size=8192` karena tipe dari `googleapis` membuat pemeriksaan tipe Next.js kehabisan memori pada batas default 2 GB. Prasyarat eksternal yang masih menunggu admin: env `GOOGLE_*`, sheet dibagikan ke service account, migrasi `BENDAHARA` di database produksi, dan email user bendahara.

Keputusan yang dipakai:

- Protected route `/home/finance` dengan `HomeLayoutComponent`.
- Role penulis: `BENDAHARA` + `ADMIN`; role lain hanya read-only.
- Email bendahara belum ditentukan → enum sudah disiapkan, update user menyusul.
- KPI fallback dihitung dari buku besar sampai alamat sel `DASHBOARD` dikirim.
- Total TRY dan IDR ditampilkan terpisah, tanpa konversi.
- Tab `WAJIB KAS` tidak masuk v1.
- Hapus = `values.clear` pada baris, bukan delete baris fisik.
- Mode dummy: `FINANCE_USE_DUMMY_DATA="true"` membuat dashboard menampilkan data contoh berlabel. Mode ini **read-only** — semua mutasi ditolak. Dipakai hanya untuk preview sebelum kredensial Google tersedia.

## Database Model (Prisma)

Tidak ada model transaksi baru. Google Sheets tetap menjadi satu-satunya storage untuk data keuangan.

Perubahan Prisma yang sudah disiapkan:

```prisma
enum Role {
  USER
  ADMIN
  PENGURUS
  BENDAHARA
}
```

Migrasi: `prisma/migrations/20261119000000_add_bendahara_role/migration.sql` berisi `ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'BENDAHARA';`. Migrasi **belum dijalankan ke database**; akan dijalankan sebelum deploy lewat `pnpm exec prisma migrate deploy`.

Tidak ada tabel `FinanceTransaction`, tidak ada relasi baru, dan tidak ada kolom baru di `User`. Role diambil dari `User.role` lewat `getCurrentUserRole()`.

## Server Actions

Pemisahan tanggung jawab:

- `server/data/finance.ts` — **read only**. Memanggil Sheets, parsing, menghitung total, dan mengembalikan `TFinanceSnapshot`. Dipakai oleh route `GET` dan server component. Dibungkus `React.cache()` agar pemanggilan berulang dalam satu request tidak menggandakan kuota API.
- `server/actions/finance.ts` — **mutasi only**. Semua action memakai `"use server"`, cek role lebih dulu, validasi Zod, tulis ke Sheets, lalu mengembalikan `TServerPrompt<T>` sesuai `types/index.ts`.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| createFinanceTransaction | server/actions/finance.ts | `CreateFinanceTransactionSchema` | `TServerPrompt<TFinanceTransaction>` | BENDAHARA/ADMIN |
| updateFinanceTransaction | server/actions/finance.ts | `UpdateFinanceTransactionSchema` | `TServerPrompt<TFinanceTransaction>` | BENDAHARA/ADMIN |
| deleteFinanceTransaction | server/actions/finance.ts | `DeleteFinanceTransactionSchema` | `TServerPrompt<void>` | BENDAHARA/ADMIN |

Fungsi baca (bukan action, tidak mengembalikan `TServerPrompt`):

| Fungsi | Path | Input | Output | Auth |
| --- | --- | --- | --- | --- |
| getFinanceSnapshot | server/data/finance.ts | `void` | `TFinanceSnapshot` | student |

Jika `FINANCE_USE_DUMMY_DATA="true"`, `getFinanceSnapshot()` mengembalikan `TFinanceSnapshot` dari data contoh lokal tanpa memanggil Google API. Ketiga action di atas menolak semua mutasi dengan pesan "Mode data contoh: perubahan tidak disimpan" **sebelum** role check dan validasi, supaya tidak ada penulisan ke Sheets saat preview.

### Alur backend

1. `GET /api/finance` → `studentAccount()` → `getFinanceSnapshot()`.
2. `getFinanceSnapshot()` → `lib/google-sheets.ts` → `values.batchGet` untuk:
   - `BUKU BESAR KEUANGAN!A7:O` (data transaksi);
   - `DASHBOARD!A1:Z80` (cadangan KPI, belum diparse sampai alamat sel tersedia).
3. `parseFinanceSheetValues` atau `parseFinanceRows` mengubah baris menjadi `TFinanceTransaction[]`.
4. `computeFinanceTotals` menghitung 6 angka: pemasukan/pengeluaran/saldo untuk IDR dan TRY.
5. Response normal: `{ transactions, totals, kpiSource: "fallback", updatedAt }`. Response mode dummy: `kpiSource: "dummy"` dengan struktur sama.
6. Mutasi:
   - `create` → validasi → `buildFinanceSheetRow` → `values.append` ke `BUKU BESAR KEUANGAN!A7:O` dengan `USER_ENTERED` + `INSERT_ROWS`.
   - `update` → verifikasi `rowNumber` masih ada → `values.update` ke `A{row}:O{row}`.
   - `delete` → verifikasi `rowNumber` masih ada → `values.clear` pada `A{row}:O{row}`.
7. Client `invalidateQueries(["finance"])` setelah mutasi sukses; **tanpa optimistic update** supaya UI tidak menampilkan angka yang belum pasti tersimpan di Sheets.

### `lib/google-sheets.ts`

- Singleton lazy dengan `google-auth-library`/`googleapis` (depends on `pnpm add googleapis`).
- Scope: `https://www.googleapis.com/auth/spreadsheets`.
- Kredensial dari `env.GOOGLE_CLIENT_EMAIL` + `env.GOOGLE_PRIVATE_KEY`; newline literal `\\n` dinormalisasi jadi `\n`.
- Validasi env dilakukan **saat fungsi dipanggil**, bukan saat module diimpor, agar build tetap lolos sebelum env production diisi.
- Fungsi: `getFinanceValues()`, `appendFinanceRow()`, `updateFinanceRow()`, `clearFinanceRow()`.
- Daftar range read-only dipusatkan: `DASHBOARD` dan `WAJIB KAS` tidak pernah jadi target tulis.
- Error Google API diterjemahkan ke pesan generik; detail tidak dikembalikan ke client.

## Client Components

Daftar file yang akan dibuat di `features/finance/`:

```
features/finance/
├── finance-page.tsx                      # wrapper server component + HomeLayoutComponent
└── components/
    ├── finance-dashboard.tsx             # orkestrasi query, filter, dialog
    ├── finance-summary-cards.tsx         # 6 kartu KPI (IDR + TRY)
    ├── finance-toolbar.tsx               # search + filter + tombol Tambah
    ├── finance-data-table.tsx            # tabel riwayat + pagination
    ├── finance-columns.tsx               # definisi kolom @tanstack/react-table
    ├── finance-transaction-form.tsx      # form tambah/edit
    ├── finance-action-dialog.tsx         # Dialog tambah/edit
    ├── finance-delete-dialog.tsx         # AlertDialog konfirmasi hapus
    └── finance-empty-state.tsx           # empty state terpusat + satu CTA
```

Shared pendukung:

- `hooks/use-finance.ts` — `useQuery` + 3 `useMutation`.
- `hooks/use-current-role.ts` — cek role untuk menampilkan/menyembunyikan tombol CRUD (jika belum ada, dibuat di root `hooks/`).
- `types/finance.ts`, `schemas/finance.ts`, `utils/finance-parser.ts` — sudah dibuat.
- `components/skeletons/finance-skeleton.tsx` — skeleton kartu + baris tabel.
- `app/api/finance/route.ts` — route `GET`.

### UI/UX — Layout halaman

```
/home/finance
┌───────────────────────────────────────────────────────────────┐
│ Keuangan PPI Bartın                              [Sinkron 5s] │
│ Sumber data: DKE - DATA KEUANGAN KESELURUHAN PPI BARTIN      │
│ Diperbarui: 19 Nov 2026, 18:12                               │
├───────────────────────────────────────────────────────────────┤
│ [Pemasukan IDR] [Pengeluaran IDR] [Saldo IDR]                 │
│ [Pemasukan TRY] [Pengeluaran TRY] [Saldo TRY]                 │
├───────────────────────────────────────────────────────────────┤
│ [Cari...] [Kategori ▾] [Arus ▾] [Mata uang ▾] [+ Transaksi]  │
├───────────────────────────────────────────────────────────────┤
│ NO | TANGGAL | KETERANGAN | KATEGORI | ARUS | MU | NOMINAL | ⋯│
│ 1  | 15/03/26 | Hibah PPI Turki | Sponsorship | Debit | TRY | ₺490 | ✎ 🗑│
│ 2  | 18/03/26 | Dana SUKA IDR | Dana SUKA | Debit | IDR | Rp10.242.331 | ✎ 🗑│
│ ...                                                           │
│                                       [<] [1] [2] [>]          │
└───────────────────────────────────────────────────────────────┘
```

- Desktop: 3 kolom kartu; mobile: 1 kolom, toolbar wraps, tabel horizontal scroll.
- Angka memakai `--font-mono`; label memakai `--font-sans`.
- Badge `Debit`/`Kredit`, `TRY`/`IDR` berupa **outline**, bukan fill.
- Status sinkronisasi memakai ikon + teks, bukan warna saja.
- `rowNumber` tidak ditampilkan sebagai kolom utama, tapi tersimpan di row data dan dipakai edit/hapus.

### UI/UX — State

| State | Perlakuan |
| --- | --- |
| Loading | `FinanceSkeleton`: 6 kartu abu + 5 baris tabel shimmer. |
| Empty | Teks "Belum ada transaksi" di tengah, `text-disabled`, + 1 CTA. CTA = "Tambah transaksi pertama" untuk BENDAHARA/ADMIN, "Buka Google Sheets" untuk role lain. |
| Error | Alert inline di atas tabel + tombol "Coba lagi"; toast `sonner` untuk kegagalan mutasi. |
| Stale | Badge "Memperbarui…" saat `isFetching && !isLoading`, tanpa menghilangkan data lama. |
| Success mutate | Toast "Transaksi tersimpan", query di-invalidate, dialog ditutup. |
| Demo (`kpiSource === "dummy"`) | Badge outline "Data contoh" di header, tombol CRUD dan refresh disembunyikan, polling dimatikan. |

### UI/UX — Form tambah/edit

Field urutan dan perilaku:

1. `Tanggal` — date picker (dynamic import via `next/dynamic`), default hari ini saat create.
2. `Keterangan` — textarea pendek, min 2 karakter.
3. `Kategori` — text input + `datalist` dari kategori unik di data yang sudah ada (tidak hardcode).
4. `Arus Kas` — pilihan `Debit` / `Kredit`.
5. `Mata Uang` — pilihan `TRY` / `IDR`; mengubah label nominal jadi `Nominal (TRY)` atau `Nominal (IDR)`.
6. `Nominal` — numeric input, selalu > 0 untuk mata uang terpilih; field lawannya auto 0.
7. `Metode Transaksi` — `Cash` / `Transfer`.
8. `Penanggung Jawab` — text input + datalist dari data existing.
9. `Rekening Penampung` — text input + datalist dari data existing.
10. `Penerima` / `Pengirim` — opsional.
11. `Tautan Dokumen` — URL `http(s)` opsional; ditolak kalau bukan URL.

Validasi client memakai schema yang sama dengan server (`@tanstack/react-form` + `components/ui/field`). Edit mode mengunci `rowNumber` (tidak bisa diubah user).

### UI/UX — Konfirmasi hapus

`AlertDialog` menampilkan:

> Hapus transaksi "Penerimaan Dana Hibah dari PPI Turki"?
>
> Nilai baris akan dikosongkan. Nomor baris di Google Sheets tidak berubah, jadi rumus di tab DASHBOARD tetap stabil.

Tombol: `Batal` (outline) dan `Hapus nilai` (destructive).

### Polling & performa

- `useQuery` dengan `refetchInterval: 5000`, `refetchIntervalInBackground: false`.
- `staleTime: 30_000`; `placeholderData: keepPreviousData` saat filter berubah.
- Date picker dan form dialog di-`next/dynamic` agar tidak masuk initial bundle.
- Filter/pagination memakai `useMemo`; kolom memakai `useCallback`.
- Tidak ada `generateStaticParams` di route yang membaca session.

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| `/home/finance` | student | HomeLayoutComponent |
| `/api/finance` | student (GET) | Route Handler — JSON `TFinanceSnapshot` |

Route `GET` mengembalikan `TFinanceSnapshot` langsung, bukan `TServerPrompt`. Header: `Cache-Control: private, max-age=0` karena polling 5 detik harus melihat perubahan sheet.

## Security

- Siapa yang bisa mengakses: semua user login bisa `GET`; hanya `BENDAHARA`/`ADMIN` yang melihat tombol CRUD dan boleh memanggil mutasi.
- Data apa yang boleh dilihat per role: seluruh transaksi organisasi terlihat oleh user login; tidak ada filter per-user.
- Role check di server: setiap mutasi memanggil `getCurrentUserRole()` **sebelum** `safeParse`. Karena helper mengembalikan `"USER"` saat error, hasilnya fail-closed.
- Validasi server side: Zod di `schemas/finance.ts` untuk create/update/delete; `rowNumber` wajib int positif dan diverifikasi terhadap snapshot sebelum update/clear.
- Ownership tidak relevan (data organisasi), tapi role check wajib.
- Formula injection: `escapeFinanceCell` dipakai untuk semua string yang ditulis ke Sheets.
- Kredensial: hanya lewat `env`, tidak pernah dikirim ke client, tidak pernah masuk response action. Private key dinormalisasi `\\n` → newline di server.
- Tab read-only: helper hanya menulis ke `BUKU BESAR KEUANGAN`; `DASHBOARD` dan `WAJIB KAS` tidak pernah jadi target `append`/`update`/`clear`.
- Error: pesan generik via `TServerPrompt`, tanpa stack trace.
- Mode dummy: flag `FINANCE_USE_DUMMY_DATA` hanya dibaca di server. Data contoh tidak pernah ditulis ke Sheets, dan seluruh action mutasi ditolak lebih awal. Label "Data contoh" wajib tampil supaya angka tidak disangka data asli. Flag ini tidak boleh diaktifkan di produksi.

## Design Tokens

- Arah visual final: **monokrom rapi dengan dua aksen semantik**. Dominan `--surface`/`--border`/`--text-primary`; warna hanya dipakai pada ikon, bukan angka/latar kartu.
- Warna: `--background`, `--surface`, `--surface-hover`, `--border`, `--text-primary`, `--text-secondary`, `--text-disabled`, `--primary`, `--success`, `--danger`, `--warning`.
- Pemetaan warna keuangan (versi final): **hanya ikon** pemasukan/Debit yang `--success` (hijau) dan pengeluaran/Kredit yang `--danger` (merah). Saldo, IDR, TRY, dan status sinkron memakai warna netral. `--warning` hanya untuk badge/banner mode data contoh. Warna selalu didampingi ikon + teks.
- Badge status pakai gaya outline netral, tanpa fill; teks + ikon. Ikon Debit/Kredit boleh berwarna, latar badge tetap transparan.
- Kartu KPI tidak memakai garis atas berwarna atau latar berwarna. Wadah ikon memakai `bg-surface-hover`; hanya ikonnya yang boleh hijau/merah. Angka tetap `text-text-primary`. Tidak ada shadow.
- Font: `--font-sans` (Inter) untuk label, `--font-mono` (JetBrains Mono) untuk angka, tanggal, dan `rowNumber`.
- Spacing: kelipatan 8px (`--space-sm` 8, `--space-md` 16, `--space-lg` 24, `--space-xl` 32).
- Radius: `--radius-card` untuk kartu, `--radius-control` untuk input/button, `--radius-chip` untuk badge.
- Shadow: `none` pada elemen statis.
- Type scale: `title-tiga` untuk judul halaman, `subheadline` untuk judul kartu, `body` untuk tabel, `footnote` untuk meta/waktu.
- Button: 4 variant (`primary`, `outline`, `ghost`, `destructive`); tidak ada colored fill selain variant yang sudah ditentukan.
- Select: semua dropdown memakai `components/ui/select.tsx` (shadcn/Radix), bukan `<select>` mentah. Opsi "Semua…" memakai sentinel `"all"` karena Radix tidak mengizinkan `value=""`.
- Card: variant B (content-led).
- Skeleton: `components/skeletons/finance-skeleton.tsx`.
- Empty state: `text-disabled`, terpusat, satu CTA.

## Testing Checklist

- [ ] Migrasi `BENDAHARA` dijalankan; user `BENDAHARA` dan `ADMIN` bisa CRUD, role `USER`/`PENGURUS` ditolak oleh server action.
- [ ] `GET /api/finance` tanpa login → redirect/login; dengan login → JSON `TFinanceSnapshot` valid.
- [ ] Parser 3 baris contoh bendahara → 3 transaksi; `₺1.500,00` → `1500`, `Rp10.242.331` → `10242331`, `3/15/2026` → `2026-03-15`.
- [ ] Happy path read: 6 kartu KPI dan tabel tampil; total IDR/TRY sesuai perhitungan fallback.
- [ ] Happy path create: tambah transaksi TRY → hanya kolom H terisi di `BUKU BESAR KEUANGAN`; kolom I kosong.
- [ ] Happy path create IDR: tambah transaksi IDR → hanya kolom I terisi; kolom H kosong.
- [ ] Happy path update: edit baris 8 → hanya baris 8 berubah; baris 9 tetap.
- [ ] Happy path delete: hapus baris 8 → baris 8 kosong, baris 9 tidak bergeser.
- [ ] Formula injection: keterangan `=SUM(A1:A9)` tersimpan sebagai teks, bukan rumus.
- [ ] Input invalid: tanggal salah, keterangan < 2 char, nominal 0, URL bukan http(s) → `fieldErrors` + toast.
- [ ] Empty state: sheet kosong → teks "Belum ada transaksi" + CTA sesuai role.
- [ ] Error state: Google API gagal → alert + tombol retry, tidak crash.
- [ ] Polling: edit di sheet muncul di dashboard ≤ 5 detik saat tab aktif; tidak refetch saat tab background.
- [ ] Aksesibilitas: keyboard navigasi dialog/form, label terhubung, ikon punya `aria-hidden`, status punya teks.
- [ ] Warna final: hanya ikon pemasukan hijau (`--success`) dan pengeluaran merah (`--danger`); angka, saldo, IDR/TRY, dan badge sinkron netral; badge tetap outline + ikon + teks.
- [ ] Select: semua dropdown toolbar dan form memakai shadcn `Select`, bisa dibuka/dipilih via keyboard, opsi "Semua…" kembali ke filter kosong.
- [ ] Environment: `GOOGLE_*` hanya di server, tidak muncul di bundle client.
- [ ] Mode dummy: `FINANCE_USE_DUMMY_DATA="true"` menampilkan badge "Data contoh", 6 KPI dan tabel terisi, tombol CRUD hilang, polling mati.
- [ ] Mode dummy: 8 transaksi contoh menghasilkan total IDR `21.242.331 / 475.000 / 20.767.331` dan TRY `1.990 / 263,25 / 1.726,75`.
- [ ] Mode dummy: semua server action mutasi ditolak tanpa memanggil Google API.
- [ ] Mode dummy dimatikan (`"false"`): dashboard kembali ke data Google Sheets / error state.
- [ ] Verifikasi wajib: `pnpm exec vitest run`, `pnpm lint`, lalu `pnpm build` lolos.
- [ ] Smoke produksi: `pnpm build && PORT=3111 pnpm start`, `curl /home/finance` tidak 500.
