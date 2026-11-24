> status: done — diimplementasikan 24 Nov 2026. Parser `WAJIB KAS` terverifikasi langsung pada sheet asli: 6 blok, 203 anggota angkatan 2020–2025, 75 lunas, 128 tunggakan. Collapse berada di sidebar dashboard, bukan di halaman finance. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Data Wajib Kas & Sidebar Collapsible — Plan

## Overview

Menampilkan tab `WAJIB KAS` dari spreadsheet DKE asli ke halaman `/home/finance`, sehingga seluruh anggota PPI Bartın bisa melihat siapa yang sudah dan belum membayar kas per bulan. Google Sheets tetap menjadi source of truth; tidak ada tabel Prisma baru.

Bersamaan dengan itu, halaman keuangan menampung 4 blok (A saldo dana & arus kas, B penyerapan anggaran, C buku besar, D wajib kas) yang **selalu terlihat**. Sesuai koreksi 24 Nov 2026, collapse dipindah ke **sidebar dashboard** (`NavMain` → submenu "Keuangan"), bukan ke blok halaman. Tiap blok punya anchor (`#laporan-dasar`, `#penyerapan-anggaran`, `#buku-besar`, `#wajib-kas`) yang jadi target submenu sidebar.

Keputusan produk 24 Nov 2026:
- Bendahara **cukup memakai `/home/finance`** yang sudah memberi izin tulis. Layout `/dashboard` tidak dilonggarkan; halaman admin lain tetap `ADMIN`-only.
- Detail nama anggota dan status kas **terlihat oleh semua anggota yang login**, selaras dengan link sheet yang sudah dibagikan.
- Tombol tulis tambah/edit/hapus transaksi tetap hanya untuk `BENDAHARA`/`ADMIN`.

## Database Model (Prisma)

Tidak ada perubahan schema. Sumber data:

| Tab Google Sheets | Range | Sifat | Keterangan |
| ----------------- | ----- | ----- | ---------- |
| `WAJIB KAS` | `'WAJIB KAS'!A1:AK140` | GET-only | Judul B1:B3, blok kiri B:R, blok kanan T:AJ |
| `DASHBOARD` | `'DASHBOARD'!A1:Z80` | GET-only | Ringkasan blok A/B |
| `BUKU BESAR KEUANGAN` | `'BUKU BESAR KEUANGAN'!B8:P` | GET + write | Transaksi blok C |

Struktur yang diparse per blok:
- `NO`, `ANGKATAN`, `NAMA` (kolom B/C/D pada blok kiri, T/U/V pada blok kanan).
- 12 kolom bulan `FEB`–`JAN` berisi `TRUE`/`FALSE` (E:P kiri, W:AH kanan).
- `TUNGGAKAN` 0–12 (Q kiri, AI kanan).
- `Penanggung Jawab :` di awal tiap blok (B/D kiri, T/V kanan).

Tipe baru di `types/finance.ts`: `TWajibKasMember`, `TWajibKasBlock`, `TWajibKasReport`, lalu `wajibKas: TWajibKasReport | null` ditambahkan ke `TFinanceSnapshot`.

## Server Actions

Tidak ada server action baru. `WAJIB KAS` bersifat read-only dan diambil bersama data lain di satu `batchGet`.

| Action | Path | Input | Output | Auth |
| ------ | ---- | ----- | ------ | ---- |
| getFinanceSnapshot | server/data/finance.ts | none | `TServerPrompt`-like `TFinanceSnapshot` (via `GET /api/finance`) | any authenticated user |
| getWajibKasValues | lib/google-sheets.ts | none | `unknown[][]` sebagai bagian `TFinanceSheetValues.wajibKas` | internal (dipanggil server) |
| create/update/deleteFinanceTransaction | server/actions/finance.ts | `CreateFinanceTransactionSchema` | `TServerPrompt<TFinanceTransaction>` | `BENDAHARA` / `ADMIN` |

Validasi server: `parseWajibKasReport` hanya membaca dan menormalisasi nilai; tidak ada penulisan ke tab `WAJIB KAS`.

## Client Components

File baru/diubah di `features/finance/components/`:

- `finance-report-section.tsx` — pembagi blok bernomor A/B/C/D yang selalu terbuka, dengan `id` anchor untuk submenu sidebar.
- `finance-wajib-kas.tsx` — ringkasan total/lunas/tunggakan, filter angkatan + status + pencarian nama, tabel 12 bulan dengan centang/dash serta teks status. Key tiap kartu blok memakai angkatan + index karena `penanggungJawab` bisa sama di beberapa angkatan.
- `finance-dashboard.tsx` — memakai `FinanceReportSection` A/B/C/D dan meneruskan `financeQuery.data?.wajibKas`.
- `components/skeletons/finance-skeleton.tsx` — skeleton untuk keempat blok yang selalu tampil.

Perubahan di luar fitur:

- `components/ui/collapsible.tsx` — primitif collapse ala shadcn (mendukung `asChild` lewat `Slot` yang sudah ada; tanpa dependency baru).
- `components/sidebar/nav-main.tsx` — `NavMain` merender submenu dengan `Collapsible`, chevron berputar, dan membuka otomatis saat item aktif.
- `components/sidebar/app-sidebar.tsx` — item "Keuangan" mendapat 5 submenu: ringkasan + anchor A/B/C/D.
- `features/finance/components/finance-collapsible-section.tsx` dihapus karena collapse tidak lagi ada di halaman.

## Routes

| URL | Akses | Layout |
| --- | ----- | ------ |
| /home/finance | semua anggota yang login & profil lengkap; lihat semua data, tulis hanya `BENDAHARA`/`ADMIN` | `HomeLayoutComponent` |
| /dashboard/finance | `ADMIN` saja (tidak diubah) | `AdminManagementShell` |
| /dashboard/finance#laporan-dasar · #penyerapan-anggaran · #buku-besar · #wajib-kas | `ADMIN` saja; target submenu sidebar | `AdminManagementShell` |

## Security

- Halaman `/home/finance` berada di route group `(protected)`, sehingga session + kelengkapan profil tetap diverifikasi di server sebelum halaman dirender.
- Role untuk tombol tulis masih diambil dari query role di client, tetapi **setiap server action memanggil ulang `getCurrentUserRole()` / `canWriteFinance()`**; client tidak dipercaya.
- Sesuai keputusan produk, nama dan status pembayaran anggota ditampilkan ke semua anggota yang login. Tidak ada field sensitif (kontak penanggung jawab, data pribadi lain) yang dikirim bila kosong.
- `WAJIB KAS` tidak pernah ditulis dari aplikasi — parser hanya membaca nilai sel.
- Parser mengabaikan baris tanpa `NO`/`ANGKATAN`/`NAMA` lengkap, sehingga baris kosong atau header tidak masuk ke response.
- Tidak ada env var baru; `GOOGLE_SHEET_ID` dipakai ulang.

## Design Tokens

- Warna: `--background`, `--surface`, `--surface-hover`, `--border`, `--text-primary`, `--text-secondary`, `--text-disabled`, `--success`, `--danger`. Tanpa hardcode hex/rgb.
- Tipografi: `--font-sans` untuk label, `--font-mono` untuk angka/no angkatan; kelas `subheadline`, `body`, `footnote`, `title-tiga`.
- Spacing: grid 8px (`space-y-4`, `gap-4`, `px-4 py-3`).
- Radius: `rounded-xl`, `rounded-chip`. Badge status memakai `variant="outline"`, bukan fill.
- Status lunas/tunggakan memakai **ikon + teks**, bukan warna saja (`IconCheck` / `IconMinus`).
- Progress/angka tetap monokrom; tidak ada shadow pada elemen statis.

## Testing Checklist

- [ ] Happy path: `/home/finance` menampilkan keempat blok A/B/C/D; blok D menampilkan rekap + tabel wajib kas dengan data asli.
- [x] Parser `WAJIB KAS`: 6 blok terbaca, 203 anggota angkatan 2020–2025, 75 lunas, 128 tunggakan; bulan `TRUE/FALSE` dan `TUNGGAKAN` sesuai sheet asli.
- [ ] Filter status "Tunggakan" hanya menampilkan anggota dengan tunggakan > 0; filter angkatan dan pencarian nama berfungsi.
- [ ] Unauthorized access → pengguna belum login diarahkan `/login`; profil belum lengkap diarahkan `/complete-profile`.
- [ ] Role: anggota biasa tidak melihat tombol Tambah/Edit/Hapus; `BENDAHARA`/`ADMIN` melihatnya. Server action tetap menolak role lain.
- [x] Input invalid: nilai bulan selain `TRUE`/`FALSE` dibaca sebagai belum bayar, bukan crash (unit test).
- [ ] Empty state: bila tab `WAJIB KAS` kosong, panel D menampilkan pesan dan tidak merusak blok lain.
- [ ] Aksibilitas: toggle submenu sidebar bisa dipakai via keyboard, `aria-expanded` berubah; tabel punya `caption` dan `scope="col"`.
- [x] Verifikasi wajib: `pnpm exec vitest run` (36 test), `pnpm lint`, `pnpm build` lolos.
