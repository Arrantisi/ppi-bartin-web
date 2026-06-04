# Calendar Feature — Profile Event Tab

## Status
- ✅ All components built and styled per DS
- ✅ Split layout (mini calendar + event list)
- ✅ Today indicator: ring-accent (1px border), no fill
- ✅ Grid layout: `grid grid-cols-7` for weekdays & weeks
- ✅ No `getDefaultClassNames()` — all custom classes
- ✅ Nav arrows: raw Lucide icons, no buttonVariants wrapper
- ✅ "+ Tambah Event" CTA removed from event-list (read-only for real events)
- ✅ `npm run build` lulus zero errors
- ⏳ **Persistence**: Add/edit/delete masih lokal `useReducer` — perlu wiring ke DB via `CalendarEntry` model

---

## Layout Choice: Split Layout (Mini Calendar + Event List)

### Mobile (<768px)

```
┌──────────────────────────┐
│  ◁  September 2025  ▷    │  ← Mini calendar (react-day-picker)
│  Su Mo Tu We Th Fr Sa    │
│      1  2  3  4  5  6    │
│  ...                     │
├──────────────────────────┤
│  SEL, 3 JUN 2025          │  ← Selected date header (mono, uppercase)
├──────────────────────────┤
│  ● 09:00                 │
│    Seminar Beasiswa       │  ← Event cards per baris
│    Ruang A.103            │     category dot subtle
│                           │
│  ● 14:30                 │
│    Rapat Kaderisasi       │
│    Online                 │
└──────────────────────────┘
```

### Desktop (≥768px)

```
┌──────────────────────┬───────────────────────────────────┐
│                      │  SEL, 3 JUN 2025                   │
│  ◁  Sept 2025  ▷     │                                    │
│  Su Mo Tu We ..      │  ● 09:00  Seminar Beasiswa         │
│        1  2  3  4    │      Ruang A.103                   │
│  ...                 │                                    │
│                      │  ● 14:30  Rapat Kaderisasi         │
│                      │      Online                        │
└──────────────────────┴───────────────────────────────────┘
```

---

## Design Alignment dengan Design System

### Tone & Aesthetic

| Aspect       | Decision                         | Basis (design-guideline.md)                   |
| ------------ | -------------------------------- | --------------------------------------------- |
| **Tone**     | Notion-modern, minimal, refined  | "Notion-modern · Mobile-first · Dark & Light" |
| **Layout**   | Mobile stack → desktop split     | "Single column layout on mobile"              |
| **Calendar** | Navigasi tool, bukan fitur utama | Date picker spec in Forms section             |
| **Events**   | Chronological list, scannable    | Card Variant B — Horizontal (content-led)     |
| **Shadow**   | None on static elements          | "Static elements: no shadow"                  |

### Fonts

| Role                | Font | Size                    | Weight | Color          | Tracking                            |
| ------------------- | ---- | ----------------------- | ------ | -------------- | ----------------------------------- |
| Month/Year header   | sans | 0.9375rem               | 600    | text-primary   | -0.01em (H4)                        |
| Day name header     | sans | 0.6875rem               | 500    | text-disabled  | +0.05em (Label, uppercase)          |
| Day number          | sans | 0.875rem                | 400    | text-secondary | 0 (Body)                            |
| Selected day number | sans | 0.875rem                | 600    | text-inverse   | 0                                   |
| Today marker        | —    | 1px solid accent border | —      | —              | —                                   |
| Date header (list)  | mono | 0.8125rem               | 400    | text-secondary | 0 (Meta)                            |
| Event time          | mono | 0.8125rem               | 400    | text-secondary | 0 (Meta)                            |
| Event title         | sans | 0.875rem                | 600    | text-primary   | 0 (Body strong)                     |
| Event location      | sans | 0.75rem                 | 400    | text-disabled  | 0 (Small)                           |
| Category label      | sans | 0.6875rem               | 500    | text-disabled  | +0.05em (Label/Footnote, uppercase) |
| Empty state title   | sans | 0.9375rem               | 600    | text-primary   | -0.01em (H4)                        |
| Empty state body    | sans | 0.875rem                | 400    | text-secondary | 0 (Body)                            |

### Color Tokens

| Element               | Token                                                           | Notes                           |
| --------------------- | --------------------------------------------------------------- | ------------------------------- |
| Calendar container    | `--surface` bg, `--border` border                               | Card tokens                     |
| Nav arrows            | `--text-disabled` → hover `--text-primary`                      | Per date picker spec            |
| Day default           | `--text-secondary`                                              |                                 |
| Day hover             | `--surface-hover` bg                                            |                                 |
| Day selected          | `--text-primary` bg, `--text-inverse` text                      |                                 |
| Day today             | 1px solid `--accent` border (`ring-1 ring-accent`)              | Bukan filled circle             |
| Day outside month     | `--text-disabled` opacity 40%                                   |                                 |
| Day disabled          | `--text-disabled` opacity 40%                                   |                                 |
| Event item bg         | Transparent (divider-separated list)                            | Card Variant B list view        |
| Event item hover      | `--surface-hover` bg                                            |                                 |
| Divider               | 1px solid `--border`                                            |                                 |
| Category dot bg       | `--{category}-subtle`                                           | 8% opacity, subtle              |
| Selected date dot     | `--accent`                                                      | Small indicator on calendar     |
| Empty state icon      | `--text-disabled`                                               |                                 |

### Spacing (8px grid)

| Context                  | Value                       |
| ------------------------ | --------------------------- |
| Calendar wrapper padding | 16px (`--space-md`)         |
| Between calendar & list  | 24px (`--space-lg`) desktop |
| Event item padding Y     | 12px                        |
| Event item padding X     | 16px                        |
| Gap between event items  | 0 (divider separator)       |
| Gap time + title row     | 8px (`--space-sm`)          |
| Gap title + location row | 2px                         |
| Date header padding      | 12px 16px                   |
| Category dot size        | 8px                         |
| Touch target min         | 44px                        |

### Radius

| Context            | Value | Basis          |
| ------------------ | ----- | -------------- |
| Calendar container | 10px  | Card radius    |

---

## Stack (No New Libraries)

| Library             | Status               | Untuk                                         |
| ------------------- | -------------------- | --------------------------------------------- |
| react-day-picker    | ✅ Already installed | Mini month calendar                           |
| date-fns            | ✅ Already installed | Tanggal manipulation & formatting (id locale) |
| lucide-react        | ✅ Already installed | Chevron nav icons (Lucide preferred per DS)   |
| @tabler/icons-react | ✅ Already installed | Empty state icon only                         |
| @base-ui/react      | ✅ Already installed | Dialog + Tabs (line variant) di profile       |

---

## Struktur Folder

```
features/
  calendar/
    index.ts                      # Barrel exports
    components/
      calendar-view.tsx           # Container: split layout orchestrator
      calendar-mini.tsx           # Mini month (react-day-picker, DS-styled)
      event-list.tsx              # Date header + divider list (no CTA)
      event-list-item.tsx         # Satu baris event (horizontal card B)
      event-dialog.tsx            # @base-ui Dialog (add/edit)
      event-form.tsx              # react-hook-form + zod
      agenda-view.tsx             # Semua event mendatang (alternate view)
      category-dot.tsx            # Subtle color dot (--{cat}-subtle)

hooks/
  use-calendar.ts                 # useReducer + async server action calls

types/
  calendar.ts                     # CalendarEvent, Category, ViewType

utils/
  calendar-utils.ts               # date-fns helpers
```

---

## Kategori → Warna (Semantic Tokens)

| Kategori   | Dot BG (subtle)    | Contoh                          |
| ---------- | ------------------ | ------------------------------- |
| beasiswa   | `--accent-subtle`  | Seminar beasiswa, info beasiswa |
| akademik   | `--info-subtle`    | Kelas, workshop akademik        |
| sosial     | `--success-subtle` | Bakti sosial, gathering         |
| olahraga   | `--warning-subtle` | Turnamen, senam                 |
| pengumuman | `--accent-subtle`  | Announcement                    |
| kaderisasi | `--danger-subtle`  | Rapat kaderisasi, pelatihan     |

---

## Types

```ts
// types/index.ts
export type Category =
  | "beasiswa"
  | "akademik"
  | "sosial"
  | "olahraga"
  | "pengumuman"
  | "kaderisasi";

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  category: Category;
  description?: string;
  source: "participant" | "entry"; // membedakan real event vs personal entry
};

export type ViewType = "daily" | "agenda";

export type DialogState = {
  open: boolean;
  mode: "add" | "edit";
  event?: CalendarEvent;
};
```

**Perubahan:** Tambah field `source` di `CalendarEvent` untuk membedakan:
- `"participant"` — dari tabel `Participants` (real event, read-only)
- `"entry"` — dari tabel `CalendarEntry` (personal, bisa edit/hapus)

---

## Data Model — CalendarEntry (Prisma)

Model baru di `prisma/schema.prisma` untuk personal calendar entries:

```prisma
model CalendarEntry {
  id          String   @id @default(uuid())
  userId      String
  title       String
  date        DateTime
  time        String?
  location    String?
  category    String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("calendarEntry")
}
```

---

## Server Actions — `server/actions/calendar-entry.ts`

### createEntry
- Validasi: `studentAccount()` → userId dari session
- Insert ke `CalendarEntry` dengan data: title, date, time, location, category, description
- Return `TServerPrompt`

### updateEntry
- Validasi: entry milik user sendiri (userId === session.user.id)
- Update field yang berubah
- Return `TServerPrompt`

### deleteEntry
- Validasi: entry milik user sendiri
- Delete dari DB
- Return `TServerPrompt`

---

## Data Flow (Updated)

```
useProfileUser() (React Query)
       ↓
  getProfileUser() server action
       ├── user.participants[].event  → real events
       └── user.calendarEntries[]     → personal entries
       ↓
  TabKegiatan
       ↓  merge kedua sumber jadi CalendarEvent[] (tambah source field)
       ↓
  CalendarView (orchestrator)
       ↓
  useCalendar (useReducer — local UI state + async server calls)
       ↓
  event-list / event-dialog / calendar-mini
       ↓
  (add/edit/delete) → server action → React Query invalidation → re-render
```

**Aturan:**
- Entries dengan `source: "participant"` → **read-only** (bisa dilihat, diklik → lihat detail)
- Entries dengan `source: "entry"` → **bisa edit/hapus** via dialog
- Yang bisa "Tambah Event" hanya personal entries (`CalendarEntry`)
- Setelah server action sukses → `queryClient.invalidateQueries(["profileUser"])` → re-render otomatis

---

## Component Specifications

### calendar-mini.tsx

- Wrapper around react-day-picker (v9 `classNames` API)
- Styled per Date picker spec di design-guideline.md Forms section
- Tidak pakai `getDefaultClassNames()` — semua class custom
- "Today": `ring-1 ring-accent rounded-full` (1px solid border, no fill)
- "Selected": `bg-text-primary text-text-inverse rounded-full`
- Nav arrows: Lucide `ChevronLeftIcon` / `ChevronRightIcon`, 16px, no button wrapper
- Grid layout: `grid grid-cols-7` untuk `weekdays` dan `week`
- Container: surface bg, 1px border-border, radius 10px, padding 12px

```tsx
type Props = {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  events: CalendarEvent[];
};
```

### event-list.tsx

- Date header: mono 0.8125rem text-secondary, uppercase locale ("SEL, 3 JUN 2025")
- Divider-separated list (Card Variant B — horizontal, content-led)
- Empty: centered text "Tidak ada kegiatan" + "Pilih tanggal lain"
- **Tidak ada CTA button** — event list read-only, add/edit via entry source

```tsx
type Props = {
  selectedDate: Date;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  className?: string;
};
```

### event-list-item.tsx

- Horizontal layout: category dot | time (mono) | title + location stack
- Category dot: 8px circle, `--{category}-subtle` bg, flex-shrink 0
- Time column: mono 0.8125rem text-secondary, min-width 48px
- Title: 0.875rem/600 text-primary, single line truncate
- Location: 0.75rem text-disabled, single line truncate
- Touch target: min 44px
- Hover: `--surface-hover` bg
- Click: opens edit dialog (hanya untuk `source: "entry"`)

```tsx
type Props = {
  event: CalendarEvent;
  onEdit: () => void;
};
```

### category-dot.tsx

- Pure CSS: 8px `rounded-full`, background via inline style
- Map category → `var(--{name}-subtle)`

```tsx
type Props = {
  category: Category;
};
```

### calendar-view.tsx (Orchestrator)

```tsx
<CalendarMini selectedDate={...} onSelect={...} events={...} />
<EventList selectedDate={...} events={...} onEditEvent={...} />
<EventDialog
  open={dialog.open}
  mode={dialog.mode}
  event={dialog.event}
  onSave={handleSave}       // async — panggil server action
  onDelete={dialog.mode === "edit" ? handleDelete : undefined}
  onClose={closeDialog}
/>
```

### event-dialog.tsx + event-form.tsx

- @base-ui/react Dialog
- Form: react-hook-form + zod validation
- Fields: title (text), date (date picker), time (time), location (text), category (select), description (textarea)
- Submit handler: async — panggil `createEntry` / `updateEntry`, lalu invalidate query
- Delete: panggil `deleteEntry`, lalu invalidate query

### agenda-view.tsx

- Alternate view: all upcoming events grouped by month
- Same event-item styling
- Month separator: subheadline (0.6875rem uppercase text-disabled tracking 0.05em)

---

## Desktop Split Layout Logic

```
Mobile:                          Desktop:
┌──────────────────────┐         ┌──────────────────────┬───────────────────────┐
│  Calendar (full w)   │         │  Calendar (280px)    │  Event List (flex-1)  │
│  ─────────────────── │         │  sticky, self-start  │                       │
│  Date header         │         │                      │  Date header          │
│  ─────────────────── │         │                      │  ───────────────────  │
│  Event items         │         │                      │  Event items          │
└──────────────────────┘         └──────────────────────┴───────────────────────┘
```

- Desktop: `md:flex-row`, gap 24px
- Calendar panel: `md:basis-[280px] md:shrink-0 md:sticky md:top-4 md:self-start`
- Event list: `flex-1 min-w-0`
- Mobile: single column, calendar on top

---

## Empty State

```tsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <p className="text-sm text-text-secondary">Tidak ada kegiatan</p>
  <p className="text-xs text-text-disabled mt-1">
    Pilih tanggal lain
  </p>
</div>
```

---

## Design Rules Check (vs design-guideline.md)

| Rule                                       | Status                                                 |
| ------------------------------------------ | ------------------------------------------------------ |
| Use tokens, never hardcoded values         | ✅ All colors/spacing via CSS vars                     |
| 8px grid for spacing                       | ✅                                                     |
| Single column on mobile                    | ✅                                                     |
| Mono for all data, dates, numbers          | ✅ Date header, time — mono                            |
| One primary action per screen              | ✅ Tidak ada CTA, list read-only                       |
| 44px minimum touch target                  | ✅                                                     |
| No shadows on static elements              | ✅                                                     |
| No colored button fills                    | ✅ Tidak ada button filled                             |
| No colored dots (decorative)               | ⚠️ Category dots exist but functional, using subtle bg |
| Lucide icons, outlined, strokeWidth 1.5    | ✅ Chevron nav via lucide-react                        |
| Labels always uppercase                    | ✅ Date header uppercase                               |
| Semantic colors on text/icons/borders only | ✅                                                     |
| No hardcoded white/black                   | ✅ Uses tokens                                         |

---

## Urutan Implementasi (Sisa)

| #  | File                                          | What                                      |
| -- | --------------------------------------------- | ----------------------------------------- |
| 1  | `prisma/schema.prisma`                        | Tambah model `CalendarEntry`              |
| 2  | `npx prisma migrate dev`                      | Generate migration                        |
| 3  | `server/actions/calendar-entry.ts`            | createEntry, updateEntry, deleteEntry     |
| 4  | `server/data/users.ts`                        | Include `calendarEntries` di getProfileUser |
| 5  | `features/calendar/types/index.ts`            | Tambah field `source` di CalendarEvent    |
| 6  | `features/account/profile/tab-kegiatan.tsx`   | Merge participants + calendarEntries      |
| 7  | `features/calendar/hooks/use-calendar.ts`     | Ubah addEvent/updateEvent/deleteEvent jadi async |
| 8  | `features/calendar/components/calendar-view.tsx` | handleSave async + invalidate query   |
| 9  | `features/calendar/components/event-list-item.tsx` | Read-only state untuk participant source |
| 10 | `npx tsc --noEmit && npm run build`           | Verify                                    |
