import { UploaderPhoto } from "@/components/event/uploader/upload-event-news";

const UploaderPageNews = async ({
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

export default UploaderPageNews;
