import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCardAcara = () => {
  return (
    <Card className="py-2 shadow-2xl">
      <CardHeader className="px-2">
        <Skeleton className="w-full min-h-[300px]" />
      </CardHeader>
      <CardContent className="px-3">
        <Skeleton className="h-6 w-56" />
        <div className="flex items-center justify-between mt-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center text-muted-foreground/80 my-3 gap-3">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1.5 ">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <p className="line-clamp-3 description-card-event">{}</p>
      </CardContent>
      <CardFooter className="px-3 pb-3 justify-between">
        {/* <AvatarParticipant
            participant={participant}
            totalParticipant={totalParticipant}
          /> */}
        <div className="flex -space-x-3">
          <Skeleton className="rounded-full size-10" />
          <Skeleton className="rounded-full size-10" />
          <Skeleton className="rounded-full size-10" />
          <Skeleton className="rounded-full size-10" />
        </div>

        <Skeleton className="h-9 w-32 rounded-full" />
      </CardFooter>
    </Card>
  );
};
