import { UpdateEventComponent } from "@/components/event/acara/update";

const UpdateEventPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <UpdateEventComponent slug={slug} />
    </div>
  );
};

export default UpdateEventPage;
