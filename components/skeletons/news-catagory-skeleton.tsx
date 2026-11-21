import { Skeleton } from "../ui/skeleton";

export const NewsCaratogorySkeleton = () => {
  return (
    <div className="flex w-full items-start gap-2.5 rounded-[10px] border border-border bg-surface p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
        <Skeleton className="h-3 w-16 rounded-[4px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
};
