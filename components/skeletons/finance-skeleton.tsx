import { Skeleton } from "@/components/ui/skeleton";

export function FinanceSkeleton() {
  return (
    <div className="space-y-6" aria-label="Memuat data keuangan" role="status">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-border p-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-4 h-7 w-3/4" />
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-full" />
      <div className="rounded-2xl border border-border p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <span className="sr-only">Memuat data keuangan…</span>
    </div>
  );
}
