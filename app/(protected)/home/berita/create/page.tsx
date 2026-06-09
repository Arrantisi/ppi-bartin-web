import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const NewsCreatePage = dynamic(
  () => import("@/features/news/news-create-page"),
  {
    loading: () => (
      <div className="m-3 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    ),
  },
);

export default NewsCreatePage;
