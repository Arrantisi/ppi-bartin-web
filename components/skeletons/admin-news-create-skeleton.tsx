import { AdminManagementSkeleton } from "@/components/skeletons/admin-management-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminNewsCreateSkeleton() {
  return (
    <AdminManagementSkeleton label="Memuat buat berita">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4">
            <Skeleton className="size-20 shrink-0 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-border p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    </AdminManagementSkeleton>
  );
}
