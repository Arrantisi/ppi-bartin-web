import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Parser } from "json2csv";
import { z } from "zod";
import { studentAccount, getCurrentUserRole } from "@/server/actions/account";

// Route ini mengekspor data pribadi peserta (NIM, email, nama, fakultas).
// Wajib divealidasi ulang di server — gate di client bukan batas keamanan.

const eventIdSchema = z.uuid("Format event ID tidak valid");

const ADMIN_ROLES = new Set(["ADMIN", "PENGURUS"]);

/** CegahCRLF + path traversal + karakter kontrol pada header Content-Disposition. */
function safeFilename(raw: string): string {
  const cleaned = raw
    .normalize("NFKD")
    .replace(/[\r\n\t]/g, " ")
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 60);
  return cleaned || "acara";
}

export const GET = async (req: NextRequest) => {
  try {
    // 1. Auth check — tolak semua request tanpa sesi valid.
    const session = await studentAccount().catch(() => null);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Input validation.
    const parsed = eventIdSchema.safeParse(
      new URL(req.url).searchParams.get("eventId"),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Format event ID tidak valid" },
        { status: 400 },
      );
    }
    const eventId = parsed.data;

    // 3. Ownership / role check — hanya kreator acara atau admin yang boleh ekspor.
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      select: { id: true, judul: true, userId: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }

    const role = await getCurrentUserRole();
    const isCreator = event.userId === session.user.id;
    const isAdmin = ADMIN_ROLES.has(role);

    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Ambil data hanya setelah otorisasi lolos.
    const participants = await prisma.participants.findMany({
      where: { eventId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            angkatan: true,
            name: true,
            nomorSiswa: true,
            jurusan: true,
            fakultas: true,
            email: true,
            jenisKelamin: true,
          },
        },
      },
    });

    const dataToExport = participants.map(({ user }, idx) => ({
      NO: idx + 1,
      nama_lengkap: user.name,
      "nomor_öğrenci": user.nomorSiswa,
      email: user.email,
      angkatan: user.angkatan,
      fakultas: user.fakultas,
      jurusan: user.jurusan,
      jenis_kelamin: user.jenisKelamin,
    }));

    const csv = new Parser().parse(dataToExport);
    const csvWithBom = "\ufeff" + csv;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Partisipan-${safeFilename(event.judul)}.csv"`,
        // Data pribadi — jangan pernah disimpan cache bersama atau perantara.
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[export/participants] gagal:", error);
    return NextResponse.json({ error: "Gagal ekspor data" }, { status: 500 });
  }
};
