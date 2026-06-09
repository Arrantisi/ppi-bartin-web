import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const NewsUpdatePage = dynamic(
  () => import("@/features/news/news-update-page"),
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

const UpdateNewsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <NewsUpdatePage slug={slug} />;
};

export default UpdateNewsPage;
