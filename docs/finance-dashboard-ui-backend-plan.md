# Financial Dashboard UI/UX & Backend — Plan

> status: done (kode selesai); read path produksi terverifikasi dengan service account baru. Sejak 24 Nov 2026 env mengarah ke sheet DKE asli, layout sheet dipetakan ulang, dan service account terverifikasi sebagai Editor. UI mengikuti sheet asli penuh dalam empat blok A/B/C/D yang kini disajikan sebagai 4 tab agar tidak numpuk; collapse ada di sidebar dashboard (submenu "Keuangan"). Lihat `docs/finance-tabs-plan.md`. Parser `DASHBOARD` dan `WAJIB KAS` terverifikasi pada data asli. Uji CRUD penuh di sheet asli masih menunggu baris uji dari bendahara.

## Overview

Rencana implementasi lanjutan Phase 3–4 untuk `Financial Dashboard`. Tujuannya: pengguna login bisa melihat ringkasan dan riwayat transaksi keuangan langsung dari Google Sheets, tanpa membuka spreadsheet. Bendahara (`BENDAHARA`) dan `ADMIN` bisa menambah, mengedit, dan menghapus transaksi dari dashboard; perubahan ditulis kembali ke tab `BUKU BESAR KEUANGAN`, lalu tab `DASHBOARD` milik bendahara yang menghitung ulang.

File plan ini melengkapi `docs/ppi_bartin_financial_dashboard_plan.md` dengan detail **tampilan**, **interaksi**, dan **alur backend** sebelum kode ditulis.

Catatan implementasi: skrip `build` di `package.json` menaikkan `NODE_OPTIONS=--max-old-space-size=8192` karena tipe dari `googleapis` membuat pemeriksaan tipe Next.js kehabisan memori pada batas default 2 GB. Prasyarat eksternal yang masih menunggu admin: service account baru (project lama sudah dihapus), sheet dibagikan sebagai Editor, dan email user bendahara. Migrasi enum `BENDAHARA` sudah dijalankan ke database (21 Nov 2026).

Verifikasi lapangan 23 Nov 2026: layout asli ternyata berbeda dari asumsi awal — kolom A = spacer, NO di kolom B dari `=sequence(250)`, subheader baris 7, data mulai baris 8, dan tautan dokumen di kolom P. Range baca/tulis sudah disesuaikan. Service account pertama berhasil membaca lalu project GCP-nya dihapus (`403 Project #351538191773 has been deleted`). Service account pengganti sudah aktif: helper produksi berhasil membaca 193 transaksi dari sheet asli. Uji append/update/clear lolos di spreadsheet dummy sebagai sandbox. Uji CRUD di dummy menemukan bug: `values.append` menggeser penulisan ke kolom B karena `=sequence(250)`, sehingga create diubah memakai `values.update` ke baris kosong pertama (helper murni `findNextFinanceRow` + unit test). Setelah perbaikan, create → baris 11, update, dan clear semuanya lolos.

Verifikasi lanjutan 24 Nov 2026: user mengarahkan env kembali ke spreadsheet DKE asli. Metadata sheet: 3 tab (`DASHBOARD` 176×39, `BUKU BESAR KEUANGAN` 258×17, `WAJIB KAS` 132×37), locale `en_US`. Probe `values.clear` pada sel kosong `Q250` **berhasil**, jadi service account sekarang Editor (hak tulis tidak lagi 403). Buku besar berisi 196 baris: Debit 183/Kredit 13, IDR 123/TRY 73, dominasi `Iuran Kas Anggota` (174) dan `Transfer` (195), 81 transaksi bertautan nota. Layout `DASHBOARD` asli juga dipetakan: blok saldo dana di baris 8–12 (`E/J/S`), blok pendapatan–pengeluaran–total saldo di baris 15–19 (`E/J/S`), legenda di baris 23–25, dan `LAPORAN PENYERAPAN ANGGARAN` di baris 28–40+ dengan kolom `PAGU AWAL`/`REALISASI BELANJA`/`SISA ANGGARAN`. Detail alamat sel ada di `docs/ppi_bartin_financial_dashboard_plan.md`. Temuan ini lalu diterapkan ke UI: user memilih opsi "ikuti sheet asli penuh", sehingga dashboard memakai empat blok bernomor A/B/C/D (kini 4 tab). Awalnya angka KPI dibaca dari sel `DASHBOARD`; setelah diketahui statis, KPI dihitung dari buku besar. Parser `DASHBOARD` diuji terhadap data asli: 14 baris penyerapan anggaran terbaca dengan benar. Tab `WAJIB KAS` juga ikut diparse: 6 blok, 203 anggota angkatan 2020–2025, 75 lunas dan 128 tunggakan. Probe lanjutan menemukan sel KPI `DASHBOARD` berisi angka statis (bukan rumus), sehingga sesuai keputusan user KPI arus kas dihitung dari buku besar; saldo dana, legenda, dan anggaran tetap dibaca dari `DASHBOARD`.

Keputusan yang dipakai:

- Protected route `/home/finance` dengan `HomeLayoutComponent`.
- Role penulis: `BENDAHARA` + `ADMIN`; role lain hanya read-only.
- Email bendahara belum ditentukan → enum sudah disiapkan, update user menyusul.
- KPI dibaca langsung dari sel `DASHBOARD` (24 Nov 2026). `computeFinanceTotals` dari buku besar dipertahankan sebagai fallback bila parser tidak menemukan data, dan sumbernya ditampilkan di badge header.
- Total TRY dan IDR ditampilkan terpisah, tanpa konversi.
- Tab `WAJIB KAS` tampil sebagai blok D dan detail nama/statusnya bisa dilihat semua anggota yang login (keputusan 24 Nov 2026).
- Bendahara cukup memakai `/home/finance` untuk menulis; layout `/dashboard` sengaja tidak dilonggarkan dari `ADMIN`-only.
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

Migrasi: `prisma/migrations/20261119000000_add_bendahara_role/migration.sql` berisi `ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'BENDAHARA';`. Migrasi **sudah dijalankan ke database** pada 21 Nov 2026 lewat SQL yang sama (idempoten). Enum `Role` terverifikasi: `USER`, `ADMIN`, `PENGURUS`, `BENDAHARA`.

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
   - `BUKU BESAR KEUANGAN!B8:P` (data transaksi; kolom A spacer dan B NO otomatis dilewati);
   - `DASHBOARD!A1:Z80` (diparse menjadi `TFinanceDashboardReport`: dana, arus kas, legenda, dan penyerapan anggaran);
   - `WAJIB KAS!A1:AK140` (diparse menjadi `TWajibKasReport`: blok angkatan, 12 bulan `TRUE/FALSE`, dan `TUNGGAKAN`).
3. `parseFinanceSheetValues` atau `parseFinanceRows` mengubah baris menjadi `TFinanceTransaction[]`.
4. `parseFinanceDashboardReport` mengubah nilai `DASHBOARD` menjadi `TFinanceDashboardReport` (saldo dana, legenda, anggaran). `totals`-nya dari sel E/J/S baris 17 dan 19 tetap dipertahankan di report sebagai referensi, tetapi bukan lagi sumber KPI utama.
5. `parseWajibKasReport` mengubah nilai `WAJIB KAS` menjadi `TWajibKasReport`; blok diurutkan berdasarkan angkatan karena sheet menyusun dua lajur bersebelahan.
6. `totals` snapshot selalu dihitung dengan `computeFinanceTotals(transactions)` supaya KPI langsung mengikuti transaksi baru. `kpiSource` bernilai `"buku-besar"` untuk data asli dan `"dummy"` untuk mode pratinjau.
7. Response normal: `{ transactions, totals, report, wajibKas, kpiSource: "buku-besar", updatedAt }`. Bila `DASHBOARD` kosong → `report: null`, tetapi `totals` tetap dihitung dari buku besar. Bila `WAJIB KAS` kosong → `wajibKas: null`.
8. Mutasi:
   - `create` → validasi → `buildFinanceSheetRow` (14 nilai, tanpa NO) → cari baris kosong di `C:P` lewat `findNextFinanceRow` → `values.update` ke `C{row}:P{row}` dengan `USER_ENTERED`. `values.append` tidak dipakai karena `=sequence(250)` di kolom B menggeser penulisan ke kolom B.
   - `update` → verifikasi `rowNumber` masih ada → `values.update` ke `C{row}:P{row}`.
   - `delete` → verifikasi `rowNumber` masih ada → `values.clear` pada `C{row}:P{row}` (kolom B rumus NO tetap utuh).
9. Client `invalidateQueries(["finance"])` setelah mutasi sukses; **tanpa optimistic update** supaya UI tidak menampilkan angka yang belum pasti tersimpan di Sheets.

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
    ├── finance-dashboard.tsx             # orkestrasi query, filter, dialog, blok A/B/C/D
    ├── finance-report-section.tsx        # pembagi blok A/B/C/D + anchor untuk submenu sidebar
    ├── finance-metric-card.tsx           # kartu metrik 2 mata uang (dipakai ulang)
    ├── finance-fund-cards.tsx            # blok A: saldo dana + legenda
    ├── finance-summary-cards.tsx         # blok A: pendapatan/pengeluaran/total saldo
    ├── finance-budget-table.tsx          # blok B: penyerapan anggaran
    ├── finance-wajib-kas.tsx             # blok D: rekap + tabel status kas + filter
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
│ DASHBOARD KEUANGAN PPI BARTIN               [KPI DASHBOARD]   │
│ DEPARTEMEN KEUANGAN DAN EKONOMI - KABINET SUARASA             │
│ PERIODE 2026 - 2027                                           │
│ Sumber data: DKE - DATA KEUANGAN KESELURUHAN PPI BARTIN      │
├───────────────────────────────────────────────────────────────┤
│ A. LAPORAN DASAR (#laporan-dasar)                             │
│ [Dana Lembaga] [Dana Darurat] [Dana Abadi]                    │
│   IDR / TRY       IDR / TRY       IDR / TRY                   │
│ [Pendapatan]   [Pengeluaran]   [Total Saldo]                  │
│   IDR / TRY       IDR / TRY       IDR / TRY                   │
│ * legenda definisi dana lembaga / darurat / abadi             │
├───────────────────────────────────────────────────────────────┤
├───────────────────────────────────────────────────────────────┤
│ [Ringkasan] [Anggaran] [Buku Besar] [Wajib Kas]  ← tab        │
├───────────────────────────────────────────────────────────────┤
│ Panel aktif saja yang dirender:                               │
│  Ringkasan       → A (#laporan-dasar)                         │
│  Anggaran        → B (#penyerapan-anggaran)                   │
│  Buku Besar      → C (#buku-besar)                            │
│  Wajib Kas       → D (#wajib-kas) + rekap/filter/tabel        │
└───────────────────────────────────────────────────────────────┘
```

- Desktop: dua grid kartu (dana dan arus kas) masing-masing 3 kolom; mobile: 1 kolom, toolbar wraps, tabel keuangan dan anggaran horizontal scroll.
- Blok A/B/C/D memakai penanda bernomor + garis bawah tipis, mengikuti konvensi sheet bendahara, tetapi ditempatkan di dalam panel `components/ui/tabs.tsx` (variant `line`). Hanya satu panel aktif. Collapse berada di sidebar `/dashboard` (`NavMain` → submenu "Keuangan", memakai `components/ui/collapsible.tsx` dengan `aria-expanded`/`aria-controls`); submenunya menuju anchor yang otomatis memilih tab.
- Panel D menampilkan ringkasan total/lunas/tunggakan, filter angkatan + status + nama, serta tabel 12 bulan dengan ikon centang/dash **dan** teks status (tidak bergantung warna saja).
- Setiap metrik menampilkan pasangan IDR/TRY dalam satu kartu; tidak ada konversi kurs.
- Angka memakai `--font-mono`; label memakai `--font-sans`.
- Badge `Debit`/`Kredit`, `TRY`/`IDR` berupa **outline**, bukan fill.
- Indikator `Terpakai` pada tabel anggaran memakai progress bar monokrom (`--surface-hover` + `--text-primary`) **dan** teks persentase, sehingga tidak bergantung pada warna saja.
- Status sinkronisasi dan sumber KPI memakai teks, bukan warna saja.
- `rowNumber` tidak ditampilkan sebagai kolom utama, tapi tersimpan di row data dan dipakai edit/hapus.

### UI/UX — State

| State | Perlakuan |
| --- | --- |
| Loading | `FinanceSkeleton`: 6 kartu metrik, placeholder tabel anggaran, toolbar, dan 5 baris tabel shimmer. |
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

- [x] Migrasi `BENDAHARA` dijalankan ke database (21 Nov 2026).
- [ ] Verifikasi user `BENDAHARA` dan `ADMIN` bisa CRUD, role `USER`/`PENGURUS` ditolak oleh server action.
- [ ] `GET /api/finance` tanpa login → redirect/login; dengan login → JSON `TFinanceSnapshot` valid.
- [x] Parser 3 baris asli bendahara (baris 8–10) → 3 transaksi; `₺450.00` → `450`, `₺1.500,00` → `1500`, `Rp10,242,331` → `10242331`, `3/15/2026` → `2026-03-15`, serial `46096` → `2026-03-15`.
- [x] Service account pengganti aktif; helper produksi membaca 193 transaksi dari sheet asli (baris 8–204).
- [x] CRUD sandbox di spreadsheet dummy: append mengembalikan `rowNumber: 8`, update mengubah baris yang sama, clear mengosongkan nilai tanpa menggeser baris.
- [x] Service account pengganti sudah Editor di sheet asli (probe `values.clear` pada sel kosong berhasil 24 Nov 2026).
- [ ] Uji CRUD produksi penuh pada baris uji yang disepakati bendahara (belum dijalankan agar data asli tidak berubah).
- [x] Pelajari layout `DASHBOARD` asli → user memilih mengikuti sheet penuh; UI memakai blok A/B/C/D (tab) dan KPI dari buku besar sesuai koreksi probe sel statis.
- [x] Parser `DASHBOARD` terverifikasi pada data asli: 3 saldo dana, 3 metrik arus kas, 3 legenda, dan 14 baris penyerapan anggaran.
- [x] Parser `WAJIB KAS` terverifikasi pada data asli: 6 blok angkatan 2020–2025, 203 anggota, 75 lunas, 128 tunggakan.
- [x] Keputusan akses: bendahara cukup di `/home/finance`; `/dashboard` tetap `ADMIN`-only. Detail kas terlihat semua anggota.
- [ ] Happy path read: 4 tab tersedia, tab `Ringkasan` aktif (6 kartu metrik = 3 dana + 3 arus kas); memilih tab / submenu sidebar "Keuangan" menampilkan panel terkait; angka KPI sesuai sel `DASHBOARD`, bukan hitungan fallback.
- [ ] Happy path create: tambah transaksi TRY → hanya kolom I terisi di `BUKU BESAR KEUANGAN`; kolom J kosong; kolom B (NO) tetap dari rumus.
- [ ] Happy path create IDR: tambah transaksi IDR → hanya kolom J terisi; kolom I kosong.
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
- [x] Data sheet asli memuat transaksi tanpa kategori; opsi filter kategori disanitasi supaya tidak ada `Select.Item value=""` (error Runtime Radix Select).
- [x] Verifikasi wajib: `pnpm exec vitest run` (36 test), `pnpm lint`, lalu `pnpm build` lolos setelah perubahan layout penuh + WAJIB KAS.
- [ ] Smoke UI produksi: `/home/finance` menampilkan 4 tab dengan tab `Ringkasan` aktif; tab `Wajib Kas` menampilkan 203 anggota dari sheet asli dengan badge "KPI dari buku besar"; sidebar `/dashboard` punya submenu "Keuangan" yang bisa collapse dan membuka tab terkait.
- [ ] Smoke produksi: `pnpm build && PORT=3111 pnpm start`, `curl /home/finance` tidak 500.
