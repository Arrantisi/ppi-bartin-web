import { describe, expect, it } from "vitest";

import {
  buildDailyTrend,
  formatDurationHours,
  getMissingProfileFields,
  getUtcDayKey,
  toPercent,
} from "../utils/admin-dashboard";

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
