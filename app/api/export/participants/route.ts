import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Parser } from "json2csv";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID wajib diisi" },
        { status: 400 },
      );
    }

    const event = await prisma.events.findUnique({
      where: {
        id: eventId,
      },
      include: {
        participants: {
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
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event tidak di temukan" });
    }

    const dataToExport = event.participants.map(({ user }, idx) => ({
      NO: idx + 1,
      nama_lengkap: user.name,
      nomor_öğrenci: user.nomorSiswa,
      email: user.email,
      angkatan: user.angkatan,
      fakultas: user.fakultas,
      jurusan: user.jurusan,
      jenis_kelamin: user.jenisKelamin,
    }));

    const json2csnParser = new Parser();
    const csv = json2csnParser.parse(dataToExport);
    const csvWithBom = "\ufeff" + csv;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=Partisipan-${event.judul.replace(/\s+/g, "_")}.csv`,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Gagal ekspor data" }, { status: 500 });
  }
};
