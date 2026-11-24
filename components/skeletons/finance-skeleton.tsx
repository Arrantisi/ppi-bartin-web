import { Skeleton } from "@/components/ui/skeleton";

function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-4">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="mt-4 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-2/3" />
    </div>
  );
}

function TableRowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2 rounded-2xl border border-border p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}

/** Skeleton keuangan: bilah tab + satu panel di home, blok bertumpuk di dashboard. */
export function FinanceSkeleton({
  navigation = "tabs",
}: {
  navigation?: "tabs" | "sections";
}) {
  return (
    <div className="space-y-6" aria-label="Memuat data keuangan" role="status">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-3 w-72" />
      <Skeleton className="h-3 w-40" />

      {navigation === "tabs" ? (
        <div className="flex gap-4 border-b border-border pb-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`tab-${index}`} className="h-4 w-20" />
          ))}
        </div>
      ) : null}

      {navigation === "sections" ? (
        <div className="space-y-8 pt-2">
          {Array.from({ length: 2 }).map((_, block) => (
            <div key={`block-${block}`} className="space-y-4">
              <Skeleton className="h-5 w-48" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <MetricCardSkeleton key={`${block}-${index}`} />
                ))}
              </div>
            </div>
          ))}
          <TableRowsSkeleton rows={3} />
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <MetricCardSkeleton key={`fund-${index}`} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <MetricCardSkeleton key={`summary-${index}`} />
            ))}
          </div>
          <TableRowsSkeleton rows={2} />
        </div>
      )}

      <span className="sr-only">Memuat data keuangan…</span>
    </div>
  );
}
