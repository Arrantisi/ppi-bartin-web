# Financial Dashboard — Plan

## Overview

Menampilkan laporan keuangan PPI Bartın secara transparan dengan sinkronisasi dua arah antara dashboard web dan Google Sheets. Google Sheets tetap menjadi *single source of truth* agar bendahara bisa terus bekerja di spreadsheet, sementara anggota melihat ringkasan pemasukan, pengeluaran, dan saldo tanpa membuka Sheets. Sebelumnya `components/sections/finance-section.tsx` hanya berisi placeholder "Upcoming" / "Menunggu Peluncuran", jadi tidak ada akses laporan yang terstruktur.

Stack: Next.js App Router, TypeScript, `googleapis`, TanStack Query, Shadcn UI, Tailwind CSS, Vercel, Better Auth. Detail UI/UX dan alur backend tersedia di `docs/finance-dashboard-ui-backend-plan.md`.

**Keputusan sudah dikonfirmasi:**

- Dashboard ditempatkan di `/home/finance` dengan `HomeLayoutComponent`.
- Role penulis adalah `BENDAHARA` baru; `ADMIN` tetap diizinkan sebagai superuser.
- Email bendahara belum ditentukan → migrasi enum dilakukan dulu, update role menyusul.
- Konflik edit memakai *last-write-wins*.
- `DELETE` mengosongkan nilai baris via `values.clear`, bukan menghapus baris fisik, agar `rowNumber` stabil.
- KPI `DASHBOARD` belum dikirim alamat selnya → **fallback dulu**: total dihitung dari `BUKU BESAR KEUANGAN`, lalu diganti pembacaan sel rumus setelah alamat tersedia.
- Tab `WAJIB KAS` ditunda untuk v1.
- Total TRY dan IDR ditampilkan **terpisah**, tanpa konversi kurs.
- Mode preview: `FINANCE_USE_DUMMY_DATA="true"` menampilkan data contoh berlabel di `/home/finance` sebelum kredensial Google tersedia. Mode ini read-only dan tidak boleh dipakai di produksi.

### Rollout bertahap

- **Phase 1 — Quick link (sudah diimplementasikan & di-push):** `FinanceSection` dipasang di `app/page.tsx` antara `Hero` dan `Footer`, dengan akses dari nav `/#finance` dan footer. Shortcut serupa juga dipasang di portal `/home` lewat `features/home/finance-shortcut.tsx`. Tombol membuka URL Google Sheets dari env `NEXT_PUBLIC_FINANCE_SHEET_URL` dengan `target="_blank" rel="noopener noreferrer"`; render-nya dipisah ke client component `components/shared/finance-sheet-link.tsx` agar prop elemen `<a>` tidak melintas dari Server Component ke Client Component. Env bersifat opsional agar build tetap lolos sebelum link dari bendahara tersedia; jika kosong, tombol fallback "Menunggu Peluncuran" dalam keadaan disabled. Perlu deploy setelah `NEXT_PUBLIC_FINANCE_SHEET_URL` diisi di Vercel.
- **Phase 2 — Google Cloud & Sheet (sebagian selesai):**
  - [x] Struktur sheet diterima: 3 tab `DASHBOARD`, `BUKU BESAR KEUANGAN`, `WAJIB KAS`.
  - [ ] Buat/aktifkan project GCP `ppi-bartin-finance` dan aktifkan Google Sheets API (dijadwalkan Jumat, dikerjakan admin).
  - [ ] Buat Service Account, download key JSON, catat `client_email` dan `private_key`.
  - [ ] *Share* spreadsheet ke `client_email` sebagai **Editor**.
  - [ ] Catat `SPREADSHEET_ID` dari URL sheet sebagai `GOOGLE_SHEET_ID`.
- **Phase 3 — Backend (persiapan dimulai):** `pnpm add googleapis`; helper `lib/google-sheets.ts`; env didaftarkan di `lib/env/index.ts` **dan** `.env.example`; Zod schema di `schemas/finance.ts`; tipe di `types/finance.ts`; parser di `utils/finance-parser.ts` + unit test; server action + route handler `GET`.
- **Phase 4 — Frontend:** dashboard di `features/finance/`, hook `hooks/use-finance.ts`, `useQuery` dengan `refetchInterval: 5000` hanya saat tab aktif dan cache server ~30 detik untuk menjaga kuota Google Sheets API; `useMutation` + `invalidateQueries` untuk tulisan dari web.
- **Phase 5 — Testing & migrasi:** uji sinkronisasi dua arah, deploy + verifikasi env produksi, lalu tombol Phase 1 diganti navigasi ke `/home/finance`.

### Kontrak Google Sheets (sumber: bendahara)

Spreadsheet: **`DKE - DATA KEUANGAN KESELURUHAN PPI BARTIN`**

| Tab | Perlakuan | Catatan |
| --- | --- | --- |
| `DASHBOARD` | GET-only | Ringkasan saldo & penyerapan anggaran berbasis rumus. JANGAN ditulis via API. Alamat sel KPI belum tersedia → fallback hitung dari buku besar. |
| `BUKU BESAR KEUANGAN` | Read & Write | Target CRUD. Banner baris 1–3, header baris 5–6 (merged), data mulai baris ~7, kolom `A:O`, append-only. |
| `WAJIB KAS` | Tunda v1 | Matriks iuran per angkatan, beberapa blok tabel, checkbox `TRUE`/`FALSE`, kolom `TUNGGAKAN`. |

Header `BUKU BESAR KEUANGAN` (urutan tetap):

`NO | TANGGAL | BULAN PELAPORAN | KETERANGAN TRANSAKSI | KATEGORI | ARUS KAS | MATA UANG | NOMINAL - TRY | NOMINAL - IDR | METODE TRANSAKSI | PENANGGUNG JAWAB | REKENING PENAMPUNG | PENERIMA | PENGIRIM | TAUTAN DOKUMEN`

Aturan parser:

- Abaikan baris 1–6, mulai baca data dari baris 7 sampai baris terakhir berisi.
- `TANGGAL` berformat `M/D/YYYY` / `MM/DD/YYYY` → ISO `yyyy-MM-dd`.
- Nominal dibersihkan dari `Rp`, `₺`, titik ribuan, dan koma desimal sebelum dikonversi ke `number`.
- `TAUTAN DOKUMEN` bisa berupa URL plain atau `=HYPERLINK("url";"label")`; parser mengambil URL `http(s)` saja.
- `DASHBOARD` dan `BUKU BESAR KEUANGAN` sebaiknya diambil dalam satu `values.batchGet`.
- Tulis baru: `append` ke `A7:O` dengan `valueInputOption: USER_ENTERED` + `INSERT_ROWS`, isi hanya kolom nominal sesuai `MATA UANG`.
- **Perlu konfirmasi bendahara:** rumus `DASHBOARD` harus memakai range sepanjang kolom (mis. `SUM(H:H)`), bukan range tetap sampai baris tertentu.

### File pendukung di luar `features/`

`lib/google-sheets.ts`, `lib/env/index.ts`, `.env.example`, `prisma/schema.prisma` + `prisma/migrations/`, `schemas/finance.ts`, `types/finance.ts`, `utils/finance-parser.ts`, `__tests__/finance-parser.test.ts`, `hooks/use-finance.ts`, `app/api/finance/route.ts`, `app/(protected)/home/finance/page.tsx`, `components/skeletons/finance-skeleton.tsx`, dan update `docs/file-placement.md` saat kode dibuat. `components/sections/finance-section.tsx` sudah dimodifikasi untuk Phase 1.

## Database Model (Prisma)

Tidak ada model Prisma baru untuk transaksi. Google Sheets adalah satu-satunya penyimpanan transaksi, jadi tidak ada tabel/relasi data keuangan.

Role check memakai enum `Role` pada `prisma/schema.prisma` melalui kolom `User.role`. Perlu ditambah nilai `BENDAHARA` (migrasi Prisma) sebelum implementasi. Penulis transaksi adalah `BENDAHARA`, dengan `ADMIN` sebagai superuser. Tidak ada tabel keuangan baru.

Kontrak data final (menyesuaikan sheet bendahara):

```ts
TFinanceTransaction = {
  rowNumber: number;        // baris Sheets asli, 1-based
  no: number;               // kolom A
  tanggal: string;          // ISO yyyy-MM-dd (dari M/D/YYYY)
  bulanPelaporan: string;   // kolom C, fallback dari tanggal
  keterangan: string;       // kolom D
  kategori: string;         // kolom E
  arusKas: "Debit" | "Kredit"; // kolom F
  mataUang: "TRY" | "IDR";  // kolom G
  nominalTry: number;       // kolom H, 0 jika transaksi IDR
  nominalIdr: number;       // kolom I, 0 jika transaksi TRY
  metodeTransaksi: string;  // kolom J
  penanggungJawab: string;  // kolom K
  rekeningPenampung: string;// kolom L
  penerima: string;         // kolom M
  pengirim: string;         // kolom N
  tautanDokumen: string;    // kolom O, URL http(s) saja
};

TFinanceTotals = {
  pemasukanIdr: number;
  pengeluaranIdr: number;
  saldoIdr: number;
  pemasukanTry: number;
  pengeluaranTry: number;
  saldoTry: number;
};

TFinanceSnapshot = {
  transactions: TFinanceTransaction[];
  totals: TFinanceTotals;
  kpiSource: "fallback" | "dashboard";
  updatedAt: string; // ISO datetime
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
- `CreateFinanceTransactionSchema` / `UpdateFinanceTransactionSchema`: `tanggal` (ISO date), `keterangan` (min. 2 karakter), `kategori`, `arusKas`, `mataUang`, `nominalTry`/`nominalIdr` (salah satu > 0 sesuai `mataUang`), `metodeTransaksi`, `penanggungJawab`, `rekeningPenampung`, `penerima`/`pengirim`/`tautanDokumen` opsional. `UpdateFinanceTransactionSchema` menambahkan `rowNumber` (int positif). `DeleteFinanceTransactionSchema`: `rowNumber` (int positif) yang diverifikasi masih ada di sheet sebelum `values.clear`.
- Setiap mutasi: cek role lebih dulu → `safeParse` → tulis ke `BUKU BESAR KEUANGAN` → kembalikan hanya field yang dibutuhkan client (jangan mengembalikan kredensial atau row mentah dari API).

## Client Components

Daftar file di `features/finance/`:

- `finance-page.tsx` — wrapper halaman (server component ringan) yang memakai `HomeLayoutComponent`.
- `components/finance-dashboard.tsx` — orkestrasi `useQuery` polling, summary, tabel, dan aksi admin.
- `components/finance-summary-cards.tsx` — kartu Total Pemasukan, Total Pengeluaran, Saldo per mata uang (IDR & TRY).
- `components/finance-data-table.tsx` — tabel riwayat mutasi dengan `@tanstack/react-table`, pencarian/filter, dan pagination.
- `components/finance-columns.tsx` — definisi kolom tabel (termasuk kolom aksi edit/hapus untuk admin).
- `components/finance-transaction-form.tsx` — form tambah/edit dengan `@tanstack/react-form` + `components/ui/field`.
- `components/finance-action-dialog.tsx` — dialog/drawer untuk form tambah & edit (admin).
- `components/finance-delete-dialog.tsx` — konfirmasi hapus via `AlertDialog`, bukan `confirm()` native.
- `components/finance-empty-state.tsx` — empty state `text-disabled` terpusat + satu CTA.

Shared pendukung: `hooks/use-finance.ts` (`useQuery` + `useMutation` dengan `invalidateQueries` pada key `["finance"]`), `types/finance.ts`, `schemas/finance.ts`, `utils/finance-parser.ts`, dan `components/skeletons/finance-skeleton.tsx`.

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
- **Tab read-only:** helper Sheets tidak boleh menulis ke `DASHBOARD` atau `WAJIB KAS`.
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
- [ ] **Parser:** 3 baris contoh bendahara terbaca menjadi 3 transaksi; `₺1.500,00` → `1500`, `Rp10.242.331` → `10242331`, `3/15/2026` → `2026-03-15`, `=HYPERLINK(...)` → URL `https`.
- [ ] **Happy path — read:** sheet berisi data → tabel dan kartu summary per mata uang tampil, angka sesuai perhitungan baris.
- [ ] **Happy path — create:** admin tambah transaksi → baris baru muncul di `BUKU BESAR KEUANGAN` dan di dashboard setelah `invalidateQueries`; `DASHBOARD` tidak berubah langsung.
- [ ] **Happy path — update:** admin edit `rowNumber` tertentu → hanya baris itu berubah di Sheets, baris lain tidak bergeser.
- [ ] **Happy path — delete:** admin hapus → nilai baris dikosongkan, `rowNumber` lain tetap stabil.
- [ ] **Unauthorized access → redirect:** belum login mengakses `/home/finance` → redirect ke login; role `USER` tidak melihat tombol CRUD dan server action tetap menolak dengan `success: false`.
- [ ] **Input invalid → error message muncul:** tanggal salah, keterangan kosong, atau nominal sesuai mata uang kosong → `fieldErrors` muncul di field dan toast `sonner`.
- [ ] **Empty state → tampil dengan benar:** sheet kosong → teks "Belum ada transaksi" dengan `text-disabled` terpusat + satu CTA untuk admin.
- [ ] **Sinkronisasi arah 1:** edit langsung di Google Sheets → dashboard berubah otomatis dalam ~5 detik.
- [ ] **Sinkronisasi arah 2:** input dari dashboard → baris muncul di Sheets dengan format rapi.
- [ ] **Kuota & polling:** beberapa user bersamaan tidak menghasilkan 429 dari Google Sheets API.
- [ ] **Environment:** `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `NEXT_PUBLIC_FINANCE_SHEET_URL` terdaftar di `lib/env/index.ts` + `.env.example` dan tidak bocor ke client bundle.
- [ ] **Verifikasi wajib:** `pnpm lint` lalu `pnpm build` lolos; smoke test produksi `pnpm build && PORT=3111 pnpm start` + `curl` ke `/home/finance` tidak menghasilkan 500.
