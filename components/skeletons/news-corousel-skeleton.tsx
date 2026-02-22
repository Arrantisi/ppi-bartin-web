import { Skeleton } from "../ui/skeleton";

export const NewsCorouselSkelet = () => {
  return (
    <div className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3 my-4">
      <Skeleton className="relative group overflow-hidden rounded-[2rem] h-[280px] w-full">
        <Skeleton className="object-cover transition-transform duration-500 group-hover:scale-105" />

        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className=" flex justify-end">
            <Skeleton className="h-[17px] w-20" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 ">
              <Skeleton className="size-6 rounded-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-[17px] w-20" />

                <div className="size-1.5 rounded-full " />
                <Skeleton className="h-[17px] w-20" />
              </div>
            </div>
            <Skeleton className="h-[24px] w-80" />
            <Skeleton className="h-[24px] w-72" />
          </div>
        </div>
      </Skeleton>
    </div>
  );
};
