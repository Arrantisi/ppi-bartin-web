> status: done — diimplementasikan 24 Nov 2026. Override `bg-transparent` di `globals.css` kini mengecualikan `[class*="text-danger"]`, sehingga variant destructive memakai `--danger` dan `--danger-subtle`. `design-guideline.md` diperbarui. `pnpm exec vitest run` (36 test), `pnpm lint`, dan `pnpm build` lolos.

# Button Destructive Variant — Plan

## Overview

Tombol `variant="destructive"` dan `"destructive-outline"` di `components/ui/button.tsx` tidak menampilkan warna merah meskipun class `text-danger` sudah ada di definisi variant. Penyebabnya ada di `app/globals.css`: aturan global

```css
button[data-slot="button"][class*="bg-transparent"] {
  color: var(--text-secondary) !important;
  border-color: transparent !important;
}
```

Karena class dasar `buttonVariants` memuat `bg-transparent`, **semua** tombol mencocoki selector itu. Aturan dengan `!important` ini mengalahkan `text-danger` dan `border-border` dari variant destructive, sehingga warnanya tampak netral seperti tombol biasa. Perbaikan: kecualikan tombol yang memiliki `text-danger` dari aturan override generik tersebut.

## Database Model (Prisma)

Tidak ada perubahan schema.

## Server Actions

Tidak ada server action baru.

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| -       | -                   | -             | -                | -       |

## Client Components

- `app/globals.css` — tambahkan `:not([class*="text-danger"])` pada selector override `bg-transparent` (normal dan hover/pressed) agar variant destructive memakai warna dan bordernya sendiri.
- `components/ui/button.tsx` — tidak diubah; class variant sudah benar.
- `features/finance/components/finance-transaction-card.tsx` dan `features/finance/components/finance-delete-dialog.tsx` — tidak diubah; sudah memakai variant yang tepat.

## Routes

Tidak ada perubahan route.

## Security

Tidak ada perubahan otorisasi. Perubahan hanya pada presentasi tombol.

## Design Tokens

- `destructive`: `text-danger`, `hover:bg-danger/10`, border transparan.
- `destructive-outline`: `text-danger`, `border-border`, `hover:bg-danger/10`.
- Tetap memakai `--danger` / `--danger-subtle`; tidak ada hardcode hex/rgb baru.

## Testing Checklist

- [x] Tombol `destructive` di dialog hapus tampil merah (`--danger`) dengan latar transparan.
- [x] Tombol `destructive-outline` di kartu detail tampil merah dengan border `--border`.
- [x] Hover kedua tombol memakai `--danger-subtle`, bukan `--surface-hover`.
- [x] Variant `default`, `outline`, `ghost`, dan `secondary` tidak berubah.
- [x] `pnpm exec vitest run`, `pnpm lint`, `pnpm build` lolos.
