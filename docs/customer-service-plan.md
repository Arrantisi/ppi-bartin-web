# Customer Service — Implementation Plan

## Overview

Customer Service (Umpan Balik) feature for PPI Bartin app. Users submit complaints/feedback with optional photo attachments via a form in their profile settings. Admin & Pengurus receive push notifications and can view/manage all tickets from within the profile settings tab.

---

## Database

### `CustomerService` — existing, added `files` relation

```prisma
model CustomerService {
  id         String               @id @default(cuid())
  catagory   String
  subject    String
  message    String
  status     String               // PENDING, READ, RESOLVED
  level      String               // rendah, sedang, darurat
  createdAt  DateTime             @default(now())
  resolvedAt DateTime?
  userId     String
  user       User                 @relation(fields: [userId], references: [id])
  files      CustomerServiceFile[]

  @@index([userId])
  @@index([status])
  @@map("customerService")
}
```

### `CustomerServiceFile` — new model for uploaded images

```prisma
model CustomerServiceFile {
  id        String         @id @default(cuid())
  fileKey   String
  fileUrl   String
  name      String?
  ticketId  String
  ticket    CustomerService @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  createdAt DateTime       @default(now())

  @@index([ticketId])
  @@map("customerServiceFile")
}
```

---

## UploadThing

### `app/api/uploadthing/core.ts` — added endpoint

```ts
onOploadCustomerService: f({
  image: { maxFileSize: "4MB", maxFileCount: 5 },
}).onUploadComplete(async ({ file }) => {
  return { key: file.key, url: file.ufsUrl, name: file.name };
}),
```

Max 5 images, 4MB each, for customer service photo attachments.

---

## Server Actions

### `server/actions/customer-service.ts` — Modified
- **`customerService()`** — accepts optional `fileKeys: string[]`, creates ticket + `CustomerServiceFile` records + push notification to ADMIN/PENGURUS

### `server/actions/customer-service-admin.ts` — Modified
- **`getTickets()`** — now includes `files` relation in query
- **`updateTicketStatus()`** — unchanged

### `server/data/customer-service.ts` — Modified
- **`getCustomerServiceData()`** — now includes `files` relation

---

## Schemas

### `schemas/index.ts` — Updated

```ts
export const customerServiceSchema = z.object({
  catagory: z.string().min(2, "catagory minimal 2 karakter"),
  subject: z.string().min(2, "subject minimal 2 karakter"),
  message: z.string().min(2, "message minimal 2 karakter"),
  level: z.string().min(2, "level minimal 2 karakter"),
  fileKeys: z.array(z.string()).optional(),
});
```

---

## Hooks

### `hooks/use-customer-service.ts`
- **`useCustomerServiceTickets()`** — React Query hook (includes file data)
- **`useUpdateTicketStatus()`** — mutation hook

---

## Components

### `features/customer-service/`
```
features/customer-service/
  components/
    customer-service-form.tsx    # Form + dropzone multi-file upload (max 5)
    admin-ticket-list.tsx        # List with sender avatar + file count
    admin-ticket-detail.tsx      # Detail with gallery + actions
  admin-list-page.tsx            # Page wrapper with HomeLayoutComponent
  admin-detail-page.tsx          # Page wrapper with HomeLayoutComponent
  customer-service-page.tsx      # Page wrapper with HeaderFieldLayout
```

### Form features:
- Drag & drop file upload (max 5 images, 4MB each)
- Upload progress indicator
- Image previews with remove button
- Stores `fileKey` → creates `CustomerServiceFile` records on submit

### Admin list features:
- Shows sender avatar (or initial fallback) — 44px on mobile, 40px desktop
- Shows file count per ticket
- Status badges (Pending/Dibaca/Selesai) — pill shape with icon
- Level badges (Rendah/Sedang/Darurat)
- **Mobile layout** (3 rows inside card):
  1. Title (truncated) + level badge
  2. Sender name + date (muted, smaller)
  3. Attachment info (left) + status pill (right)
- Avatar top-aligned (`self-start`) on mobile, center-aligned on desktop
- Card gap: `space-y-3` (12px)

### Admin detail features:
- Full ticket info with sender details
- Photo gallery grid (clickable to open full size)
- Status update actions (Tandai Dibaca / Tandai Selesai)

---

## Routes (all under profile, no dashboard)

| Route | File | Access |
|---|---|---|
| `/home/profile/customer-service` | `app/(protected)/home/profile/customer-service/page.tsx` | All users — form |
| `/home/profile/customer-service/list` | `app/(protected)/home/profile/customer-service/list/page.tsx` | Admin & Pengurus — list |
| `/home/profile/customer-service/list/[id]` | `app/(protected)/home/profile/customer-service/list/[id]/page.tsx` | Admin & Pengurus — detail |

---

## Profile Settings Tab (`tab-pengaturan.tsx`)

| Row | Visible to | Action |
|---|---|---|
| "Customer Service" | All users | Navigate to `/home/profile/customer-service` (form) |
| "Pesan Masuk" | Admin & Pengurus only | Navigate to `/home/profile/customer-service/list` |

---

## Security

- `getTickets()` and `updateTicketStatus()` check role via `getCurrentUserRole()` — throws if not ADMIN/PENGURUS
- Admin list page has client-side role check via `useEffect` + `getCurrentUserRole()`
- Regular users can only **create** tickets, cannot view any list

## Design Tokens

All code follows `design-guideline.md`:
- Font: `--font-sans` (Inter), `--font-mono` (JetBrains Mono)
- Colors: CSS variable tokens only
- Spacing: 8px grid
- Mono for all data/dates/IDs
- 44px minimum touch targets
- No shadows on static elements
- No colored button fills
