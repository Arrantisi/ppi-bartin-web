> status: done — diimplementasikan 24 Nov 2026. `/home/finance` dan `/dashboard/finance` kini memakai 4 tab (Ringkasan, Anggaran, Buku Besar, Wajib Kas); anchor sidebar membuka tab terkait. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Finance Dashboard Tabs — Plan

## Overview

Halaman `/home/finance` saat ini menumpuk empat blok laporan (A saldo dana & arus kas, B penyerapan anggaran, C buku besar, D wajib kas) dalam satu halaman panjang. Fitur ini mengganti tumpukan tersebut dengan 4 tab: `Ringkasan`, `Anggaran`, `Buku Besar`, dan `Wajib Kas`. Hanya satu panel yang dirender/ditampilkan pada satu waktu, sehingga halaman lebih pendek dan mudah dipindai. Tidak ada perubahan sumber data: Google Sheets tetap single source of truth.

Submenu sidebar "Keuangan" di `/dashboard` tetap dipakai; anchor `#laporan-dasar`, `#penyerapan-anggaran`, `#buku-besar`, `#wajib-kas` kini memetakan ke tab yang bersesuaian dan otomatis membukanya.

## Database Model (Prisma)

Tidak ada perubahan schema maupun tabel baru. Snapshot yang sudah ada tetap dipakai:

| Field `TFinanceSnapshot` | Dipakai tab | Sumber |
| ------------------------ | ----------- | ------ |
| `report.funds`, `report.legend`, `totals` | Ringkasan | tab `DASHBOARD` |
| `report.budget` | Anggaran | tab `DASHBOARD` |
| `transactions` | Buku Besar | tab `BUKU BESAR KEUANGAN` |
| `wajibKas` | Wajib Kas | tab `WAJIB KAS` |

## Server Actions

Tidak ada server action baru.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

Action CRUD transaksi yang sudah ada (`create/update/deleteFinanceTransaction`) tetap dipanggil dari tab `Buku Besar` dengan role check di server. `GET /api/finance` tetap menjadi satu-satunya jalur baca snapshot.

## Client Components

Daftar file yang akan dibuat di `features/finance/`:

- Tidak ada file komponen baru; perubahan dilakukan di `features/finance/components/finance-dashboard.tsx`.
- `components/ui/tabs.tsx` (sudah ada, berbasis `@base-ui/react/tabs`) dipakai ulang — tidak menambah dependency.
- `components/skeletons/finance-skeleton.tsx` — skeleton disesuaikan dengan bilah tab + satu panel aktif.
- `features/finance/components/finance-report-section.tsx` — dipertahankan sebagai pembagi bernomor di dalam tiap panel, dengan `id` anchor yang tetap dipakai sidebar.

State baru di `FinanceDashboard`: `activeTab` (default `ringkasan`), sinkronisasi `window.location.hash` → tab, dan `replaceState` saat tab diganti agar URL tetap bisa dibagikan tanpa menambah history entry.

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| /home/finance | semua anggota login & profil lengkap | `HomeLayoutComponent` |
| /dashboard/finance | `ADMIN` saja (tidak diubah) | `AdminManagementShell` |
| /home/finance#wajib-kas · /dashboard/finance#wajib-kas | target submenu sidebar → tab Wajib Kas | masing-masing layout |

## Security

- Tidak ada data baru yang dikirim ke client; seluruh tab membaca `financeQuery.data` yang sama.
- Role check untuk tombol Tambah/Edit/Hapus tetap `BENDAHARA`/`ADMIN` di client dan diverifikasi ulang di server action.
- Anggota biasa tetap bisa melihat keempat tab, termasuk detail nama/status `WAJIB KAS`, sesuai keputusan produk sebelumnya.
- Hash URL hanya dipakai untuk memilih tab; tidak pernah dipakai sebagai otorisasi atau filter data sensitif.

## Design Tokens

- Tab mengikuti `components/ui/tabs.tsx` dengan `variant="line"`, `border-b border-border`, dan indikator aktif `after:bg-text-primary`.
- Warna: `--border`, `--text-primary`, `--text-secondary`, `--surface`, `--success`, `--danger` — tanpa hardcode hex/rgb.
- Tipografi: `body`/`footnote` untuk label tab, `--font-mono` untuk angka.
- Spacing: grid 8px (`gap-4`, `space-y-4`, `px-3 py-2`).
- Tidak ada shadow pada elemen statis; badge status tetap outline.

## Testing Checklist

- [x] Happy path: `/home/finance` menampilkan 4 tab, tab `Ringkasan` aktif, hanya panel ringkasan yang terlihat.
- [x] Klik tab `Wajib Kas` → tabel anggota muncul, panel lain tersembunyi, URL hash berubah ke `#wajib-kas`.
- [x] Klik submenu sidebar "Keuangan → Buku Besar" → tab `Buku Besar` aktif dan panelnya terlihat.
- [x] Role: anggota biasa melihat keempat tab tetapi tidak melihat tombol Tambah/Edit/Hapus; `BENDAHARA`/`ADMIN` melihatnya.
- [x] Input invalid: hash tidak dikenal → fallback ke tab `Ringkasan`, tidak crash.
- [x] Empty state: tab dengan data kosong tetap menampilkan pesan dari komponen terkait.
- [x] Aksibilitas: tab bisa dipindah dengan keyboard (roving focus dari Base UI), `aria-selected` benar, skeleton punya `role="status"`.
- [x] Verifikasi wajib: `pnpm exec vitest run`, `pnpm lint`, `pnpm build` lolos.
