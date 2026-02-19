import { UploaderPhoto } from "@/components/event/uploader";

const UploaderPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <UploaderPhoto slug={slug} catagory="news" />
    </div>
  );
};

export default UploaderPage;
