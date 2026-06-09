# Event — Implementation Plan

## Status

status: done

## Changelog

### 2026-06-09 — Responsive layout fix (mobile/PWA)

- **`components/field/event-form.tsx`**:
  - Container dua grup date+time diubah dari `flex` (side-by-side di semua layar) menjadi single column (`space-y-4`), masing-masing grup full-width
  - Dalam setiap grup, date picker dan time input disejajarkan horizontal (`flex flex-col sm:flex-row`): date picker mengambil sisa ruang (`flex-1`), time input fixed width (`sm:w-36`). Di mobile (<640px) mereka stack vertikal
  - Ini membuat kedua grup (Tanggal Acara & Batas Daftar) simetris sempurna dan tidak tabrakan di mobile/PWA
- **`components/dates/date-picker-future.tsx`**: Tombol `DatePickerField` diubah dari `w-60` (fixed 240px) menjadi `w-full md:w-60` agar menyesuaikan lebar layar mobile.

---

## 1. Overview

Event (Acara) feature for PPI Bartin web. Users can create, view, update, and delete events. Events have a date/time, location, description, capacity limit, and registration deadline with time.

---

## 2. Database Model (Prisma)

### `Event`

```prisma
model Event {
  id          String    @id @default(uuid())
  judul       String
  lokasi      String
  date        DateTime
  deskripsi   String
  maxCapacity Int       @default(0)
  batasDaftar DateTime
  fileKey     String
  slug        String    @unique
  environment String    @default("production")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  creator     User      @relation("createdEvents", fields: [userId], references: [id], onDelete: Cascade)
  EventPendaftar EventPendaftar[]

  @@map("event")
}

model EventPendaftar {
  id        String   @id @default(uuid())
  eventId   String
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  kehadiran Boolean  @default(false)

  @@unique([eventId, userId])
  @@map("eventPendaftar")
}
```

---

## 3. Server Actions

### `server/actions/acara.ts`

| Action | Function | Input | Output | Auth |
|--------|----------|-------|--------|------|
| createAcara | `createAcara(data)` | `TcreateEventSchema` | `TServerPrompt` (slug) | student |
| updateAcara | `updateAcara(slug, data)` | slug + `TcreateEventSchema` | `TServerPrompt` | student + owner |
| deleteAcara | `deleteAcara(eventId)` | eventId | `TServerPrompt` | student + owner |
| daftarAcara | `daftarAcara(eventId)` | eventId | `TServerPrompt` | student |
| batalkanDaftarAcara | `batalkanDaftarAcara(eventId)` | eventId | `TServerPrompt` | student |

### `server/data/acara.ts`

| Function | Description |
|----------|-------------|
| `getAcara()` | Fetch all events filtered by environment+role |
| `getAcaraBySlug(slug)` | Fetch single event by slug with registration count |
| `getPesertaBySlug(slug)` | Fetch all registrants for an event |

Environment filtering via `getEnvironmentFilter()` (same pattern as news).

---

## 4. Schemas

### `schemas/index.ts`

```ts
export const createEventSchema = z.object({
  judul: z.string().min(8),
  lokasi: z.string().min(4),
  date: z.date(),
  deskripsi: z.string().min(8),
  maxCapacity: z.number().min(0),
  batasDaftar: z.date(),
  dateTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tidak valid").optional(),
  batasDaftarTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tidak valid").optional(),
  fileKey: z.string().min(8),
  environment: environmentSchema,
});

export type TcreateEventSchema = z.infer<typeof createEventSchema>;
```

Validasi `batasDaftar <= date` dilakukan di `onSubmit` form (setelah `mergeTime`), bukan di Zod — karena Zod tidak punya akses ke merged value.

---

## 5. Client Components

### Form

| File | Component |
|------|-----------|
| `components/field/event-form.tsx` | `EventFormField` — create/update form with date picker + time input |

### Feature Pages (`features/events/acara/`)

| File | Component |
|------|-----------|
| `features/events/acara/event-page.tsx` | `EventPage` — list page with category filter |
| `features/events/acara/event-create-page.tsx` | `EventCreatePage` — create form wrapper |
| `features/events/acara/event-update-page.tsx` | `EventUpdatePage` — update form wrapper |
| `features/events/acara/event-detail/index.tsx` | `EventDetailComponent` — detail page with registration |

### Cards

| File | Component |
|------|-----------|
| `components/cards/card-event.tsx` | `FrameEvent` — event card with date, capacity, deadline |

### Registration

| File | Component |
|------|-----------|
| `features/events/acara/event-detail/pendaftar.tsx` | `PendaftarSection` — list of registered participants |

---

## 6. Routes

| URL | Access | Layout |
|-----|--------|--------|
| `/home/acara` | student | HomeLayoutComponent |
| `/home/acara/create` | student | HomeLayoutComponent |
| `/home/acara/[eventSlug]` | student | HomeLayoutComponent |
| `/home/acara/update/[slug]` | student (owner) | HomeLayoutComponent |

---

## 7. Hooks

| File | Exports |
|------|---------|
| `hooks/use-acara.ts` | `useAcara()`, `useAcaraBySlug()`, `usePesertaBySlug()` — TanStack React Query hooks |
| `hooks/use-daftar-acara.ts` | `useDaftarAcara()`, `useBatalkanDaftarAcara()` — mutation hooks |

---

## 8. Security

- Server actions check `studentAccount()` — must be authenticated
- Update/delete: ownership check (`userId === session.user.id`)
- Event registration: prevents duplicate registration, checks capacity
- Environment filtering: users only see events matching their role level

## 9. Design Tokens

Same as design-guideline.md (CSS variables, Inter font, 8px grid).

## 10. Testing Checklist

- [ ] Create event — all fields valid
- [ ] Update event — pre-fills existing data with time
- [ ] Delete event — confirmation dialog
- [ ] Register for event — capacity check
- [ ] Cancel registration
- [ ] Unauthorized access → redirect
- [ ] Invalid input → error messages
- [ ] Empty state (no events) → DataKosong component
