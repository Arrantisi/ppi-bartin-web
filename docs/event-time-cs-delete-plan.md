# Event Time & CS Delete — Implementation Plan

## Status

- ⏳ Planning phase
- ⏳ Belum ada implementasi

---

## 1. Event Form — Tambah Time Input

### Latar Belakang

Saat ini `Events.date` dan `Events.batasDaftar` adalah `DateTime` di Prisma, tapi form hanya pakai date-only picker (time selalu `00:00:00`). Kita tambah input time untuk "Mulai Acara" dan "Batas Daftar".

### Tidak Ada Migration

`date` dan `batasDaftar` sudah `DateTime` — kita hanya perlu set jam/menit dari input time. Zero migration.

### Files to Modify

#### `schemas/index.ts`

- Tambah field dengan validasi format ke `createEventSchema`:
  ```ts
  dateTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tidak valid").optional(),
  batasDaftarTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tidak valid").optional(),
  ```
- Di refinement `batasDaftar <= date`: **hapus refinement lama dari Zod schema** dan pindah validasi ke `onSubmit` di form, setelah `mergeTime` dipanggil:
  ```ts
  // di onSubmit, setelah merge:
  if (mergedBatasDaftar >= mergedDate) {
    form.setError("batasDaftarTime", {
      message: "Batas daftar harus sebelum waktu mulai acara",
    });
    return;
  }
  ```
  > ⚠️ **Jangan pakai `superRefine` di Zod untuk kasus ini** — Zod tidak punya akses ke merged value (hanya raw date tanpa time), sehingga comparasinya akan selalu salah. Validasi ini harus dilakukan di layer yang sudah punya merged value, yaitu `onSubmit`.

#### `utils/date-format.ts`

- Tambah `mergeTime` helper di sini (bukan inline di form, supaya bisa reused):
  ```ts
  export function mergeTime(date: Date, time?: string): Date {
    if (!time) return date;
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  }
  ```
  > ⚠️ **Timezone gotcha**: `setHours` set jam di local time browser. Kalau Prisma/server pakai UTC, pastikan app sudah konsisten pakai local time di semua tempat (misal: `new Date()` di form juga local). Kalau app sudah ada pattern ini dan berjalan benar untuk field lain, `mergeTime` ini aman. Kalau ragu, cek hasil `date.toISOString()` setelah `mergeTime` — jam-nya harus sesuai ekspektasi UTC yang akan disimpan.
- Tambah `formatDateTime(date: Date): string` — **selalu tampilkan jam** (bukan conditional), format `"E, LLL dd, y · HH:mm"`. Kalau mau conditional, cek `date.getHours() === 0 && date.getMinutes() === 0` lalu fallback ke `formattedDate`. Tentukan dulu mana yang dipakai dan konsisten.
  > ⚠️ **Locale**: Cek apakah `formattedDate` yang sudah ada pakai `{ locale: id }` dari `date-fns/locale/id`. Kalau iya, `formatDateTime` juga harus pakai locale yang sama supaya nama hari/bulan konsisten (tidak campur English dan Indonesia).

#### `components/field/event-form.tsx`

- `defaultValues`: tambah `dateTime: ""` dan `batasDaftarTime: ""`
- Mode `update`: extract time dari `data.date` / `data.batasDaftar` pake `format(date, "HH:mm")` buat pre-fill
- UI: di samping atau di bawah tiap `DatePickerField`, tambah `<Input type="time">`
- `onSubmit`: import `mergeTime` dari `@/utils/date-format`, lalu merge sebelum kirim ke server action:
  ```ts
  const mergedDate = mergeTime(values.date, values.dateTime);
  const mergedBatasDaftar = mergeTime(
    values.batasDaftar,
    values.batasDaftarTime,
  );
  // pastikan mergedDate dan mergedBatasDaftar yang dikirim, bukan values.date raw
  ```
- ⚠️ **Cek server action create/update event** — pastikan parameter yang diterima server action adalah `Date` (bukan date-only string), karena ini yang sering kelewat

#### `server/actions/event.ts` _(atau nama file server action event)_

- Verifikasi bahwa field `date` dan `batasDaftar` diterima sebagai `Date` utuh, bukan di-coerce ulang ke `startOfDay` di sisi server — kalau ada coercion di sana, time akan hilang lagi

#### `features/events/acara/event-detail/index.tsx`

- Ganti `formattedDate(data.date)` di meta "Tanggal" jadi `formatDateTime(data.date)`

#### `components/cards/card-event.tsx`

- `metaDate` (line 28): tambah jam di samping tanggal
- `deadlineCopy` (lines 29-35): tambah jam di batas daftar

---

## 2. Customer Service — Tombol Delete + UploadThing Cleanup

### Latar Belakang

Saat ini tidak ada cara untuk menghapus tiket customer service. Kita perlu:

1. Tombol "Hapus Tiket" di detail tiket (admin only)
2. Sebelum hapus, hapus semua file terkait dari UploadThing
3. Baru hapus record dari database (cascade ke `CustomerServiceFile`)

### Files to Modify

#### `server/actions/customer-service-admin.ts`

- Tambah import `deleteUploadedFile` dari `@/server/actions/delete-upload`
- Tambah import `revalidatePath` dari `"next/cache"`
- Tambah server action:

```ts
export const deleteTicket = async (id: string): Promise<TServerPrompt> => {
  await authorizeAdmin(); // studentAccount() tidak perlu, user tidak dipakai

  const ticket = await prisma.customerService.findUnique({
    where: { id },
    include: { files: { select: { fileKey: true } } },
  });
  if (!ticket) return { status: "error", msg: "Tiket tidak ditemukan" };

  // Hapus semua file dari UploadThing — pakai allSettled biar 1 file gagal
  // tidak abort keseluruhan (file mungkin sudah orphan di UT)
  await Promise.allSettled(
    ticket.files.map((file) => deleteUploadedFile(file.fileKey)),
  );

  await prisma.customerService.delete({ where: { id } });

  revalidatePath("/home/profile/customer-service/list"); // revalidate list page
  return { status: "success", msg: "Tiket berhasil dihapus" };
};
```

> ⚠️ `const { user } = await studentAccount()` dihapus — variable `user` tidak dipakai di action ini, dan `authorizeAdmin()` sudah cukup untuk auth check.

#### `hooks/use-customer-service.ts`

- Tambah `useDeleteTicket()` mutation:

```ts
export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTicket(id),
    onSuccess: (data) => {
      if (data.status === "error") {
        toast.error(data.msg); // handle error msg dari server action
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["customerServiceTickets"] });
      // ✅ navigation TIDAK dilakukan di sini — dilakukan di komponen via
      // callback onSuccess kedua di handleDelete (lihat admin-ticket-detail.tsx)
      // supaya hook tetap reusable dan tidak hardcode route
    },
    onError: () => {
      toast.error("Gagal menghapus tiket, coba lagi");
    },
  });
};
```

- Import `deleteTicket` dari `@/server/actions/customer-service-admin`

> ⚠️ Server action yang return `TServerPrompt` tidak throw error untuk kasus logis (tiket tidak ditemukan) — dia return `{ status: "error" }`. Kalau `onSuccess` tidak cek `data.status`, error dari server action akan silently ignored.

#### `features/customer-service/components/admin-ticket-detail.tsx`

- Import `useDeleteTicket` hook
- Import `useRouter` (already ada)
- **Jangan pakai `confirm()` native** — blocking, tidak bisa di-style, dan tidak konsisten dengan UI app. Pakai `AlertDialog` dari shadcn/ui:
  ```tsx
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive">Hapus Tiket</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Hapus tiket ini?</AlertDialogTitle>
        <AlertDialogDescription>
          Semua file terkait akan ikut dihapus. Tindakan ini tidak bisa
          dibatalkan.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} disabled={isPending}>
          {isPending ? "Menghapus..." : "Hapus"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  ```
- `handleDelete`:
  ```ts
  const { mutate: deleteTicket, isPending } = useDeleteTicket();
  const handleDelete = () => {
    deleteTicket(ticket.id, {
      onSuccess: (data) => {
        if (data.status === "success")
          router.push("/home/profile/customer-service/list");
      },
    });
  };
  ```
- Tombol "Hapus Tiket" dipisah secara visual dari tombol status (misal di bawah separator)

### Tidak Ada Migration

Tabel `CustomerServiceFile` sudah punya `onDelete: Cascade` — hapus ticket otomatis hapus file records. Yang kita tambah cuma server action untuk delete + UploadThing cleanup.

---

## Ringkasan File yang Berubah

| File                                                           | Perubahan                                                                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `schemas/index.ts`                                             | Tambah `dateTime`, `batasDaftarTime` dengan regex validation; **hapus refinement batasDaftar**                 |
| `utils/date-format.ts`                                         | Tambah `mergeTime` (dengan timezone note), `formatDateTime` (dengan locale check)                              |
| `components/field/event-form.tsx`                              | Tambah `<Input type="time">`, import & call `mergeTime` di submit, **validasi batasDaftar < date di onSubmit** |
| `server/actions/event.ts`                                      | ✅ Verifikasi tidak ada coercion date ke startOfDay di sisi server                                             |
| `features/events/acara/event-detail/index.tsx`                 | Tampilkan jam di meta Tanggal                                                                                  |
| `components/cards/card-event.tsx`                              | Tampilkan jam di card                                                                                          |
| `server/actions/customer-service-admin.ts`                     | Tambah `deleteTicket` (hapus `user`, pakai `allSettled`, tambah `revalidatePath`)                              |
| `hooks/use-customer-service.ts`                                | Tambah `useDeleteTicket` dengan `onError` + cek `data.status`                                                  |
| `features/customer-service/components/admin-ticket-detail.tsx` | Tambah AlertDialog konfirmasi + loading state                                                                  |

**Zero Prisma migration.**
