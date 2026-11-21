import { AdminManagementSkeleton } from "@/components/skeletons/admin-management-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminTicketsSkeleton() {
  return (
    <AdminManagementSkeleton label="Memuat pesan masuk">
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-full max-w-xl" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="size-4 shrink-0" />
          </div>
        ))}
      </div>
    </AdminManagementSkeleton>
  );
}
