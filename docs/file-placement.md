# File Placement Rules

Aturan penempatan file berdasarkan struktur proyek yang sudah ada. Tujuan: konsistensi, predictability, dan tidak ada tumpang tindih antara shared code dan feature-specific code.

---

## Root Directories

```
app/              # Halaman dan routing (Next.js App Router)
components/       # Komponen UI shared — reusable, feature-agnostic
features/         # Logika dan UI per fitur
hooks/            # Shared custom React hooks
types/            # Shared TypeScript type definitions
utils/            # Shared pure utility functions
lib/              # Konfigurasi dan helper (auth, prisma, env, supabase, uploadthing)
server/           # Server-only logic (actions, data fetching, adapters)
prisma/           # Skema database
schemas/          # Zod validation schemas
public/           # Aset statis (manifest, service worker, ikon, logo)
docs/             # Dokumentasi fitur dan panduan
icons/            # Custom icon components (index.tsx + SVGs)
props/            # JSON mock data untuk form fields
```

---

## `app/` — Routing Only

- Hanya berisi page files (`page.tsx`, `layout.tsx`, `loading.tsx`)
- Group routes dengan `(public)/`, `(protected)/`
- **Tidak boleh** ada logika bisnis di sini — impor dari `features/` atau `components/`

```
app/
├── (public)/
│   ├── acara/
│   ├── berita/
│   └── login/
├── (protected)/
│   └── home/
│       ├── acara/
│       ├── berita/
│       └── profile/
├── api/
├── globals.css
├── layout.tsx
└── page.tsx
```

---

## `components/` — Shared UI Primitives

Hanya komponen yang bisa dipakai ulang lintas fitur. Jangan taruh komponen spesifik-fitur di sini.

```
components/
├── ui/               # Atomic: button, input, dialog, select, card, badge, table, sidebar, dll.
├── layout/           # Layout wrappers: home-layout, responsive-page-container
├── shared/           # Cross-cutting: share-popover, delete-dialog, nav-main-event
├── cards/            # Reusable cards: card-event, card-news
├── field/            # Form fields: event-form, calendar-event-form, news-form, create-bantuan
├── providers/        # React context: realtime, tanstack-query, theme
├── sections/         # Landing page: navbar, hero, features, footer
├── skeletons/        # Loading skeletons
├── sidebar/          # App sidebar: nav-user, nav-main, app-sidebar
├── dashboard/        # Dashboard: data-table, columns
├── dates/            # Date picker
├── animate-ui/       # Animated: dialog, alert-dialog, tooltip
└── kokonutui/        # Third-party patterns
```

---

## `features/` — Feature Code

Setiap fitur adalah sub-direktori. Komponen spesifik-fitur taruh di `features/<feature>/components/`.

**Aturan:**
- `features/<feature>/components/` — semua komponen (.tsx)
- **Tidak boleh** ada `hooks/`, `types/`, `utils/` di dalam feature
- Hooks → taruh di root `hooks/`
- Types → taruh di root `types/`
- Utils → taruh di root `utils/`
- Barrel export (`index.ts` / `components.ts`) — opsional, hanya kalau ada komponen yang dipakai fitur lain. Kalau cuma dipakai di dalam feature sendiri, nggak perlu.

```
features/
├── calendar/
│   └── components/         # calendar-view, calendar-mini, event-list, event-dialog, dll.
├── account/
│   ├── auth/
│   ├── profile/            # tab-kegiatan, profile-header, profile-content
│   └── registering/        # 01, 02, 03 step pages
├── events/
│   ├── acara/              # event-detail, create, update
│   ├── components.ts       # barrel export
│   └── events-page.tsx
├── news/
│   ├── create/
│   ├── update/
│   ├── news-detail/
│   ├── components.ts
│   └── news-page.tsx
├── home/
│   ├── events/
│   ├── news/
│   └── home-page.tsx
├── uploads/
├── dashboard/
├── notifications/
└── realtime/
```

---

## `hooks/` — Shared Custom Hooks

Semua custom React hooks yang dipakai lintas fitur atau dalam satu fitur tapi perlu di-share.

- Nama file: `use-<nama>.ts` / `use-<nama>.tsx`
- Contoh: `use-calendar.ts`, `use-events.ts`, `use-news.ts`, `use-users.ts`, `use-mobile.ts`

```
hooks/
├── use-calendar.ts
├── use-events.ts
├── use-news.ts
├── use-users.ts
├── use-mobile.ts
├── use-construct-url.ts
└── ...
```

---

## `types/` — Shared Type Definitions

Semua type/interface yang dipakai lintas fitur.

- `types/index.ts` — types general proyek (Tparticipants, TupdateEventProps, TCatagory, dll.)
- `types/<domain>.ts` — types per domain (misal `types/calendar.ts` untuk CalendarEvent, Category)

```
types/
├── index.ts          # Tparticipants, TupdateEventProps, TCatagory, TServerPrompt, dll.
└── calendar.ts       # CalendarEvent, Category, ViewType, DialogState
```

---

## `utils/` — Shared Pure Functions

Fungsi utility murni (tanpa side effect, tanpa React) yang dipakai lintas fitur.

```
utils/
├── calendar-utils.ts       # date-fns helpers untuk calendar
├── date-format.ts          # Format tanggal umum
├── slug.ts                 # Slug generation
├── image-url.ts            # URL image helpers
├── copy-link.ts            # Clipboard helpers
└── get-twowords.ts         # Text helpers
```

---

## `server/` — Server-Only Code

```
server/
├── actions/           # Server actions ("use server")
│   ├── acara.ts           # CRUD events
│   ├── news.ts            # CRUD news
│   ├── user.ts            # User management
│   ├── profile.ts         # Profile update
│   ├── calendar-entry.ts  # CRUD personal calendar entries
│   ├── subscribe-notification.ts
│   └── ...
├── data/              # Data access / query functions
│   ├── users.ts
│   ├── events.ts
│   └── news.ts
└── adapters/
    └── index.ts
```

---

## `lib/` — Configurations & Clients

```
lib/
├── auth/              # Better Auth config
├── db/                # Prisma client singleton (index.ts)
├── env/               # Environment variable validation
├── supabase/          # Supabase client
├── uploadthing/       # UploadThing config
├── push/              # Web push helpers
├── generated/         # Auto-generated Prisma client
├── utils.ts           # General lib helpers
└── og.ts              # Open Graph helpers
```

---

## `schemas/` — Validation Schemas

Zod schemas untuk form validation.

```
schemas/
├── index.ts           # createEventSchema, dll.
└── utils.ts           # Schema utilities
```

---

## Ringkasan Aturan

| Tipe File | Lokasi | Contoh |
|-----------|--------|--------|
| Page/route | `app/` | `app/(protected)/home/profile/page.tsx` |
| Shared UI component | `components/ui/` | `components/ui/button.tsx` |
| Feature component | `features/<name>/components/` | `features/calendar/components/calendar-mini.tsx` |
| Field form | `components/field/` | `components/field/calendar-event-form.tsx` |
| Custom hook | `hooks/` | `hooks/use-calendar.ts` |
| Type definition | `types/` | `types/calendar.ts` |
| Utility function | `utils/` | `utils/calendar-utils.ts` |
| Server action | `server/actions/` | `server/actions/calendar-entry.ts` |
| Data query | `server/data/` | `server/data/users.ts` |
| Zod schema | `schemas/` | `schemas/index.ts` |
| Prisma schema | `prisma/` | `prisma/schema.prisma` |
| Config/client | `lib/` | `lib/db/index.ts` |
| Docs | `docs/` | `docs/file-placement.md` |

**Golden rule:** hooks, types, dan utils milik sebuah feature tidak boleh disembunyikan di dalam `features/<name>/`. Taruh di root `hooks/`, `types/`, `utils/` agar mudah ditemukan dan dipakai lintas fitur.
