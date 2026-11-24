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

function SectionHeaderSkeleton({ width }: { width: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-2">
      <Skeleton className="h-3 w-4" />
      <Skeleton className={`h-4 ${width}`} />
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

/** Skeleton empat blok laporan; collapse ada di sidebar, bukan di halaman. */
export function FinanceSkeleton() {
  return (
    <div className="space-y-6" aria-label="Memuat data keuangan" role="status">
      <div className="space-y-4">
        <SectionHeaderSkeleton width="w-40" />
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
      </div>

      <div className="space-y-4">
        <SectionHeaderSkeleton width="w-64" />
        <TableRowsSkeleton rows={4} />
      </div>

      <div className="space-y-4">
        <SectionHeaderSkeleton width="w-48" />
        <Skeleton className="h-9 w-full" />
        <TableRowsSkeleton rows={5} />
      </div>

      <div className="space-y-4">
        <SectionHeaderSkeleton width="w-56" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MetricCardSkeleton key={`kas-${index}`} />
          ))}
        </div>
        <TableRowsSkeleton rows={4} />
      </div>

      <span className="sr-only">Memuat data keuangan…</span>
    </div>
  );
}
