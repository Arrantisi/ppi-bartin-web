import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";

type TAdminManagementSkeletonProps = {
  label: string;
  children: ReactNode;
};

/**
 * Frame umum untuk skeleton halaman manajemen admin.
 * Konten di dalamnya sengaja dibedakan per route oleh skeleton masing-masing.
 */
export function AdminManagementSkeleton({
  label,
  children,
}: TAdminManagementSkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col space-y-6 pb-24 pt-2"
    >
      <span className="sr-only">Memuat {label.toLowerCase()}…</span>

      <div className="space-y-4">
        <Skeleton className="h-4 w-36" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
      </div>

      {children}
    </div>
  );
}

export function AdminTableToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Skeleton className="h-9 flex-1" />
      <Skeleton className="h-9 w-full sm:w-40" />
    </div>
  );
}
