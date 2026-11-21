import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const EventUpdatePage = dynamic(
  () => import("@/features/events/event-update-page"),
  {
    loading: () => (
      <div className="mx-3 my-2 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    ),
  },
);

const UpdateEventPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <EventUpdatePage slug={slug} />;
};

export default UpdateEventPage;
