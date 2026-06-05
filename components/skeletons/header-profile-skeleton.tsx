import { Skeleton } from "../ui/skeleton";

export const HeaderProfileSkeleton = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-3">
      <Skeleton className="size-28 rounded-full" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-6 w-44 rounded-full" />
    </div>
  );
};
