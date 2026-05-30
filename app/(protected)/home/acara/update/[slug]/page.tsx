import EventUpdatePage from "@/features/events/event-update-page";

const UpdateEventPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <EventUpdatePage slug={slug} />;
};

export default UpdateEventPage;
