import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton ringkas untuk kartu Transparansi Keuangan di /home. */
export function FinanceHomeSkeleton() {
  return (
    <section
      className="rounded-3xl border border-border bg-card p-5 md:p-6"
      role="status"
      aria-label="Memuat ringkasan keuangan"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <Skeleton className="h-9 w-44 shrink-0 rounded-xl" />
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
        <div className="grid gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`block-${index}`}
              className="flex flex-col gap-3 rounded-2xl border border-border p-4"
            >
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-border p-4">
          <Skeleton className="h-4 w-32" />
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`tx-${index}`} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only">Memuat ringkasan keuangan…</span>
    </section>
  );
}
