import React from "react";
import { Skeleton } from "../ui/skeleton";

export const HeaderProfileSkeleton = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <Skeleton className="size-18 rounded-full" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-28" />
    </div>
  );
};
