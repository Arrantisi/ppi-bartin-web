import { EventPreviewComoponent } from "@/components/event/acara-preview";

const PreviewAcaraPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <EventPreviewComoponent slug={slug} />
    </div>
  );
};

export default PreviewAcaraPage;
