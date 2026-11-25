import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat dashboard admin"
      className="space-y-6 pb-24"
    >
      <span className="sr-only">Memuat data dashboard admin…</span>

      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <section
        aria-label="Memuat ringkasan"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-[10px] border border-border bg-card p-4"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 rounded-[10px] border border-border bg-card p-4 lg:col-span-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex h-40 items-end gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-full flex-1" />
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-[10px] border border-border bg-card p-4">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
