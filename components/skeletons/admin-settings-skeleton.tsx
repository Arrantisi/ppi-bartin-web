import { AdminManagementSkeleton } from "@/components/skeletons/admin-management-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminSettingsSkeleton() {
  return (
    <AdminManagementSkeleton label="Memuat pengaturan">
      <div className="space-y-5">
        <div className="rounded-xl border border-border">
          <div className="space-y-2 border-b border-border p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border">
          <div className="space-y-2 border-b border-border p-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-52 max-w-full" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>
      </div>
    </AdminManagementSkeleton>
  );
}
