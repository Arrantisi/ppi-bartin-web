# Financial Dashboard — Plan

> status: done untuk implementasi; sejak 24 Nov 2026 `GOOGLE_SHEET_ID` dan `NEXT_PUBLIC_FINANCE_SHEET_URL` sudah mengarah ke spreadsheet DKE asli. Layout sheet dipelajari ulang dan service account terverifikasi sebagai **Editor** (probe `values.clear` pada sel kosong berhasil). UI sekarang mengikuti sheet asli penuh: blok A saldo dana + arus kas, B penyerapan anggaran, C buku besar, dan D wajib kas. Keempat blok selalu terlihat; collapse dipindah ke sidebar dashboard (submenu "Keuangan") dengan anchor ke tiap blok. Parser `DASHBOARD` dan `WAJIB KAS` sudah diverifikasi langsung terhadap data asli. Sisa checklist verifikasi CRUD produksi masih berjalan.

## Overview

Menampilkan laporan keuangan PPI Bartın secara transparan dengan sinkronisasi dua arah antara dashboard web dan Google Sheets. Google Sheets tetap menjadi *single source of truth* agar bendahara bisa terus bekerja di spreadsheet, sementara anggota melihat ringkasan pemasukan, pengeluaran, dan saldo tanpa membuka Sheets. Sebelumnya `components/sections/finance-section.tsx` hanya berisi placeholder "Upcoming" / "Menunggu Peluncuran", jadi tidak ada akses laporan yang terstruktur.

Stack: Next.js App Router, TypeScript, `googleapis`, TanStack Query, Shadcn UI, Tailwind CSS, Vercel, Better Auth. Detail UI/UX dan alur backend tersedia di `docs/finance-dashboard-ui-backend-plan.md`.

**Keputusan sudah dikonfirmasi:**

- Dashboard ditempatkan di `/home/finance` dengan `HomeLayoutComponent`.
- Role penulis adalah `BENDAHARA` baru; `ADMIN` tetap diizinkan sebagai superuser.
- Email bendahara belum ditentukan → migrasi enum dilakukan dulu, update role menyusul.
- Konflik edit memakai *last-write-wins*.
- `DELETE` mengosongkan nilai baris via `values.clear`, bukan menghapus baris fisik, agar `rowNumber` stabil.
- KPI `DASHBOARD` dibaca langsung dari sel rumus (lihat bagian "Kontrak Google Sheets"). Fallback dari `BUKU BESAR KEUANGAN` tetap ada hanya bila parser tidak menemukan data. Angka sheet dan angka hitungan buku besar sengaja tidak dicampur; sumber ditampilkan di badge header.
- Tab `WAJIB KAS` ikut ditampilkan sebagai blok D dan dapat dilihat semua anggota yang login (nama + status pembayaran). Sesuai keputusan 24 Nov 2026, bendahara cukup memakai `/home/finance` yang sudah memberi izin tulis; layout `/dashboard` tidak dilonggarkan.
- Total TRY dan IDR ditampilkan **terpisah**, tanpa konversi kurs.
- Mode preview: `FINANCE_USE_DUMMY_DATA="true"` menampilkan data contoh berlabel di `/home/finance` sebelum kredensial Google tersedia. Mode ini read-only dan tidak boleh dipakai di produksi.

### Rollout bertahap

- **Phase 1 — Quick link (sudah diimplementasikan & di-push):** `FinanceSection` dipasang di `app/page.tsx` antara `Hero` dan `Footer`, dengan akses dari nav `/#finance` dan footer. Shortcut serupa juga dipasang di portal `/home` lewat `features/home/finance-shortcut.tsx`. Tombol membuka URL Google Sheets dari env `NEXT_PUBLIC_FINANCE_SHEET_URL` dengan `target="_blank" rel="noopener noreferrer"`; render-nya dipisah ke client component `components/shared/finance-sheet-link.tsx` agar prop elemen `<a>` tidak melintas dari Server Component ke Client Component. Env bersifat opsional agar build tetap lolos sebelum link dari bendahara tersedia; jika kosong, tombol fallback "Menunggu Peluncuran" dalam keadaan disabled. Perlu deploy setelah `NEXT_PUBLIC_FINANCE_SHEET_URL` diisi di Vercel.
- **Phase 2 — Google Cloud & Sheet (sebagian selesai):**
  - [x] Struktur sheet diterima: 3 tab `DASHBOARD`, `BUKU BESAR KEUANGAN`, `WAJIB KAS`.
  - [x] Service account pertama berhasil membaca sheet asli, lalu project GCP-nya dihapus (`403 Project #351538191773 has been deleted`).
  - [x] Service account baru aktif dan **berhasil membaca sheet asli lewat helper produksi**: 193 transaksi (baris 8–204), total fallback IDR `21.589.703,63` dan TRY `19.463,34` untuk pemasukan.
  - [x] Service account baru sudah **Editor** di sheet asli — probe `values.clear` pada `Q250` berhasil (24 Nov 2026). Hak tulis tidak lagi 403.
  - [x] Sandbox CRUD (`values.update` ke baris kosong, `update`, `clear` pada `C{row}:P{row}`) lolos di spreadsheet dummy; tab uji sudah dihapus setelah pengujian.
  - [x] Target aktif sudah dikembalikan ke sheet asli: `GOOGLE_SHEET_ID = 1-p7AGA-c-U9WQ2W2ys1wkGD_hgi5j9-afXpAqwa5_uI`.
  - [x] `NEXT_PUBLIC_FINANCE_SHEET_URL` juga mengarah ke sheet asli, sehingga tombol Phase 1 tidak lagi membuka dummy.
  - [x] Env produksi sudah diset user ke DKE asli; tidak ada langkah "kembalikan ke sheet asli" yang tersisa.
- **Phase 3 — Backend (persiapan dimulai):** `pnpm add googleapis`; helper `lib/google-sheets.ts`; env didaftarkan di `lib/env/index.ts` **dan** `.env.example`; Zod schema di `schemas/finance.ts`; tipe di `types/finance.ts`; parser di `utils/finance-parser.ts` + unit test; server action + route handler `GET`.
- **Phase 4 — Frontend:** dashboard di `features/finance/`, hook `hooks/use-finance.ts`, `useQuery` dengan `refetchInterval: 5000` hanya saat tab aktif dan cache server ~30 detik untuk menjaga kuota Google Sheets API; `useMutation` + `invalidateQueries` untuk tulisan dari web. Layout final mengikuti sheet asli dalam empat blok bernomor: A `Laporan Dasar`, B `Laporan Penyerapan Anggaran`, C `Buku Besar Keuangan`, D `Wajib Kas PPI Bartın`. Semua blok tampil sekaligus; collapse ada di sidebar dashboard (`NavMain` → submenu "Keuangan") dan tiap submenu menuju anchor blok.
- **Phase 5 — Testing & migrasi:** uji sinkronisasi dua arah, deploy + verifikasi env produksi, lalu tombol Phase 1 diganti navigasi ke `/home/finance`.

### Kontrak Google Sheets (sumber: bendahara)

Spreadsheet: **`DKE - DATA KEUANGAN KESELURUHAN PPI BARTIN`**

| Tab | Perlakuan | Catatan |
| --- | --- | --- |
| `DASHBOARD` | GET-only | Ringkasan saldo & penyerapan anggaran berbasis rumus. JANGAN ditulis via API. Alamat sel KPI sudah dipetakan dan diparse langsung (lihat bawah); fallback hanya bila parser menemukan sheet kosong. |
| `BUKU BESAR KEUANGAN` | Read & Write | Target CRUD. Banner baris 1–3, header baris 6–7 (merged), data mulai **baris 8**. Kolom A = spacer, B = NO dari rumus `=sequence(250)`, C:O = field transaksi, P = `TAUTAN NOTA/RESI`. |
| `WAJIB KAS` | GET-only | Matriks iuran per angkatan, 6 blok tabel bersebelahan (kiri B:R, kanan T:AJ), 12 kolom bulan `TRUE`/`FALSE`, kolom `TUNGGAKAN` 0–12. JANGAN ditulis via API. |

#### Layout `DASHBOARD` asli (diverifikasi 24 Nov 2026)

Judul sheet: `DASHBOARD KEUANGAN PPI BARTIN` → `DEPARTEMEN KEUANGAN DAN EKONOMI - KABINET SUARASA` → `PERIODE 2026 - 2027` (baris 1–3, kolom B, merged B2:AN).

| Blok | Sel | Isi |
| --- | --- | --- |
| A. LAPORAN DASAR — judul | `B6`, `C6` | `A.` dan `LAPORAN DASAR` |
| Saldo Dana Lembaga* | `E8` (label), `E10` (IDR), `E12` (TRY) | `Rp3,685,969` / `₺0.00` |
| Saldo Dana Darurat** | `J8`, `J10`, `J12` | `Rp1,100,697` / `₺0.00` |
| Saldo Dana Abadi*** | `S8`, `S10`, `S12` | `Rp555,348` / `₺0.00` |
| Pendapatan* | `E15`, `E17`, `E19` | `Rp21,974,072.24` / `₺54,018.61` |
| Pengeluaran** | `J15`, `J17`, `J19` | `Rp11,320,813.46` / `₺37,427.84` |
| TOTAL SALDO | `S15`, `S17`, `S19` | `IDR 10,653,258.78` / `TRY 16.590,77` |
| Legenda | `E23:F25` | Definisi dana lembaga, darurat, dan abadi |
| B. LAPORAN PENYERAPAN ANGGARAN | `B28`, `C28` | Judul blok |
| Header tabel | baris 30 (`E30`, `F30`, `L30`, `R30`, `X30`) | `NO`, `LEMBAGA`, `PAGU AWAL`, `REALISASI BELANJA`, `SISA ANGGARAN` |
| Baris lembaga | 32, 34, 36, 38, 40 (isi lanjutan sampai baris ~80) | BPH/Presidium, Sekretaris, Keuangan & Ekonomi, Akademik Pelajar, Agama |

Karakter layout asli yang perlu dipertahankan jika UI web mengikuti sheet:

- Dua mata uang selalu berpasangan pada setiap metrik (baris IDR di atas, TRY di bawah), tidak digabung atau dikonversi.
- Tiga dana (Lembaga/Darurat/Abadi) adalah ringkasan **berbeda** dari Pendapatan/Pengeluaran/Total Saldo; keduanya bukan substitusi.
- `SISA ANGGARAN` di sheet adalah rumus `=M{row}-S{row}` (pagu dikurangi realisasi), bukan angka statis.
- Ringkasan dan tabel anggaran memakai merged cell; API hanya mengembalikan nilai di sel kiri atas merge.

#### Layout `WAJIB KAS` asli (diverifikasi 24 Nov 2026)

Judul sheet: `DATA WAJIB KAS PPI BARTIN` → `DEPARTEMEN KEUANGAN DAN EKONOMI - KABINET SUARASA` → `PERIODE 2026 - 2027` (baris 1–3, kolom B).

| Elemen | Sel | Isi |
| --- | --- | --- |
| Blok kiri | `B:R` | `NO` (B), `ANGKATAN` (C), `NAMA` (D), `FEB`–`JAN` (E:P), `TUNGGAKAN` (Q) |
| Blok kanan | `T:AJ` | `NO` (T), `ANGKATAN` (U), `NAMA` (V), `FEB`–`JAN` (W:AH), `TUNGGAKAN` (AI) |
| Penanggung jawab | baris 6, 21, 66, 85, 108, … | `Penanggung Jawab :` + nama di kolom D/V |
| Bulan | baris 8 | `FEB, MAR, APR, MEI, JUN, JUL, AGU, SEP, OKT, NOV, DES, JAN` |

Hasil parser data asli: **6 blok, 203 anggota angkatan 2020–2025, 75 lunas, 128 tunggakan**. Contoh baris pertama `B9 = 1`, `C9 = 2020`, `D9 = Auliya Imtihani Muyasaroh Jatmiko`, `E9:P9 = TRUE`, `Q9 = 0`.

Aturan parser `WAJIB KAS`: baris tanpa `NO`/`ANGKATAN`/`NAMA` lengkap diabaikan; nilai selain `TRUE`/`1`/`✓`/`LUNAS` dianggap belum bayar; bila `TUNGGAKAN` kosong atau bukan angka, dihitung ulang dari jumlah bulan belum bayar; blok diurutkan kembali berdasarkan angkatan karena sheet menyusun dua lajur bersebelahan.

Karakter data buku besar (196 baris asli, 24 Nov 2026): Debit 183 / Kredit 13; IDR 123 / TRY 73; kategori didominasi `Iuran Kas Anggota` (174), metode `Transfer` (195), rekening `Rekening Iuran Kas Rupiah` (125) / `Lira` (69) / `Dana Fundriser` (2), penanggung 5 orang, dan 81 transaksi punya tautan nota. Bulan aktif: Maret–Oktober dengan puncak April, Juli, Oktober.

Header `BUKU BESAR KEUANGAN` (urutan sesuai sheet asli, diverifikasi 23 Nov 2026):

`A(spacer) | B:NO (=sequence(250)) | C:TANGGAL | D:BULAN PELAPORAN | E:KETERANGAN TRANSAKSI | F:KATEGORI | G:ARUS KAS | H:MATA UANG | I:NOMINAL TRY | J:NOMINAL IDR | K:METODE TRANSAKSI | L:PENANGGUNG JAWAB | M:REKENING PENAMPUNG | N:PENERIMA | O:PENGIRIM | P:TAUTAN NOTA/RESI`

Aturan parser:

- Abaikan baris 1–7, mulai baca data dari baris 8 sampai baris terakhir berisi.
- `TANGGAL` bisa berupa `M/D/YYYY`, `MM/DD/YYYY`, ISO, atau serial number Sheets → ISO `yyyy-MM-dd`.
- Nominal dibersihkan dari `Rp`, `₺`, dan separator sesuai format asli: `Rp10,242,331` (koma ribuan), `Rp45.000` / `₺1.500,00` (titik ribuan), `₺450.00` (titik desimal) → `number`.
- `TAUTAN DOKUMEN` bisa berupa URL plain atau `=HYPERLINK("url";"label")`; parser mengambil URL `http(s)` saja.
- `BUKU BESAR KEUANGAN`, `DASHBOARD`, dan `WAJIB KAS` diambil dalam satu `values.batchGet` dengan range `B8:P`, `A1:Z80`, dan `A1:AK140`.
- Tulis baru: cari baris kosong pertama di `C:P` lewat `findNextFinanceRow`, lalu `values.update` ke `C{row}:P{row}` dengan `USER_ENTERED`. **`values.append` tidak dipakai** karena kolom B berisi `=sequence(250)`: Sheets mengira tabel sampai baris ~257 dan menggeser tulisan ke kolom B. **Jangan menulis kolom A/B**; isi hanya kolom nominal sesuai `MATA UANG`. Hapus = `values.clear` pada `C{row}:P{row}`.
- **Perlu konfirmasi bendahara:** rumus `DASHBOARD` harus memakai range sepanjang kolom (mis. `SUM(H:H)`), bukan range tetap sampai baris tertentu.

### File pendukung di luar `features/`

`lib/google-sheets.ts`, `lib/env/index.ts`, `.env.example`, `prisma/schema.prisma` + `prisma/migrations/`, `schemas/finance.ts`, `types/finance.ts`, `utils/finance-parser.ts`, `__tests__/finance-parser.test.ts`, `hooks/use-finance.ts`, `app/api/finance/route.ts`, `app/(protected)/home/finance/page.tsx`, `components/skeletons/finance-skeleton.tsx`, dan update `docs/file-placement.md` saat kode dibuat. `components/sections/finance-section.tsx` sudah dimodifikasi untuk Phase 1.

## Database Model (Prisma)

Tidak ada model Prisma baru untuk transaksi. Google Sheets adalah satu-satunya penyimpanan transaksi, jadi tidak ada tabel/relasi data keuangan.

Role check memakai enum `Role` pada `prisma/schema.prisma` melalui kolom `User.role`. Nilai `BENDAHARA` sudah ditambahkan ke enum database (21 Nov 2026). Penulis transaksi adalah `BENDAHARA`, dengan `ADMIN` sebagai superuser. Tidak ada tabel keuangan baru.

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

TFinanceFund = {
  key: "lembaga" | "darurat" | "abadi";
  label: string;
  marker: string; // *, **, ***
  idr: number;
  try: number;
};

TBudgetRealization = {
  no: number;
  lembaga: string;
  unit: string;
  pagu: number;
  realisasi: number;
  sisa: number;
};

TFinanceDashboardReport = {
  title: string;
  department: string;
  period: string;
  funds: TFinanceFund[];
  legend: { marker: string; description: string }[];
  totals: TFinanceTotals;   // angka dari sel rumus sheet
  budget: TBudgetRealization[];
};

TWajibKasMember = {
  no: number;
  angkatan: number;
  nama: string;
  months: { label: string; paid: boolean }[]; // FEB–JAN
  tunggakan: number; // 0–12
  status: "lunas" | "tunggakan";
};

TWajibKasBlock = {
  penanggungJawab: string;
  members: TWajibKasMember[];
};

TWajibKasReport = {
  title: string;
  department: string;
  period: string;
  blocks: TWajibKasBlock[];
  summary: { total: number; lunas: number; tunggakan: number };
};

TFinanceSnapshot = {
  transactions: TFinanceTransaction[];
  totals: TFinanceTotals;
  report: TFinanceDashboardReport | null;
  wajibKas: TWajibKasReport | null;
  kpiSource: "fallback" | "dashboard" | "dummy";
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
- `components/finance-dashboard.tsx` — orkestrasi `useQuery` polling, empat blok laporan A/B/C/D, dan aksi admin.
- `components/finance-report-section.tsx` — pembagi blok bernomor A/B/C/D yang selalu terbuka, dengan `id` anchor untuk submenu sidebar.
- `components/finance-metric-card.tsx` — kartu satu metrik dengan pasangan nilai IDR/TRY; dipakai ulang oleh dana dan arus kas.
- `components/finance-fund-cards.tsx` — blok A bagian 1: Saldo Dana Lembaga/Darurat/Abadi + legenda.
- `components/finance-summary-cards.tsx` — blok A bagian 2: Pendapatan, Pengeluaran, Total Saldo per mata uang.
- `components/finance-budget-table.tsx` — blok B: tabel penyerapan anggaran per lembaga (IDR) dengan indikator persentase teks.
- `components/finance-wajib-kas.tsx` — blok D: ringkasan total/lunas/tunggakan, filter angkatan + status + nama, tabel 12 bulan per anggota.
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
- [x] **Role BENDAHARA:** enum Prisma sudah dimigrasi ke database (21 Nov 2026).
- [ ] User `BENDAHARA` (dan `ADMIN`) bisa CRUD, role lain ditolak.
- [x] **Parser:** 3 baris asli bendahara (baris 8–10) terbaca menjadi 3 transaksi; `₺450.00` → `450`, `₺1.500,00` → `1500`, `Rp10,242,331` → `10242331`, `3/15/2026` → `2026-03-15`, serial `46096` → `2026-03-15`, `=HYPERLINK(...)` → URL `https`.
- [x] **Read produksi:** helper `getFinanceValues()` + parser membaca 193 transaksi dari sheet asli dengan kredensial baru.
- [x] **Parser DASHBOARD asli:** 3 saldo dana, 3 metrik arus kas, 3 legenda, dan 14 baris anggaran terbaca langsung dari sheet; contoh `E10 = 3.685.969`, `S17 = 10.653.258,78`, `S19 = 16.590,77`.
- [x] **Tampilan empat blok:** A (saldo dana + arus kas), B (penyerapan anggaran), C (buku besar), D (wajib kas) tampil berurutan dan selalu terlihat; sidebar dashboard menyediakan submenu collapse ke anchor tiap blok; badge header menampilkan sumber KPI "KPI dari DASHBOARD".
- [x] **Parser WAJIB KAS asli:** 6 blok, 203 anggota angkatan 2020–2025, 75 lunas dan 128 tunggakan terbaca langsung dari sheet; blok diurutkan berdasarkan angkatan.
- [x] **Akses & privasi:** detail nama/status kas sengaja terlihat semua anggota; bendahara tetap memakai `/home/finance` untuk menulis, layout `/dashboard` tidak diubah.
- [x] **Kategori kosong dari sheet asli:** 2 transaksi tanpa `kategori` tidak lagi menghasilkan `Select.Item value=""`; opsi filter dan datalist dibersihkan di `finance-dashboard.tsx` dan `finance-toolbar.tsx`.
- [x] **Verifikasi wajib:** `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos setelah perubahan layout + WAJIB KAS.
- [x] **CRUD sandbox:** append/update/clear lolos di sheet dummy, termasuk deteksi `rowNumber` dari `updatedRange`.
- [x] **Hak tulis sheet asli:** service account sudah Editor; probe `values.clear` pada sel kosong berhasil (24 Nov 2026).
- [ ] **CRUD sheet asli penuh:** create → baris kosong pertama `C:P`, update hanya baris itu, clear tanpa menggeser `=sequence(250)`; lakukan pada baris uji yang sudah disepakati bendahara.
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
