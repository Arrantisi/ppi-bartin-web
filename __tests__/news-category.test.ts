import { describe, expect, it } from "vitest";

import {
  getNewsCategoryTone,
  newsCategoryDotStyles,
  newsCategoryToneStyles,
} from "../utils/news-category";

describe("getNewsCategoryTone", () => {
  it("memetakan kategori yang dikenal ke nada warna token", () => {
    expect(getNewsCategoryTone("pengumuman")).toBe("urgent");
    expect(getNewsCategoryTone("berita-utama")).toBe("accent");
    expect(getNewsCategoryTone("beasiswa")).toBe("info");
    expect(getNewsCategoryTone("prestasi")).toBe("success");
    expect(getNewsCategoryTone("artikel")).toBe("neutral");
  });

  it("toleran terhadap huruf besar dan spasi", () => {
    expect(getNewsCategoryTone("  PRESTASI ")).toBe("success");
  });

  it("jatuh ke netral untuk kategori kosong atau tak dikenal", () => {
    expect(getNewsCategoryTone()).toBe("neutral");
    expect(getNewsCategoryTone("")).toBe("neutral");
    expect(getNewsCategoryTone("kategori-baru")).toBe("neutral");
  });

  it("menyediakan kelas teks dan titik untuk setiap nada", () => {
    for (const tone of ["neutral", "urgent", "info", "success", "accent"] as const) {
      expect(newsCategoryToneStyles[tone]).toMatch(/^text-/);
      expect(newsCategoryDotStyles[tone]).toMatch(/^bg-/);
    }
  });
});
