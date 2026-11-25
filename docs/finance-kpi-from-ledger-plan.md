> status: done — diimplementasikan 24 Nov 2026. `totals` snapshot dihitung dari `computeFinanceTotals(transactions)`, `kpiSource: "buku-besar"`, badge header diperbarui. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Finance KPI dari Buku Besar — Plan

## Overview

Selama ini KPI arus kas (pemasukan/pengeluaran/saldo IDR & TRY) diambil dari sel `DASHBOARD` (E17/J17/S17, E19/J19/S19). Probe 24 Nov 2026 membuktikan sel-sel itu berisi **angka statis**, bukan rumus, sehingga transaksi baru yang ditulis bendahara ke `BUKU BESAR KEUANGAN` tidak membuat KPI berubah. Sesuai keputusan user, KPI sekarang **dihitung aplikasi dari transaksi buku besar** memakai `computeFinanceTotals`, sehingga langsung mengikuti mutasi. Saldo dana, legenda, dan penyerapan anggaran tetap dibaca dari `DASHBOARD`.

## Database Model (Prisma)

Tidak ada perubahan schema. Google Sheets tetap single source of truth; tidak ada tabel Prisma baru.

## Server Actions

Tidak ada server action baru. Action `create/update/deleteFinanceTransaction` tetap memakai role check `BENDAHARA`/`ADMIN` di server (sesuai konfirmasi user: ADMIN tetap superuser).

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

## Client Components

- `server/data/finance.ts` — `totals` dihitung dari `transactions`, `kpiSource: "buku-besar"`.
- `types/finance.ts` — union `kpiSource` disesuaikan.
- `features/finance/components/finance-dashboard.tsx` — badge sumber KPI disederhanakan.
- `hooks/use-finance.ts` — tidak berubah; invalidate + refetch 5 detik sudah ada.

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| /home/finance | semua anggota login & profil lengkap | `HomeLayoutComponent` |
| /dashboard/finance | `ADMIN` saja (tidak diubah) | `AdminManagementShell` |

## Security

- Tidak ada data tambahan yang dikirim ke client; `totals` tetap berasal dari snapshot yang sama.
- Role check tidak berubah; perubahan hanya pada sumber angka KPI.
- Mode dummy tetap memakai `kpiSource: "dummy"` dan angka contohnya sendiri.

## Design Tokens

- Tidak ada token baru. Badge tetap `Badge variant="outline"` dengan `text-text-secondary`.

## Testing Checklist

- [x] Happy path: setelah create/update/delete, `totals` snapshot berubah sesuai buku besar dan KPI Ringkasan ikut berubah.
- [x] Role: tombol aksi tetap hanya untuk `BENDAHARA`/`ADMIN`.
- [x] Mode dummy: `kpiSource: "dummy"` dan tidak memanggil Google API.
- [x] Empty state: buku besar kosong menghasilkan `totals` nol tanpa crash.
- [x] Verifikasi wajib: `pnpm exec vitest run`, `pnpm lint`, `pnpm build` lolos.
