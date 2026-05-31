import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCardAcara = () => {
  return (
    <Card className="overflow-hidden rounded-[10px] border border-border bg-card py-0 shadow-none">
      <Skeleton className="h-[180px] w-full rounded-none" />
      <CardContent className="space-y-2 px-3 py-3">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3 px-3 pb-3 pt-0">
        <div className="flex -space-x-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>

        <Skeleton className="h-8 w-24 rounded-full" />
      </CardFooter>
    </Card>
  );
};
