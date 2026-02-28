import { UploaderPhoto } from "@/components/event/uploader/upload-event-news";

const UploaderPageEvent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <UploaderPhoto slug={slug} catagory="events" />
    </div>
  );
};

export default UploaderPageEvent;
