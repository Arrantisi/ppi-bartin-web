import { describe, expect, it } from "vitest";

import {
  adminDetailIdSchema,
  deleteEventSchema,
  deleteUserSchema,
} from "../schemas/admin-dashboard";
import {
  buildDailyTrend,
  firstSearchParam,
  formatDurationHours,
  getMissingProfileFields,
  getPaginationItems,
  getUtcDayKey,
  parseAdminPage,
  toPercent,
} from "../utils/admin-dashboard";

describe("getPaginationItems", () => {
  it("menampilkan semua halaman untuk rentang pendek", () => {
    expect(getPaginationItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("menyisipkan ellipsis untuk rentang panjang", () => {
    expect(getPaginationItems(5, 12)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      12,
    ]);
  });

  it("menghindari ellipsis untuk satu halaman yang terlewat", () => {
    expect(getPaginationItems(1, 10)).toEqual([1, 2, "ellipsis", 10]);
    expect(getPaginationItems(10, 10)).toEqual([1, "ellipsis", 9, 10]);
  });

  it("mengikat halaman di luar rentang", () => {
    expect(getPaginationItems(99, 3)).toEqual([1, 2, 3]);
    expect(getPaginationItems(-5, 3)).toEqual([1, 2, 3]);
    expect(getPaginationItems(1, 0)).toEqual([1]);
  });
});

describe("validasi ID admin", () => {
  it("menerima ID user Better Auth yang bukan UUID", () => {
    const betterAuthId = "aB3dEfGhIjKlMnOpQrStUvWxYz012345";
    expect(deleteUserSchema.safeParse({ userId: betterAuthId }).success).toBe(true);
    expect(deleteUserSchema.safeParse({ userId: "" }).success).toBe(false);
  });

  it("menerima ID non-UUID untuk query detail", () => {
    expect(adminDetailIdSchema.safeParse("aB3dEfGhIjKlMnOpQrStUvWxYz012345").success).toBe(true);
    expect(adminDetailIdSchema.safeParse("8f14e45f-ea1c-4f2b-9a0e-4d7c2b1a5f30").success).toBe(true);
    expect(adminDetailIdSchema.safeParse("  ").success).toBe(false);
  });

  it("tetap menolak ID event yang bukan UUID", () => {
    expect(
      deleteEventSchema.safeParse({
        eventId: "aB3dEfGhIjKlMnOpQrStUvWxYz012345",
      }).success,
    ).toBe(false);
    expect(
      deleteEventSchema.safeParse({
        eventId: "8f14e45f-ea1c-4f2b-9a0e-4d7c2b1a5f30",
      }).success,
    ).toBe(true);
  });
});

describe("toPercent", () => {
  it("mengembalikan 0 untuk pembagian dengan nol", () => {
    expect(toPercent(0, 0)).toBe(0);
    expect(toPercent(5, 0)).toBe(0);
  });

  it("menghitung dan membatasi hasil antara 0 dan 100", () => {
    expect(toPercent(0, 5)).toBe(0);
    expect(toPercent(3, 4)).toBe(75);
    expect(toPercent(1, 3)).toBe(33.3);
    expect(toPercent(5, 4)).toBe(100);
  });
});

describe("formatDurationHours", () => {
  it("menampilkan placeholder untuk data kosong", () => {
    expect(formatDurationHours(null)).toBe("—");
  });

  it("memilih satuan yang sesuai", () => {
    expect(formatDurationHours(0.4)).toBe("< 1 jam");
    expect(formatDurationHours(5)).toBe("5 jam");
    expect(formatDurationHours(48)).toBe("2 hari");
  });
});

describe("getMissingProfileFields", () => {
  it("hanya mengembalikan field yang kosong", () => {
    expect(
      getMissingProfileFields({
        noTelephone: "0812",
        nomorSiswa: null,
        angkatan: "  ",
        jurusan: "Informatika",
        fakultas: "FTI",
      }),
    ).toEqual(["No. Siswa", "Angkatan"]);
  });
});

describe("query param admin", () => {
  it("mengambil nilai pertama dari search param berbentuk array", () => {
    expect(firstSearchParam(["2", "3"])).toBe("2");
    expect(firstSearchParam(undefined)).toBe("");
    expect(firstSearchParam("production")).toBe("production");
  });

  it("mengubah halaman invalid menjadi 1", () => {
    expect(parseAdminPage("3")).toBe(3);
    expect(parseAdminPage("abc")).toBe(1);
    expect(parseAdminPage("")).toBe(1);
  });
});

describe("buildDailyTrend", () => {
  it("membuat 14 bucket harian dan menghitung data di dalam rentang", () => {
    const now = new Date("2026-11-20T10:30:00.000Z");
    const users = [
      new Date("2026-11-20T01:00:00.000Z"),
      new Date("2026-11-20T23:00:00.000Z"),
      new Date("2026-11-19T12:00:00.000Z"),
      new Date("2026-11-01T12:00:00.000Z"), // di luar rentang
    ];
    const participants = [new Date("2026-11-20T08:00:00.000Z")];

    const trend = buildDailyTrend(users, participants, 14, now);

    expect(trend).toHaveLength(14);
    expect(trend[0]?.date).toBe(getUtcDayKey(new Date("2026-11-07T00:00:00.000Z")));
    expect(trend[13]?.date).toBe("2026-11-20");
    expect(trend[13]).toMatchObject({ users: 2, participants: 1 });
    expect(trend[12]).toMatchObject({ users: 1, participants: 0 });
    expect(trend.reduce((total, item) => total + item.users, 0)).toBe(3);
  });
});
