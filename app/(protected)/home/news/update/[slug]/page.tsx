import { UpdateNewsComponent } from "@/components/event/news/update";

const UpdateNewsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <UpdateNewsComponent slug={slug} />
    </div>
  );
};

export default UpdateNewsPage;
