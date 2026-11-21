import { AdminManagementSkeleton } from "@/components/skeletons/admin-management-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminTicketDetailSkeleton() {
  return (
    <AdminManagementSkeleton label="Memuat detail pesan">
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-9 w-full" />

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          <div className="mt-5 space-y-3">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-6">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </AdminManagementSkeleton>
  );
}
