# News (Berita) — Plan

## Overview

News/Berita feature untuk PPI Bartin web. Users bisa membuat, melihat, memperbarui, dan menghapus berita. Berita memiliki kategori, thumbnail, ringkasan, dan konten rich text. Tersedia di halaman publik (`/berita`) dan halaman protected (`/home/berita`) dengan fitur CRUD.

---

## Database Model (Prisma)

```prisma
model News {
  id          String   @id @default(uuid())
  judul       String
  catagory    String
  desckripsi  String
  fileKey     String
  ringkasan   String
  slug        String   @unique
  environment String   @default("production")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  creator     User     @relation("createdNews", fields: [userId], references: [id], onDelete: Cascade)

  @@map("news")
}
```

**Category values:** `beasiswa`, `kegiatan`, `berita-utama`, `kabar-kampus`, `prestasi`, `artikel`, `pengumuman`

---

## Server Actions

### `server/actions/news.ts`

| Action | Function | Input | Output | Auth |
|--------|----------|-------|--------|------|
| createNews | `createNews(data)` | `TcreateNewsSchema` | `TServerPrompt` (slug) | student |
| updateNews | `updateNews(slug, data)` | slug + `TcreateNewsSchema` | `TServerPrompt` | student + owner |
| deleteNews | `deleteNews(newsId)` | newsId | `TServerPrompt` | student + owner |

**Key behaviors:**
- `createNews`: auto-generates slug from `judul` via `createSlug()`. Kirim push notification ke semua subscriber jika `environment === "production"`
- `updateNews`: verifikasi ownership. Jika `fileKey` berubah, hapus file lama dari UploadThing
- `deleteNews`: hapus file terkait dari UploadThing sebelum hapus record

### `server/data/news.ts`

| Function | Description |
|----------|-------------|
| `getNews()` | Fetch all news filtered by environment+role, ordered by `createdAt: "desc"` |
| `getNewsBySlug(slug)` | Fetch single news by slug with creator details |

Environment filtering via `getEnvironmentFilter()`:
- `ADMIN`: sees `local`, `preview`, `production`
- `PENGURUS`: sees `preview`, `production`
- `USER`/public: sees only `production`

---

## Schemas

### `schemas/index.ts`

```ts
export const createNewsSchema = z.object({
  judul: z.string().min(8).max(100),
  desckripsi: z.string().min(8),
  fileKey: z.string().min(8),
  catagory: z.string().refine((v) => CATAGORY_BERITA.includes(v as never)),
  ringkasan: z.string().min(8).max(100),
  environment: environmentSchema,
});

export type TcreateNewsSchema = z.infer<typeof createNewsSchema>;
```

---

## Client Components

### Form

| File | Component |
|------|-----------|
| `components/field/news-form.tsx` | `NewsFormField` — create/update form with UploaderPhoto, RichTextEditor, Select category |

### Feature Pages (`features/news/`)

| File | Component |
|------|-----------|
| `features/news/news-page.tsx` | `NewsPage` — main berita page with HeaderBerita + BeritaCatagory |
| `features/news/news-create-page.tsx` | `NewsCreatePage` — create form wrapper |
| `features/news/news-update-page.tsx` | `NewsUpdatePage` — update form wrapper |
| `features/news/news-detail-page.tsx` | `NewsDetailPage` — detail page |

### Feature Components (`features/news/`)

| File | Component |
|------|-----------|
| `features/news/berita-catagory.tsx` | `BeritaCatagory` — tab filter + grid of FrameNews cards |
| `features/news/header.tsx` | `HeaderBerita` — page header |
| `features/news/news-detail/index.tsx` | `NewsDetailComponent` — full detail with sanitized HTML, drawer actions |
| `features/news/create/index.tsx` | `CreateNewsComponent` — wrapper |
| `features/news/update/index.tsx` | `UpdateNewsComponent` — wrapper with data fetching |

### Home Page Components (`features/home/news/`)

| File | Component |
|------|-----------|
| `features/home/news/berita-terbaru.tsx` | Server component — "Berita terbaru" section |
| `features/home/news/render-news.tsx` | Client component — fetches + renders up to 6 FrameNews cards |

### Shared Components

| File | Component |
|------|-----------|
| `components/cards/card-news.tsx` | `FrameNews` — card with thumbnail, category badge, title, date |
| `components/sections/news-section.tsx` | `NewsSection` — landing page section |
| `components/skeletons/news-catagory-skeleton.tsx` | `NewsCaratogorySkeleton` — loading state |

### Upload

| File | Component |
|------|-----------|
| `features/uploads/upload-event-news.tsx` | `UploaderPhoto` — shared upload component for news & event (drag-drop, preview, max 4MB) |

---

## Routes

| URL | Access | Layout | Description |
|-----|--------|--------|-------------|
| `/berita` | Public | Public | List semua berita (production only) |
| `/berita/[slug]` | Public | Public | Detail berita (read-only, login banner for non-auth) |
| `/home/berita` | Protected | HomeLayoutComponent | Berita page with tab filters + CRUD |
| `/home/berita/create` | Protected | HomeLayoutComponent | Create form |
| `/home/berita/[slug]` | Protected | HomeLayoutComponent | Detail with edit/delete for owner |
| `/home/berita/update/[slug]` | Protected | HomeLayoutComponent | Update form |

**Public route metadata:** `/berita/[slug]/page.tsx` generates OG metadata (title, description, OG image, article published time, Twitter card).

---

## Hooks

| File | Exports |
|------|---------|
| `hooks/use-news.ts` | `useNews()`, `useNewsBySlug({ slug })` — TanStack React Query hooks |

---

## Security

- Server actions check `studentAccount()` — must be authenticated
- Update/delete: ownership check (`userId === session.user.id`)
- Public routes: read-only, session opsional (detail page show login banner for non-auth)
- Environment filtering: role-based visibility

## Design Tokens

Same as design-guideline.md (CSS variables, Inter font, 8px grid).

## Testing Checklist

- [ ] Buat berita — semua field valid
- [ ] Update berita — pre-fills, ownership check
- [ ] Delete berita — confirmation dialog + UploadThing cleanup
- [ ] Kategori filter — 8 tabs work correctly
- [ ] Public routes — non-auth users can see production berita
- [ ] Environment filter — admin sees all envs, user sees production only
- [ ] Empty state → DataKosong component
- [ ] Loading state → skeleton
