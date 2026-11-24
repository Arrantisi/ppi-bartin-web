"use client";

import {
  IconAlertCircle,
  IconInfoCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinanceSkeleton } from "@/components/skeletons/finance-skeleton";
import { useCurrentUserRole } from "@/hooks/use-current-role";
import {
  useCreateFinanceTransaction,
  useDeleteFinanceTransaction,
  useFinance,
  useUpdateFinanceTransaction,
} from "@/hooks/use-finance";
import type {
  TCreateFinanceTransaction,
  TUpdateFinanceTransaction,
} from "@/schemas/finance";
import type { TFinanceTransaction } from "@/types/finance";

import { FinanceActionDialog } from "./finance-action-dialog";
import { FinanceBudgetTable } from "./finance-budget-table";
import { FinanceDataTable } from "./finance-data-table";
import { FinanceDeleteDialog } from "./finance-delete-dialog";
import { FinanceEmptyState } from "./finance-empty-state";
import { FinanceFundCards } from "./finance-fund-cards";
import { FinanceReportSection } from "./finance-report-section";
import { FinanceSummaryCards } from "./finance-summary-cards";
import { FinanceToolbar, type TFinanceFilters } from "./finance-toolbar";
import { FinanceWajibKas } from "./finance-wajib-kas";

const EMPTY_FILTERS: TFinanceFilters = {
  search: "",
  kategori: "",
  arusKas: "",
  mataUang: "",
};

const EMPTY_TOTALS = {
  pemasukanIdr: 0,
  pengeluaranIdr: 0,
  saldoIdr: 0,
  pemasukanTry: 0,
  pengeluaranTry: 0,
  saldoTry: 0,
};

type TActionState = {
  open: boolean;
  mode: "create" | "edit";
  transaction: TFinanceTransaction | null;
};

const CLOSED_ACTION: TActionState = {
  open: false,
  mode: "create",
  transaction: null,
};

export function FinanceDashboard({ sheetUrl }: { sheetUrl?: string }) {
  const financeQuery = useFinance();
  const roleQuery = useCurrentUserRole();
  const createMutation = useCreateFinanceTransaction();
  const updateMutation = useUpdateFinanceTransaction();
  const deleteMutation = useDeleteFinanceTransaction();

  const [filters, setFilters] = useState<TFinanceFilters>(EMPTY_FILTERS);
  const [action, setAction] = useState<TActionState>(CLOSED_ACTION);
  const [deleteTarget, setDeleteTarget] =
    useState<TFinanceTransaction | null>(null);

  const isDemo = financeQuery.data?.kpiSource === "dummy";
  const kpiSource = financeQuery.data?.kpiSource;
  const report = financeQuery.data?.report ?? null;
  const canWrite =
    !isDemo &&
    (roleQuery.data === "BENDAHARA" || roleQuery.data === "ADMIN");
  const transactions = useMemo(
    () => financeQuery.data?.transactions ?? [],
    [financeQuery.data],
  );

  const filteredTransactions = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      if (filters.kategori && transaction.kategori !== filters.kategori) {
        return false;
      }
      if (filters.arusKas && transaction.arusKas !== filters.arusKas) {
        return false;
      }
      if (filters.mataUang && transaction.mataUang !== filters.mataUang) {
        return false;
      }
      if (!search) return true;

      return [
        transaction.keterangan,
        transaction.kategori,
        transaction.penanggungJawab,
        transaction.rekeningPenampung,
        transaction.penerima,
        transaction.pengirim,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [filters, transactions]);

  const suggestions = useMemo(() => {
    // Sheet asli memiliki transaksi tanpa kategori; Select tidak boleh menerima value="".
    const unique = (values: string[]) =>
      Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort();
    return {
      categories: unique(transactions.map((item) => item.kategori)),
      penanggungJawab: unique(transactions.map((item) => item.penanggungJawab)),
      rekeningPenampung: unique(
        transactions.map((item) => item.rekeningPenampung),
      ),
    };
  }, [transactions]);

  const handleEdit = useCallback((transaction: TFinanceTransaction) => {
    setAction({ open: true, mode: "edit", transaction });
  }, []);

  const handleAdd = useCallback(() => {
    setAction({ open: true, mode: "create", transaction: null });
  }, []);

  const handleSubmit = useCallback(
    async (values: TCreateFinanceTransaction | TUpdateFinanceTransaction) => {
      if (action.mode === "edit" && action.transaction) {
        return updateMutation.mutateAsync(values as TUpdateFinanceTransaction);
      }
      return createMutation.mutateAsync(values as TCreateFinanceTransaction);
    },
    [action.mode, action.transaction, createMutation, updateMutation],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;

    const result = await deleteMutation.mutateAsync({
      rowNumber: deleteTarget.rowNumber,
    });
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message ?? "Nilai transaksi dikosongkan");
    setDeleteTarget(null);
  }, [deleteMutation, deleteTarget]);

  const isInitialLoading = financeQuery.isPending && !financeQuery.data;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="title-tiga text-text-primary">
            {report?.title ?? "Keuangan PPI Bartın"}
          </h1>
          {report?.department ? (
            <p className="footnote text-text-secondary">{report.department}</p>
          ) : null}
          {report?.period ? (
            <p className="footnote text-text-secondary">{report.period}</p>
          ) : null}
          <p className="footnote text-text-secondary">
            Sumber data: DKE - DATA KEUANGAN KESELURUHAN PPI BARTIN
          </p>
          {financeQuery.data && (
            <p className="footnote text-text-disabled">
              Diperbarui:{" "}
              {new Date(financeQuery.data.updatedAt).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isDemo && financeQuery.isFetching && !isInitialLoading && (
            <span className="footnote text-text-secondary">Memperbarui…</span>
          )}
          {isDemo ? (
            <Badge variant="outline" className="text-warning">
              Data contoh
            </Badge>
          ) : (
            <>
              <Badge variant="outline" className="text-text-secondary">
                {kpiSource === "dashboard"
                  ? "KPI dari DASHBOARD"
                  : "KPI dari buku besar"}
              </Badge>
              <Badge variant="outline" className="text-text-secondary">
                Sinkron 5 detik
              </Badge>
            </>
          )}
        </div>
      </header>

      {isDemo && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4"
        >
          <IconInfoCircle aria-hidden className="mt-0.5 text-warning" />
          <div>
            <p className="body text-text-primary">Mode pratinjau</p>
            <p className="footnote text-text-secondary">
              Angka di bawah adalah data contoh, bukan laporan asli. Tombol
              tambah/edit/hapus dinonaktifkan sampai Google Sheets dihubungkan.
            </p>
          </div>
        </div>
      )}

      {financeQuery.isError ? (
        <div
          role="alert"
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <IconAlertCircle aria-hidden className="mt-0.5 text-danger" />
              <div>
                <p className="body text-text-primary">
                  Gagal memuat data keuangan
                </p>
                <p className="footnote text-text-secondary">
                  Pastikan Google Sheets sudah dihubungkan dan kamu sudah login.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => void financeQuery.refetch()}
            >
              <IconRefresh aria-hidden />
              Coba lagi
            </Button>
          </div>
        </div>
      ) : isInitialLoading ? (
        <FinanceSkeleton />
      ) : (
        <>
          <FinanceReportSection
            id="laporan-dasar"
            number="A"
            title="Laporan Dasar"
            description="Saldo dana dan arus kas per mata uang"
          >
            {report ? (
              <FinanceFundCards funds={report.funds} legend={report.legend} />
            ) : (
              <p className="footnote text-text-secondary">
                Ringkasan dana belum tersedia dari tab DASHBOARD; arus kas di
                bawah dihitung dari buku besar.
              </p>
            )}
            <FinanceSummaryCards
              totals={financeQuery.data?.totals ?? EMPTY_TOTALS}
            />
          </FinanceReportSection>

          <FinanceReportSection
            id="penyerapan-anggaran"
            number="B"
            title="Laporan Penyerapan Anggaran"
            description="Pagu, realisasi, dan sisa anggaran per lembaga"
          >
            {report && report.budget.length > 0 ? (
              <FinanceBudgetTable items={report.budget} />
            ) : (
              <p className="footnote text-text-secondary">
                Data penyerapan anggaran belum tersedia di tab DASHBOARD.
              </p>
            )}
          </FinanceReportSection>

          <FinanceReportSection
            id="buku-besar"
            number="C"
            title="Buku Besar Keuangan"
            description="Riwayat transaksi dari sheet bendahara"
          >
            <FinanceToolbar
              filters={filters}
              onFiltersChange={setFilters}
              categories={suggestions.categories}
              canWrite={canWrite}
              canRefresh={!isDemo}
              isFetching={financeQuery.isFetching}
              onRefresh={() => void financeQuery.refetch()}
              onAdd={handleAdd}
            />

            {transactions.length === 0 ? (
              <FinanceEmptyState
                canWrite={canWrite}
                sheetUrl={sheetUrl}
                onAdd={handleAdd}
              />
            ) : (
              <FinanceDataTable
                data={filteredTransactions}
                canWrite={canWrite}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
            )}
          </FinanceReportSection>

          <FinanceReportSection
            id="wajib-kas"
            number="D"
            title="Wajib Kas PPI Bartın"
            description="Siapa yang sudah dan belum membayar kas per bulan"
          >
            <FinanceWajibKas report={financeQuery.data?.wajibKas ?? null} />
          </FinanceReportSection>
        </>
      )}

      <FinanceActionDialog
        open={action.open}
        mode={action.mode}
        transaction={action.transaction}
        suggestions={suggestions}
        onSubmit={handleSubmit}
        onOpenChange={(open) => setAction(open ? action : CLOSED_ACTION)}
      />

      <FinanceDeleteDialog
        open={deleteTarget !== null}
        transaction={deleteTarget}
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
}
