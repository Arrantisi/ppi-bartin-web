> status: done — koreksi 24 Nov 2026: tab tetap dipakai di `/home/finance`, tetapi `/dashboard/finance` kembali ke empat blok bertumpuk agar submenu collapse "Keuangan" di sidebar dashboard berfungsi sebagai navigasi anchor yang benar-benar menggulir ke bagian terkait dan memiliki state aktif. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Finance Dashboard Tabs — Plan

## Overview

Portal `/home/finance` menampilkan empat blok laporan (A saldo dana & arus kas, B penyerapan anggaran, C buku besar, D wajib kas) sebagai 4 tab: `Ringkasan`, `Anggaran`, `Buku Besar`, dan `Wajib Kas`. Hanya satu panel yang dirender/ditampilkan pada satu waktu, sehingga halaman lebih pendek dan mudah dipindai. Tidak ada perubahan sumber data: Google Sheets tetap single source of truth.

Koreksi 24 Nov 2026: panel admin `/dashboard/finance` **tidak memakai tab**. Keempat blok dirender sekaligus sebagai section bertumpuk dengan anchor `#laporan-dasar`, `#penyerapan-anggaran`, `#buku-besar`, `#wajib-kas`, sehingga submenu collapse "Keuangan" di sidebar dashboard kembali berfungsi sebagai navigasi: mengklik submenu menggulir ke blok itu dan submenu yang bersesuaian ditandai aktif. Tab tetap menjadi pola navigasi `/home/finance` karena portal tidak punya sidebar collapse.

`FinanceDashboard` menerima prop `navigation?: "tabs" | "sections"` (default `"tabs"`). Halaman home memakai default; `AdminFinancePage` meneruskan `"sections"`. Satu komponen dipakai ulang, tanpa duplikasi konten laporan.

## Database Model (Prisma)

Tidak ada perubahan schema maupun tabel baru. Snapshot yang sudah ada tetap dipakai:

| Field `TFinanceSnapshot` | Dipakai blok | Sumber |
| ------------------------ | ----------- | ------ |
| `report.funds`, `report.legend` | Ringkasan | tab `DASHBOARD` |
| `transactions` → `totals` | Ringkasan | dihitung dari `BUKU BESAR KEUANGAN` (lihat `finance-kpi-from-ledger-plan.md`) |
| `report.budget` | Anggaran | tab `DASHBOARD` |
| `transactions` | Buku Besar | tab `BUKU BESAR KEUANGAN` |
| `wajibKas` | Wajib Kas | tab `WAJIB KAS` |

## Server Actions

Tidak ada server action baru.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

Action CRUD transaksi yang sudah ada (`create/update/deleteFinanceTransaction`) tetap dipanggil dari blok `Buku Besar` (tab di home, section di dashboard) dengan role check di server. `GET /api/finance` tetap menjadi satu-satunya jalur baca snapshot.

## Client Components

Daftar file yang akan dibuat di `features/finance/`:

- Tidak ada file komponen baru; perubahan dilakukan di `features/finance/components/finance-dashboard.tsx`.
- `components/ui/tabs.tsx` (sudah ada, berbasis `@base-ui/react/tabs`) dipakai ulang — tidak menambah dependency.
- `components/skeletons/finance-skeleton.tsx` — menerima `navigation` yang sama; bilah tab dan panel tunggal hanya tampil di mode `tabs`, mode `sections` menampilkan beberapa placeholder blok.
- `features/finance/components/finance-report-section.tsx` — dipertahankan sebagai pembagi bernomor A/B/C/D, dengan `id` anchor yang dipakai sidebar. Class `scroll-mt-24` sudah ada agar anchor tidak tertutup header.
- `features/dashboard/components/admin-finance-page.tsx` — meneruskan `navigation="sections"`.
- `features/finance/finance-page.tsx` — tetap memakai default `navigation="tabs"`.
- `components/sidebar/nav-main.tsx` — melacak `window.location.hash` lewat `hashchange` dan meneruskan `isActive` ke `SidebarMenuSubButton` agar submenu "Keuangan" menyala sesuai blok yang dibuka. Tautan anchor ke halaman yang sedang dibuka memakai `<a>` native (bukan `Link`) karena `pushState` router Next tidak memicu `hashchange`; tautan lintas halaman tetap memakai `Link`.

State di `FinanceDashboard`: `activeTab` (default `ringkasan`, hanya dipakai mode `tabs`), sinkronisasi hash → tab untuk home dan hash → `scrollIntoView` untuk dashboard, serta `replaceState` saat tab diganti agar URL bisa dibagikan tanpa menambah history entry. Effect scroll dashboard bergantung pada `isInitialLoading` supaya anchor tetap bekerja bila hash diklik sebelum data Sheets selesai dimuat.

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| /home/finance | semua anggota login & profil lengkap | `HomeLayoutComponent` |
| /dashboard/finance | `ADMIN` saja (tidak diubah) | `AdminManagementShell` |
| /home/finance#wajib-kas | hash memilih tab Wajib Kas | `HomeLayoutComponent` |
| /dashboard/finance#laporan-dasar · #penyerapan-anggaran · #buku-besar · #wajib-kas | submenu collapse sidebar → menggulir ke section + submenu aktif | `AdminManagementShell` |

## Security

- Tidak ada data baru yang dikirim ke client; seluruh tab membaca `financeQuery.data` yang sama.
- Role check untuk tombol Tambah/Edit/Hapus tetap `BENDAHARA`/`ADMIN` di client dan diverifikasi ulang di server action.
- Anggota biasa tetap bisa melihat keempat blok/tab, termasuk detail nama/status `WAJIB KAS`, sesuai keputusan produk sebelumnya.
- Hash URL hanya dipakai untuk memilih tab (home) atau menggulir ke section (dashboard) dan menandai submenu aktif; tidak pernah dipakai sebagai otorisasi atau filter data sensitif. State aktif submenu juga dibatasi pada item sidebar yang pathname-nya sedang aktif.

## Design Tokens

- Tab (home) mengikuti `components/ui/tabs.tsx` dengan `variant="line"`, `border-b border-border`, dan indikator aktif `after:bg-text-primary`.
- Section (dashboard) memakai `space-y-8` antar blok dan `scroll-mt-24` dari `FinanceReportSection`; submenu aktif memakai `data-[active=true]:bg-sidebar-accent` bawaan `SidebarMenuSubButton` — tanpa warna atau shadow baru.
- Warna: `--border`, `--text-primary`, `--text-secondary`, `--surface`, `--success`, `--danger` — tanpa hardcode hex/rgb.
- Tipografi: `body`/`footnote` untuk label tab, `--font-mono` untuk angka.
- Spacing: grid 8px (`gap-4`, `space-y-4`, `px-3 py-2`).
- Tidak ada shadow pada elemen statis; badge status tetap outline.

## Testing Checklist

- [x] Happy path: `/home/finance` menampilkan 4 tab, tab `Ringkasan` aktif, hanya panel ringkasan yang terlihat.
- [x] Klik tab `Wajib Kas` → tabel anggota muncul, panel lain tersembunyi, URL hash berubah ke `#wajib-kas`.
- [x] `/dashboard/finance` menampilkan keempat blok sekaligus tanpa bilah tab; sidebar "Keuangan" tetap bisa di-collapse.
- [x] Klik submenu sidebar "Keuangan → Buku Besar" → halaman menggulir ke blok C, submenu "Buku Besar" ber-status aktif; submenu lain tidak ikut aktif.
- [x] Klik submenu sebelum data selesai dimuat → setelah data tampil halaman tetap menggulir ke anchor yang diminta (effect bergantung `isInitialLoading`).
- [x] Role: anggota biasa melihat keempat blok/tab tetapi tidak melihat tombol Tambah/Edit/Hapus; `BENDAHARA`/`ADMIN` melihatnya.
- [x] Input invalid: hash tidak dikenal → fallback ke tab `Ringkasan` di home, tidak crash; di dashboard hash asing diabaikan.
- [x] Empty state: blok/tab dengan data kosong tetap menampilkan pesan dari komponen terkait.
- [x] Aksibilitas: tab bisa dipindah dengan keyboard (roving focus dari Base UI), submenu sidebar bisa via keyboard dengan `isActive` benar, skeleton punya `role="status"`.
- [x] Verifikasi wajib: `pnpm exec vitest run` (36 test), `pnpm lint`, `pnpm build` lolos.
