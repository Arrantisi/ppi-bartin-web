import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCardAcara = () => {
  return (
    <Card className="gap-0 overflow-hidden rounded-[10px] border border-border bg-surface py-0 shadow-none flex flex-col h-full">
      <div className="flex w-full flex-col overflow-hidden rounded-[10px] text-left grow">
        <div className="relative h-60 w-full">
          <Skeleton className="absolute inset-0 rounded-none" />
          <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5">
            <Skeleton className="h-5 w-16 rounded-[4px]" />
            <Skeleton className="h-5 w-24 rounded-[4px]" />
          </div>
        </div>

        <CardContent className="space-y-2.5 px-3 py-3 flex flex-col grow">
          <Skeleton className="h-3 w-12 rounded-[4px]" />

          <div className="space-y-1.5 mb-auto">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>

          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-36" />
            <span className="text-text-disabled">·</span>
            <Skeleton className="h-3.5 w-28" />
          </div>

          <Skeleton className="h-3.5 w-52" />
        </CardContent>
      </div>

      <CardFooter className="flex items-center justify-between gap-3 px-3 pb-3 pt-0">
        <div className="flex items-center">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full -ml-2" />
          <Skeleton className="size-7 rounded-full -ml-2" />
        </div>

        <Skeleton className="h-9 w-28 rounded-lg" />
      </CardFooter>
    </Card>
  );
};
