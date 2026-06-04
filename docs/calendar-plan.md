# Calendar Feature — Profile Event Tab

## Status
- ✅ Semua komponen, hooks, types, utils terimplementasi
- ✅ Split layout: mini calendar (sticky desktop) + split event list
- ✅ Mini calendar: react-day-picker v9, custom classes, DS-styled
- ✅ Split event list: dua section — "Kegiatan Sendiri" + "Event Terdaftar"
- ✅ View toggle: segmented control (Harian / Agenda)
- ✅ Personal entries: CRUD via Dialog + server actions (CalendarEntry model)
- ✅ Participant events: read-only, link ke `/home/acara/[slug]`
- ✅ CalendarEntry model di Prisma, udah `prisma db push`
- ✅ Server actions: createEntry, updateEntry, deleteEntry (validasi ownership)
- ✅ React Query invalidate after mutation
- ✅ Data flow: `getProfileUser` → participants[].event + calendarEntries
- ✅ `slug` field di query participant event
- ✅ Loading spinners (LoaderCircle + animate-spin) untuk submit & delete
- ✅ iOS auto-zoom fix: font-size 16px di input/textarea/select
- ✅ Event form: `@tanstack/react-form` + Zod v4 (no .optional())
- ✅ Event form di `components/field/calendar-event-form.tsx` (bukan di features/)
- ✅ hooks/types/utils di root level (bukan di features/calendar/)
- ✅ design-guideline.md updated dengan centralized field rule
- ✅ docs/file-placement.md updated
- ✅ `bg-surface-secondary` → `bg-surface-hover` (token tidak ada)
- ✅ Dead code di EventListItem (isParticipant) dibersihkan
- ✅ `npm run build` lulus zero errors

---

## Layout Choice: Split Layout (Mini Calendar + Split Event List)

### Mobile (<768px)

```
┌──────────────────────────┐
│  ◁  September 2025  ▷    │  ← Mini calendar (react-day-picker)
│  Su Mo Tu We Th Fr Sa    │
│      1  2  3  4  5  6    │
│  ...                     │
├──────────────────────────┤
│  SEL, 3 JUN 2025          │  ← Date header + [Harian|Agenda] toggle + [+]
├──────────────────────────┤
│  Kegiatan Sendiri         │
│  ● 09:00  Seminar        │  ← EventListItem (editable, click → dialog)
│  ● 14:30  Rapat          │
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│  Event Terdaftar          │
│  ● 10:00  Acara BEM      │  ← ParticipantEventRow (link, opacity-70)
└──────────────────────────┘
```

### Desktop (≥768px)

```
┌──────────────────────┬───────────────────────────────────┐
│  ◁  Sept 2025  ▷     │  SEL, 3 JUN 2025     [Hrn|Agd] [+]│
│  Su Mo Tu We ..      │                                    │
│        1  2  3  4    │  Kegiatan Sendiri                  │
│  ...                 │  ● 09:00  Seminar Beasiswa         │
│  sticky, self-start  │  ● 14:30  Rapat Kaderisasi        │
│                      │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─         │
│                      │  Event Terdaftar                   │
│                      │  ● 10:00  Acara BEM               │
└──────────────────────┴───────────────────────────────────┘
```

---

## Struktur Folder (Aktual)

```
components/
  field/
    calendar-event-form.tsx       # @tanstack/react-form + Field/Input/Textarea/Select
  ui/
    button.tsx
    dialog.tsx                      # shadcn Dialog (wrapper)
    input.tsx                       # text-base (16px, iOS fix)
    textarea.tsx                    # text-base (16px, iOS fix)
    select.tsx                      # text-base (16px, iOS fix)
    field.tsx                       # Field, FieldLabel, FieldError

features/
  calendar/
    components/
      calendar-mini.tsx             # react-day-picker v9 mini calendar
      split-event-list.tsx          # Split list: personal + participant, daily/agenda toggle
      event-list-item.tsx           # Single event row (editable, personal entries only)
      event-dialog.tsx              # shadcn Dialog (wrapper around calendar-event-form)
      category-dot.tsx              # 8px subtle dot
      event-form.tsx                # DELETED — moved to components/field/calendar-event-form.tsx
    hooks/                          # DELETED — moved to hooks/
      use-calendar.ts
    types/                          # DELETED — moved to types/
      index.ts
    utils/                          # DELETED — moved to utils/
      calendar-utils.ts

features/
  account/profile/
    tab-kegiatan.tsx                # Orchestrator: composes CalendarMini + SplitEventList + EventDialog
    tabs-section.tsx                # Parent tab container, imports TabKegiatan

hooks/
  use-calendar.ts                   # UI-only reducer (no events state, no SET_EVENTS)

types/
  calendar.ts                       # CalendarEvent, Category, ViewType, DialogState

utils/
  calendar-utils.ts                 # date-fns helpers
```

---

## Component Tree

```
TabKegiatan (features/account/profile/tab-kegiatan.tsx)
  ├── CalendarMini (features/calendar/components/calendar-mini.tsx)
  │     └── react-day-picker (v9, custom classNames API)
  │
  ├── SplitEventList (features/calendar/components/split-event-list.tsx)
  │     ├── Segmented control (Harian / Agenda)
  │     ├── "Kegiatan Sendiri" section
  │     │     ├── EventSection (daily view) — uses EventListItem
  │     │     └── AgendaGroup (agenda view) — uses EventListItem
  │     ├── "Event Terdaftar" section
  │     │     ├── ParticipantDaily — uses ParticipantEventRow (Link)
  │     │     └── ParticipantAgenda — uses ParticipantEventRow (Link)
  │     └── [+] button (opens add dialog)
  │
  └── EventDialog (features/calendar/components/event-dialog.tsx)
        └── EventForm (components/field/calendar-event-form.tsx)
              ├── Field + Input (title, time, location)
              ├── Field + Select (category)
              ├── Field + Textarea (description)
              ├── Submit button (with LoaderCircle spinner)
              └── Delete button (with LoaderCircle spinner)
```

---

## Data Flow

```
server/data/users.ts → getProfileUser() (server action via React Query)
       │
       ├── user.participants[].event  → { judul, date, slug }
       └── user.calendarEntries[]     → { id, title, date, time, location, category, description }
       │
       ▼
   TabKegiatan (useProfileUser hook)
       │  merge → CalendarEvent[] (dengan source: "participant" | "entry" + slug)
       │
       ▼
   SplitEventList (render events)
       │
       ▼
   EventDialog (on edit/add)
       │  handleSave/createEntry/updateEntry → server action → DB
       │  handleDelete/deleteEntry           → server action → DB
       │
       ▼
   queryClient.invalidateQueries(["profileUser"]) → refetch → re-render
```

---

## Types (types/calendar.ts)

```ts
export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  category: Category;
  description?: string;
  slug?: string;              // untuk participant → link ke event detail
  source: "participant" | "entry";
};

export type ViewType = "daily" | "agenda";

export type DialogState = {
  open: boolean;
  mode: "add" | "edit";
  event?: CalendarEvent;
};
```

---

## useCalendar Hook (UI-only)

```ts
type State = { selectedDate: Date; view: ViewType; dialog: DialogState };
type Action =
  | { type: "SELECT_DATE"; payload: Date }
  | { type: "SET_VIEW"; payload: ViewType }
  | { type: "OPEN_DIALOG"; payload: { mode: "add" | "edit"; event?: CalendarEvent } }
  | { type: "CLOSE_DIALOG" };
```

- **Tidak ada** penyimpanan events di state
- **Tidak ada** SET_EVENTS action
- Events di-pass sebagai props dari TabKegiatan (parent)
- UI-only: selectedDate, view (daily/agenda), dialog state

---

## CalendarEntry Prisma Model

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

## Server Actions (server/actions/calendar-entry.ts)

| Action        | Validasi                              | Effect                        |
| ------------- | ------------------------------------- | ----------------------------- |
| createEntry   | studentAccount() → userId             | INSERT ke CalendarEntry       |
| updateEntry   | entry.userId === session.user.id      | UPDATE field yang berubah     |
| deleteEntry   | entry.userId === session.user.id      | DELETE dari DB                |

Semua return `TServerPrompt { status, msg }`.

---

## Key Behaviors

| Element               | Personal Entry (source: "entry")                | Participant Event (source: "participant")      |
| --------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Click                 | Opens EventDialog in edit mode                  | Navigasi ke `/home/acara/[slug]` via `<Link>`  |
| Edit                  | ✅ Via dialog                                   | ❌ Read-only                                   |
| Delete                | ✅ Tombol "Hapus event" di dialog               | ❌                                              |
| Visual                | Full opacity, hover bg change                   | opacity-70, hover bg change                    |
| Time                  | Dari field `event.time`                         | Dari `format(event.date, "HH:mm")` (DateTime)  |

---

## View Modes

### Harian (daily)
- Filter events by `selectedDate` (isSameDay)
- Dua section terpisah: personal entries + participant events
- Empty states masing-masing section

### Agenda
- Group semua events by date (via groupEventsByDate)
- Sort asc by date
- Date separator baris
- Empty state hanya muncul kalo total events = 0

---

## Desktop Split Layout

```
// Tailwind classes (desktop):
<div className="flex flex-col md:flex-row md:gap-6">
  <div className="md:basis-70 md:shrink-0 md:sticky md:top-4 md:self-start">
    <CalendarMini />
  </div>
  <div className="flex-1 min-w-0 mt-4 md:mt-0">
    <SplitEventList />
  </div>
</div>
```

- Mobile: stack (calendar di atas, list di bawah)
- Desktop: `md:flex-row`, gap 24px, calendar sticky (280px basis)

---

## Design Tokens Used

| Token              | Value (Light) | Value (Dark)  | Usage                              |
| ------------------ | ------------- | ------------- | ---------------------------------- |
| --bg               | #FFFFFF       | #141414       | Page background                    |
| --surface          | #F7F7F5       | #1E1E1E       | Card container, segmented bg       |
| --surface-hover    | #EFEFED       | #272727       | Hover state, segmented bg          |
| --surface-active   | #E8E8E5       | #2F2F2F       | Active/pressed state               |
| --border           | #E8E8E5       | #2A2A2A       | Dividers, borders                  |
| --text-primary     | #1A1A19       | #E8E8E6       | Titles, active text                |
| --text-secondary   | #6B6B68       | #8C8C8A       | Body text, date header, time       |
| --text-disabled    | #AFAFAC       | #5A5A58       | Labels, empty state, subtle text   |
| --accent           | #0F7DDB       | #3B9EFF       | Today ring, focus-visible          |
| --accent-subtle    | rgba(...0.08) |               | Category dot: beasiswa, pengumuman |
| --info-subtle      | rgba(...0.08) |               | Category dot: akademik             |
| --success-subtle   | rgba(...0.08) |               | Category dot: sosial               |
| --warning-subtle   | rgba(...0.08) |               | Category dot: olahraga             |
| --danger-subtle    | rgba(...0.08) |               | Category dot: kaderisasi           |

---

## Empty States

Setiap section di SplitEventList punya empty state sendiri:

| Section          | Daily View                        | Agenda View                              |
| ---------------- | --------------------------------- | ---------------------------------------- |
| Kegiatan Sendiri | "Belum ada catatan pribadi" +     | "Belum ada catatan pribadi"              |
|                  | "Tambah kegiatan untuk tanggal ini" |                                          |
| Event Terdaftar  | "Belum terdaftar di event"        | "Belum terdaftar di event"               |

---

## Loading States

| Action  | Indikator                           | Component         |
| ------- | ----------------------------------- | ----------------- |
| Submit  | `LoaderCircle` animate-spin + "Menyimpan..." | Submit button (disabled) |
| Delete  | `LoaderCircle` animate-spin + "Menghapus..." | Delete button (disabled, opacity-50) |

- `isSubmitting` dan `isDeleting` state dipisah (bisa submit sambil delete? gak, tapi states terpisah untuk kontrol yang jelas)
- `try/finally` → state di-reset even kalo error
- Dialog nutup setelah sukses (kalo error, tetap terbuka)

---

## iOS Auto-Zoom Fix

- Input/textarea/select font-size: `text-base` (16px)
- Ini threshold minimum iOS Safari supaya gak auto-zoom pas focus
- Berlaku di semua form, bukan cuma calendar
- Gak perlu `maximum-scale=1` — lebih accessible

---

## Aturan File Placement

1. **hooks/**, **types/**, **utils/** — root level, *bukan* di `features/<name>/`
2. **Form field components** — `components/field/<feature>-form.tsx`, *bukan* di `features/<name>/components/`
3. **UI primitives** — `components/ui/` (button, input, dialog, dll.)
4. **Feature components** — `features/<name>/components/` (komponen spesifik UI, bukan form)

---

## Design Rules Check

| Rule                                       | Status                                                      |
| ------------------------------------------ | ----------------------------------------------------------- |
| Use tokens, never hardcoded values         | ✅ All colors/spacing via CSS vars                          |
| 8px grid for spacing                       | ✅                                                          |
| Single column on mobile                    | ✅                                                          |
| Mono for all data, dates, numbers          | ✅ Date header, time — mono                                 |
| 44px minimum touch target                  | ✅ min-h-11 (44px)                                          |
| No shadows on static elements             | ✅ shadow-none default                                      |
| No colored button fills                   | ✅                                                          |
| Lucide icons, strokeWidth 1.5              | ✅ Chevron, Plus, LoaderCircle                              |
| Labels always uppercase                    | ✅ Date header uppercase                                    |
| Semantic colors on text/icons/borders only | ✅                                                          |
| No hardcoded white/black                   | ✅ Uses tokens                                              |
| @tanstack/react-form for forms             | ✅ calendar-event-form.tsx                                  |
| components/ui/ primitives for field inputs | ✅ Field, Input, Textarea, Select                           |
| components/field/ for form components      | ✅ calendar-event-form.tsx                                  |

---

## Potensi Pengembangan ke Depan

- [ ] Drag & drop reschedule (drag event ke tanggal lain di mini calendar)
- [ ] Repeat/recurring events
- [ ] Color picker per kategori (kustom)
- [ ] Export calendar (iCal/CSV)
- [ ] Sync dengan Google Calendar
- [ ] Notifikasi reminder
- [ ] Week view (alternate layout)
- [ ] Search/filter events
