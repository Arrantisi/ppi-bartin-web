import { AdminManagementSkeleton } from "@/components/skeletons/admin-management-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminEventCreateSkeleton() {
  return (
    <AdminManagementSkeleton label="Memuat buat acara">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-2 rounded-xl border border-border p-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>

        <div className="space-y-5 rounded-xl border border-border p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </AdminManagementSkeleton>
  );
}
