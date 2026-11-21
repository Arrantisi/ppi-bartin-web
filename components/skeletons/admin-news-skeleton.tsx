import {
  AdminManagementSkeleton,
  AdminTableToolbarSkeleton,
} from "@/components/skeletons/admin-management-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminNewsSkeleton() {
  return (
    <AdminManagementSkeleton label="Memuat kelola berita">
      <div className="space-y-4">
        <AdminTableToolbarSkeleton />
        <Skeleton className="h-3 w-40" />

        <div className="overflow-hidden rounded-[10px] border border-border bg-card">
          <div className="grid grid-cols-6 gap-4 border-b border-border px-4 py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-20" />
            ))}
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, row) => (
              <div
                key={row}
                className="grid min-w-[760px] grid-cols-6 items-center gap-4 px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-8 w-32" />
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminManagementSkeleton>
  );
}
