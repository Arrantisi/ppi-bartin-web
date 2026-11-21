import { NextResponse } from "next/server";

import { getFinanceSnapshot } from "@/server/data/finance";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getFinanceSnapshot();

    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "private, max-age=0" },
    });
  } catch (error) {
    const unauthorized =
      error instanceof Error && error.message === "Unauthorized";

    return NextResponse.json(
      {
        error: unauthorized
          ? "Unauthorized"
          : "Gagal memuat data keuangan",
      },
      { status: unauthorized ? 401 : 500 },
    );
  }
}
