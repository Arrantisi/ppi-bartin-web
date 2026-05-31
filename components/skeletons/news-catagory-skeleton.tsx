import { Skeleton } from "../ui/skeleton";

export const NewsCaratogorySkeleton = () => {
  return (
    <div className="flex w-full items-start gap-2.5 rounded-[10px] border border-border bg-surface p-3">
      <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};
