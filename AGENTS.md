# AI Agent Rules — PPI Bartin Web

Dokumen ini berisi aturan untuk AI agent yang bekerja pada project ini. Setiap perubahan kode **wajib** mengikuti aturan di bawah ini.

---

## 1. Setiap Fitur Baru Wajib Ada Plan File

**Aturan:** Saat membuat fitur baru, **wajib** buat file `.md` di `docs/` **SEBELUM** menulis kode.

```
docs/
├── <nama-fitur>-plan.md    # ← wajib ada sebelum kode ditulis
```

**Template wajib plan file** (salin persis, isi semua section):

```md
# [Nama Fitur] — Plan

## Overview

Tujuan fitur ini dan masalah yang diselesaikan.

## Database Model (Prisma)

Tuliskan schema Prisma yang dibutuhkan, termasuk relasi.

## Server Actions

| Action  | Path                | Input         | Output           | Auth    |
| ------- | ------------------- | ------------- | ---------------- | ------- |
| createX | server/actions/x.ts | CreateXSchema | TServerPrompt<X> | student |

## Client Components

Daftar file yang akan dibuat di `features/<nama-fitur>/`.

## Routes

| URL          | Akses   | Layout              |
| ------------ | ------- | ------------------- |
| /dashboard/x | student | HomeLayoutComponent |

## Security

- Siapa yang bisa mengakses (role check)
- Data apa yang boleh dilihat per role
- Validasi apa yang ada di server side

## Design Tokens

CSS variables yang dipakai (contoh: `--primary`, `--muted`, dll).

## Testing Checklist

- [ ] Happy path
- [ ] Unauthorized access → redirect
- [ ] Input invalid → error message muncul
- [ ] Empty state → tampil dengan benar
```

**Setelah fitur selesai:** Tandai plan file dengan `status: done` di bagian atas. Jangan hapus.

---

## 2. Modifikasi Fitur yang Sudah Ada

**Aturan:** Saat mengedit fitur existing, cek dulu apakah ada `docs/<fitur>-plan.md`.

- Jika **ada** → update section yang berubah di plan file tersebut
- Jika **tidak ada** → buat plan file baru terlebih dahulu, dokumentasikan kondisi saat ini, lalu catat perubahan yang dilakukan

**Jangan langsung edit kode** tanpa tahu konteks fitur yang disentuh. Baca plan file-nya dulu.

---

## 3. Update Docs Saat Ada Perubahan

Setiap kali melakukan perubahan yang menyentuh area berikut, **wajib update** file terkait di `docs/` secara bersamaan:

| Area Berubah                                   | File Docs yang Wajib Diupdate                |
| ---------------------------------------------- | -------------------------------------------- |
| File structure / directory baru                | `docs/file-placement.md`                     |
| Komponen baru di `components/ui/`              | `docs/file-placement.md`                     |
| Feature baru di `features/`                    | `docs/file-placement.md` + `<fitur>-plan.md` |
| Server actions baru                            | `docs/file-placement.md`                     |
| Hooks baru                                     | `docs/file-placement.md`                     |
| Design system (warna, font, spacing, komponen) | `design-guideline.md`                        |
| Aturan AI agent berubah                        | `AGENTS.md` (file ini)                       |

**Prinsip:** Jangan suruh user bilang manual. Agent harus deteksi sendiri dan update docs secara otomatis.

---

## 4. Penempatan File (Ringkasan)

Detail lengkap ada di `docs/file-placement.md`. Ini ringkasan cepat:

```
app/              → routing only (page.tsx, layout.tsx)
components/       → shared UI, reusable
features/         → domain logic & UI per fitur
hooks/            → shared custom hooks (root level)
types/            → shared type definitions (root level)
utils/            → pure functions (root level)
server/actions/   → "use server" functions
server/data/      → data fetching functions
schemas/          → Zod schemas
lib/              → config & clients (auth, db, env)
docs/             → plan files & documentation
```

**Hooks, types, utils** milik suatu fitur tidak boleh disembunyikan di `features/<name>/`. Taruh di root.

---

## 5. Design System

Design guideline lengkap ada di `design-guideline.md` (root). Wajib diikuti untuk:

- Warna: token CSS variables only, **tidak boleh hardcode hex/rgb**
- Spacing: 8px grid
- Font: Inter (sans) + JetBrains Mono (data)
- Type scale: sesuai tabel di guideline
- Button: 4 variant (primary, outline, ghost, destructive)
- Cards: variant A (vertical/image-led) atau B (horizontal/content-led)
- Tidak ada colored button fills, tidak ada shadow di static elements

---

## 6. Performance

Project ini menggunakan **Vercel React Best Practices**. Referensi: `docs/performance-plan.md`.

Aturan otomatis:

- **Server Components** untuk fetching data — client component hanya kalau perlu interaktivitas
- **React.cache()** untuk deduplikasi server function yang dipanggil multiple kali
- **TanStack React Query** untuk client-side data fetching (bukan fetch manual di useEffect)
- **next/dynamic** untuk komponen berat (Tiptap, UploadThing, date picker)
- **useMemo/useCallback** untuk expensive computation
- **Jangan** barrel import untuk schemas — import langsung dari file spesifik

---

## 7. Pola Kode yang Sudah Ditetapkan

| Pola            | Wajib                                                                     |
| --------------- | ------------------------------------------------------------------------- |
| Server Actions  | `"use server"`, return `TServerPrompt<T>`                                 |
| Client fetching | TanStack React Query (`useQuery`/`useMutation`)                           |
| Forms           | `@tanstack/react-form` + `components/ui/field` components                 |
| Validation      | Zod schema di `schemas/`                                                  |
| Auth            | `studentAccount()` / `getCurrentUserRole()` dari `server/actions/account` |
| Layout          | `HomeLayoutComponent` (protected), `HeaderFieldLayout` (form pages)       |
| Icons           | Satu library konsisten (Lucide preferred), `@tabler/icons-react` existing |
| CSS             | Tailwind + CSS variables tokens                                           |
| Status badges   | `--success`/`--warning`/`--danger`/`--info` — outline style, no fill      |
| Empty state     | `text-disabled` centered + satu CTA                                       |
| Loading         | Skeleton di `components/skeletons/`                                       |
| Error           | `sonner` toast                                                            |

### Shape `TServerPrompt<T>`

Semua server action **wajib** return type ini:

```ts
// types/server.ts
export type TServerPrompt<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

**Contoh penggunaan:**

```ts
// server/actions/event.ts
"use server";

export async function createEvent(
  input: CreateEventInput,
): Promise<TServerPrompt<Event>> {
  try {
    // validasi role
    const account = await studentAccount();
    if (!account) return { success: false, error: "Unauthorized" };

    // validasi input
    const parsed = createEventSchema.safeParse(input);
    if (!parsed.success)
      return {
        success: false,
        error: "Validasi gagal",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };

    const event = await db.event.create({ data: parsed.data });
    return { success: true, data: event };
  } catch (e) {
    return { success: false, error: "Terjadi kesalahan server" };
  }
}
```

---

## 8. Security

Setiap fitur yang menyentuh data user **wajib** mengikuti checklist ini:

- **Auth check di server action** — jangan percaya state client. Selalu panggil `studentAccount()` atau `getCurrentUserRole()` di awal setiap action
- **Ownership check** — jika data milik user tertentu, verifikasi `userId === session.user.id` sebelum read/write
- **Role-based access** — gunakan `getCurrentUserRole()` untuk fitur yang dibatasi role
- **Validasi input di server** — Zod schema wajib dijalankan di server action, bukan hanya di form client
- **Jangan expose data sensitif** — pastikan server action hanya return field yang dibutuhkan client, bukan seluruh row dari DB

```ts
// ✅ Benar
return { success: true, data: { id: user.id, name: user.name } };

// ❌ Salah — expose password hash, token, dll
return { success: true, data: user };
```

---

## 9. Environment Variables

- **Jangan hardcode** nilai apapun yang environment-specific (URL, key, secret)
- Semua env variable diakses melalui `lib/env.ts` yang sudah divalidasi dengan Zod
- Jika butuh env variable baru, tambahkan di `lib/env.ts` **dan** dokumentasikan di `.env.example`
- **Jangan pernah** akses `process.env.X` langsung di luar `lib/env.ts`

```ts
// ✅ Benar
import { env } from "@/lib/env";
const url = env.NEXT_PUBLIC_APP_URL;

// ❌ Salah
const url = process.env.NEXT_PUBLIC_APP_URL;
```

---

## 10. Aksesibilitas (Baseline)

Wajib dipenuhi untuk semua komponen UI:

- Semua elemen interaktif (`button`, `input`, `select`, `a`) harus bisa diakses via keyboard
- Gambar wajib punya `alt` yang deskriptif. Gambar dekoratif pakai `alt=""`
- Gunakan elemen semantik HTML (`<button>` bukan `<div onClick>`, `<nav>`, `<main>`, `<section>`)
- Label form selalu terhubung ke input (`htmlFor` / `aria-label`)
- Warna tidak boleh satu-satunya indikator status — selalu tambahkan teks atau icon

---

## 11. Testing

Project ini **tidak mewajibkan unit test** untuk semua kode, tapi agent **wajib** memastikan:

- Setiap server action punya **manual test checklist** di plan file-nya (lihat Section 1)
- Jika ada utils function yang pure dan kompleks, tulis unit test di `__tests__/<nama>.test.ts`
- Gunakan **Vitest** untuk unit test
- Jangan buat test file untuk komponen UI kecuali diminta user secara eksplisit

---

## 12. Verification Wajib — Lint & Build

**Aturan:** Setelah selesai melakukan perubahan kode, agent **wajib** menjalankan kedua perintah ini secara berurutan:

```bash
pnpm lint
pnpm build   # atau npx next build
```

- `pnpm lint` — cek ESLint, pastikan tidak ada error
- `pnpm build` — pastikan kompilasi TypeScript dan Next.js build sukses

Jika ada error, **jangan lanjut** — perbaiki dulu sampai kedua perintah lolos.

---

## 13. Commit Convention

Gunakan format **Conventional Commits**:

```
<type>(<scope>): <deskripsi singkat>
```

| Type       | Kapan dipakai                       |
| ---------- | ----------------------------------- |
| `feat`     | Fitur baru                          |
| `fix`      | Bug fix                             |
| `docs`     | Update dokumentasi saja             |
| `refactor` | Refactor tanpa perubahan fungsional |
| `chore`    | Update dependency, config, tooling  |
| `style`    | Perubahan styling/CSS saja          |

**Contoh:**

```
feat(event): tambah form pendaftaran event
fix(auth): perbaiki redirect setelah login
docs(agents): tambah section commit convention
```

- Scope mengikuti nama fitur atau area (`event`, `auth`, `profile`, `ui`, dll)
- Deskripsi dalam Bahasa Indonesia boleh
- Satu commit = satu concern, jangan campur fitur berbeda

---

## 14. Bahasa Respon

Saat bertanya ke user untuk klarifikasi:

- Jika user menulis dalam Bahasa Indonesia, jawab dalam Bahasa Indonesia
- Jika user menulis dalam Bahasa Inggris, jawab dalam Bahasa Inggris
- Jangan asumsikan bahasa default
