import { EventPreviewComoponent } from "@/components/event/acara-preview";

const PreviewAcaraPage = async ({
  params,
}: {
  params: Promise<{ previewAcaraSlug: string }>;
}) => {
  const param = await params;

  return (
    <div>
      <EventPreviewComoponent slug={param.previewAcaraSlug} />
    </div>
  );
};

export default PreviewAcaraPage;
