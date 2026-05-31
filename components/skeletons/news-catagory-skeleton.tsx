import { Skeleton } from "../ui/skeleton";

export const NewsCaratogorySkeleton = () => {
  return (
    <div className="grid grid-cols-5 w-full bg-muted-foreground/5 p-2 rounded-4xl gap-2">
      <Skeleton className="size-36 rounded-4xl col-span-2" />
      <div className="flex flex-col items-start justify-between col-span-3">
        <div>
          <Skeleton className="h-[18px] w-16 my-2" />
          <Skeleton className="h-[24px] w-56 my-2" />
          <Skeleton className="h-[24px] w-52" />
        </div>
        <div className="flex items-center justify-between w-full pr-4 my-2">
          <div className="flex items-center gap-1">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-[16px] w-14" />
          </div>
          <Skeleton className="h-[16px] w-16" />
        </div>
      </div>
    </div>
  );
};
