# Performance Optimization Plan

Berdasarkan audit menyeluruh menggunakan **Vercel React Best Practices** pada project ppi-bartin-web.

---

## Priority 0: Bug Fix Kritis (SEGERA DIPERBAIKI)

### 0.1 Fix isJoined Logic

**Lokasi:** `features/events/acara/event-detail/index.tsx:98`

**Masalah:** Logic boolean terbalik — user yang sudah join justru ditampilkan tombol "Join", dan sebaliknya. Ini **bug fungsional**, bukan sekadar masalah performa.

```ts
// ❌ SALAH — sekarang
const isJoined = !myParticipation;

// ✅ BENAR
const isJoined = !!myParticipation;
```

**Impact:** Fungsionalitas join event benar-benar broken untuk semua user.

---

## Priority 1: Eliminating Waterfalls (CRITICAL)

### 1.1 React.cache() untuk Session & Role Fetching

**Lokasi:** `server/actions/account.ts`, `server/data/news.ts`, `server/data/events.ts`, `server/data/users.ts`

**Masalah:** `auth.api.getSession()` dipanggil 4-5 kali dalam satu request halaman protected:

1. `(protected)/layout.tsx` — fetch session
2. `checkNoSiswa()` → `studentAccount()` → fetch session lagi
3. `getProfileUser()` → `studentAccount()` → fetch session lagi
4. `getAllEvents()` → `getCurrentUserRole()` → fetch session + user
5. `getNews()` → `getCurrentUserRole()` → fetch session + user

**Solusi:** Wrap `studentAccount()` dan `getCurrentUserRole()` dengan `React.cache()`:

```ts
import { cache } from "react";

export const getCurrentUserRole = cache(async () => { ... });
export const studentAccount = cache(async () => { ... });
```

**Impact:** Mengurangi ~8 database roundtrips per halaman protected menjadi ~2.

---

### 1.2 Parallelize Server Component Fetches

**Lokasi:** `app/(protected)/layout.tsx`

**Masalah:** Session fetch dan `checkNoSiswa()` berjalan sequential.

**Solusi:**

```ts
const [session, checkResult] = await Promise.all([
  auth.api.getSession({ headers: await headers() }),
  checkNoSiswa(),
]);
```

---

### 1.3 Server-Client Data Duplication (Detail Pages)

**Lokasi:** `app/(public)/berita/[slug]/page.tsx`, `app/(public)/acara/[eventSlug]/page.tsx`

**Masalah:** `generateMetadata` fetch data di server, lalu client component fetch data yang sama via React Query. `initialData` tidak digunakan.

**Solusi:** Pass server-fetched data sebagai `initialData` ke React Query di client component.

---

### 1.4 Static Generation + ISR untuk Halaman Publik

**Lokasi:** `app/(public)/berita/[slug]/page.tsx`, `app/(public)/acara/[eventSlug]/page.tsx`

**Masalah:** Halaman detail berita dan acara saat ini di-render via SSR setiap request, padahal kontennya jarang berubah. Ini membuang CPU server untuk konten yang identik.

**Solusi:** Gunakan `generateStaticParams` + `revalidate` agar halaman di-build saat deploy dan di-revalidate secara periodik:

```ts
// app/(public)/berita/[slug]/page.tsx
export async function generateStaticParams() {
  const allNews = await getAllNewsSlugs(); // query hanya slug, bukan full data
  return allNews.map((item) => ({ slug: item.slug }));
}

export const revalidate = 60; // revalidate setiap 60 detik (ISR)
```

**Impact:** Halaman publik jadi static HTML, TTFB turun drastis (~800ms → ~50ms). Tidak ada database query untuk setiap visitor.

---

### 1.5 Suspense Boundaries untuk Streaming

**Lokasi:** `app/(protected)/layout.tsx`, semua halaman dengan multiple async data fetches

**Masalah:** Tidak ada `<Suspense>` boundary di App Router. Seluruh halaman menunggu data terlambat sebelum kirim HTML apapun ke browser (all-or-nothing rendering).

**Solusi:** Wrap komponen yang fetch data independent dengan `<Suspense>`:

```tsx
// app/(protected)/dashboard/page.tsx
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileSection /> {/* fetch user profile */}
      </Suspense>
      <Suspense fallback={<EventsListSkeleton />}>
        <UpcomingEvents /> {/* fetch events */}
      </Suspense>
    </div>
  );
}
```

**Impact:** Browser menerima HTML shell lebih cepat. Komponen yang datanya tersedia duluan langsung tampil tanpa menunggu yang lain. Perceived performance meningkat signifikan.

---

### 2.1 Dynamic Imports untuk Heavy Pages

**Lokasi:** Semua halaman create/update event & news

**Masalah:** Tidak ada satupun `next/dynamic`. Tiptap editor (~200KB+), UploadThing, date pickers semuanya eager load.

**Komponen yang perlu di-dynamic-import:**

- `features/events/acara/create/content.tsx`
- `features/events/acara/update/content.tsx`
- `features/news/create/content.tsx`
- `features/news/update/content.tsx`
- `components/ui/rich-text-editor.tsx`
- `components/field/event-form.tsx`
- `components/field/news-form.tsx`

**Solusi:**

```ts
const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor"), {
  ssr: false,
  loading: () => <Skeleton />,
});
```

---

### 2.2 Konsolidasi Icon Library (1 library)

**Lokasi:** `package.json`

**Masalah:** Tiga icon library terinstall:
| Library | Ikon Digunakan | Estimasi Bundle Impact |
|---|---|---|
| `@tabler/icons-react` | ~65 icons | ~150-200KB gzipped |
| `lucide-react` | ~26 icons | ~40-60KB gzipped |
| `@phosphor-icons/react` | 2 icons | ~5-10KB gzipped |

**Solusi:** Pilih satu library (preferably `lucide-react` karena paling ringan). Migrasi semua import ke library yang dipilih. Hapus 2 library lainnya.

**Impact:** Hemat 150-250KB gzipped.

---

### 2.3 Hapus framer-motion (duplikasi dengan motion)

**Lokasi:** `package.json`

**Masalah:** `framer-motion` dan `motion` terinstall bersama. `motion` adalah subset dari framer-motion. Sebagian file import dari `"framer-motion"`, sebagian dari `"motion/react"`.

**Solusi:** Migrasi semua import ke `"motion/react"` dan hapus `framer-motion` dari dependencies.

---

### 2.4 Split schemas/index.ts (Barrel File)

**Lokasi:** `schemas/index.ts` (210 lines)

**Masalah:** File monolitik yang berisi semua Zod schema. Import 1 schema tarik semua schema termasuk createEvent, createNews, customerService, dll.

**Solusi:** Split ke file individu:

- `schemas/event.ts`
- `schemas/news.ts`
- `schemas/profile.ts`
- `schemas/customer-service.ts`
- `schemas/auth.ts`

---

### 2.5 Ganti Favicon ke WebP

**Lokasi:** `app/layout.tsx`, `public/logo-ppi.png`

**Masalah:** Favicon menggunakan PNG 502KB. WebP version (172KB) sudah tersedia di `public/logo-ppi-webp.webp`.

**Solusi:** Ganti referensi favicon ke WebP dengan PNG fallback.

---

### 2.6 Optimasi next/image untuk LCP

**Lokasi:** Semua komponen yang menampilkan gambar hero, cover berita, cover acara

**Masalah:** Gambar LCP (Largest Contentful Paint) kemungkinan tidak pakai prop `priority` dan `sizes` yang tepat, menyebabkan browser download gambar yang terlalu besar untuk viewport-nya.

**Solusi:**

```tsx
// Untuk hero image / gambar pertama yang visible di viewport
<Image
  src={coverUrl}
  alt={title}
  fill
  priority // ← wajib untuk LCP image, skip lazy loading
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>

// Untuk gambar di list (card-event, card-news) — JANGAN pakai priority
<Image
  src={thumbnailUrl}
  alt={title}
  width={400}
  height={250}
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

**Impact:** Mengurangi LCP score secara langsung. `sizes` yang tepat mencegah browser download gambar 2x–4x lebih besar dari yang dibutuhkan.

---

### 3.1 Konfigurasi staleTime di React Query

**Lokasi:** `components/providers/tanstack.tsx`

**Masalah:** `staleTime: 0` (default). Setiap navigasi atau komponen mount trigger refetch, walau data baru diambil detik sebelumnya.

**Solusi:**

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 detik
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

### 3.2 Consolidate Event Query Keys

**Lokasi:** `hooks/use-events.ts`

**Masalah:** Tiga hooks dengan query key berbeda untuk data yang identik (`getAllEvents()`):

- `useEvents` → key `["events"]`
- `useEventsHome` → key `["events_home"]`
- `useEventsPage` → key `["events_list"]`

**Solusi:** Gunakan satu query key `["events"]` dan bedakan via `select` atau `queryClient.getQueryData`.

---

### 3.3 Redundant Role Check di Server Data Functions

**Lokasi:** `server/data/news.ts`, `server/data/events.ts`

**Masalah:** Setiap public data function (getNews, getAllEvents, getEventBySlug, getNewsBySlug) memanggil `getCurrentUserRole()` yang melakukan 2 database query.

**Solusi:** Setelah React.cache() di implement (1.1), masalah ini otomatis teratasi. Selain itu, role bisa di-pass sebagai parameter dari server component.

---

## Priority 4: Client-Side Data Fetching (MEDIUM-HIGH)

### 4.1 AdminTicketDetail: Filter di Client

**Lokasi:** `features/customer-service/components/admin-ticket-detail.tsx`

**Masalah:** Fetch semua tickets lalu filter `find(t.id === ticketId)` di client. Boros bandwidth jika jumlah ticket besar.

**Solusi:** Buat server function `getTicketById(ticketId)` yang query spesifik.

---

## Priority 5: Re-render Optimization (MEDIUM)

### 5.1 Memoize HTML Processing

**Lokasi:** `features/events/acara/event-detail/index.tsx:114`, `features/news/news-detail/index.tsx:69`

**Masalah:** `processHtmlContent()` yang menjalankan `DOMPurify.sanitize` + `linkifyHtml` dipanggil setiap render.

**Solusi:** Wrap dengan `useMemo`:

```ts
const cleanDeskripsi = useMemo(
  () => processHtmlContent(data.deskripsi || ""),
  [data.deskripsi],
);
```

---

### 5.2 React.memo untuk List Items

**Lokasi:** Semua komponen yang di-map dalam list

**Komponen yang perlu React.memo:**

- `components/cards/card-event.tsx`
- `components/cards/card-news.tsx`
- `components/skeletons/card-event-skeleton.tsx`
- `components/skeletons/news-catagory-skeleton.tsx`
- `features/calendar/components/event-list-item.tsx`

---

### 5.3 Memoize Filter + Map Chain

**Lokasi:** `features/news/berita-catagory.tsx:83-89`

**Masalah:** `.filter().map()` berjalan 11 kali (per kategori) setiap render tanpa memo.

**Solusi:**

```ts
const filteredNews = useMemo(
  () =>
    data.filter((n) => (category === "all" ? true : n.catagory === category)),
  [data, category],
);
```

---

### 5.4 Move DOMPurify.addHook ke useEffect

**Lokasi:** `features/events/acara/event-detail/index.tsx:44-50`, `features/news/news-detail/index.tsx:49-55`

**Masalah:** `DOMPurify.addHook` dipanggil di module scope. Bisa double-register kalau component remount.

**Solusi:** Pindahkan ke `useEffect` dengan cleanup, atau inisialisasi sekali di root layout.

---

## Priority 6: Rendering Performance (MEDIUM)

### 6.1 Gunakan content-visibility untuk Long Lists

**Lokasi:** List berita, events, tickets

**Solusi:** Tambahkan CSS class:

```css
.content-visibility-auto {
  content-visibility: auto;
  contain-intrinsic-size: 200px;
}
```

---

### 6.2 Gunakan useTransition untuk Tab Filtering

**Lokasi:** `features/news/berita-catagory.tsx`

**Solusi:** Bungkus state update tab dengan `startTransition` agar UI tetap responsif.

---

## Priority 7: JavaScript Performance (LOW-MEDIUM)

### 7.1 Cleanup archive/unused/

**Lokasi:** `archive/unused/` (11 files, ~56KB)

**Masalah:** Dead code yang tetap di-track dan bisa membingungkan developer.

---

## Priority 8: Advanced Patterns (LOW)

### 8.1 next.config.ts Optimizations

**Lokasi:** `next.config.ts`

**Tambahkan:**

```ts
experimental: {
  optimizePackageImports: ["@tabler/icons-react", "lucide-react"],
},
```

---

## Summary by Category

| Kategori        | Temuan                                                                                                                  | Dampak                      | Prioritas   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------- |
| **Bug Fix**     | 1 masalah (isJoined logic terbalik)                                                                                     | **Kritis — broken feature** | 🚨 Segera   |
| Data Fetching   | 7 masalah (duplikasi session, no cache, waterfall, query key fragmented, server-client dup, no static gen, no Suspense) | Sangat Tinggi               | 🔴 Critical |
| Bundle Size     | 6 masalah (no dynamic imports, 3 icon libs, barrel file, framer+motion, PNG favicon, next/image)                        | Sangat Tinggi               | 🔴 Critical |
| Server-Side     | 3 masalah (staleTime default, query key fragmentasi, redundant role check)                                              | Tinggi                      | 🟡 High     |
| Client Fetching | 1 masalah (filter di client)                                                                                            | Sedang                      | 🟡 High     |
| Re-render       | 4 masalah (HTML processing, React.memo, filter.map, addHook)                                                            | Sedang                      | 🟡 High     |
| Rendering       | 2 masalah (content-visibility, useTransition)                                                                           | Sedang                      | 🟢 Medium   |
| JS Performance  | 1 masalah (dead code cleanup)                                                                                           | Rendah                      | 🟢 Medium   |
| Advanced        | 1 masalah (next.config optimization)                                                                                    | Rendah                      | 🔵 Low      |

---

_Generated: 9 June 2026_
_Berdasarkan Vercel React Best Practices — 70 rules across 8 categories_
