import { describe, expect, it } from "vitest";

import { getDummyFinanceSnapshot } from "../server/data/finance-dummy";

describe("getDummyFinanceSnapshot", () => {
  it("mengembalikan data contoh dengan total per mata uang yang benar", () => {
    const snapshot = getDummyFinanceSnapshot();

    expect(snapshot.kpiSource).toBe("dummy");
    expect(snapshot.transactions).toHaveLength(8);
    expect(snapshot.totals).toEqual({
      pemasukanIdr: 21_242_331,
      pengeluaranIdr: 475_000,
      saldoIdr: 20_767_331,
      pemasukanTry: 1_990,
      pengeluaranTry: 263.25,
      saldoTry: 1_726.75,
    });
  });

  it("memakai rowNumber 7 sebagai baris data pertama", () => {
    const snapshot = getDummyFinanceSnapshot();

    expect(snapshot.transactions[0]?.rowNumber).toBe(7);
  });
});
