import { EventPreviewComoponent } from "@/components/event/acara-preview";

const PreviewAcaraPage = async ({
  params,
}: {
  params: Promise<{ previewAcaraSlug: string }>;
}) => {
  const param = await params;

  console.log("SLUG DITERIMA:", param.previewAcaraSlug);

  return (
    <div>
      <EventPreviewComoponent slug={param.previewAcaraSlug} />
    </div>
  );
};

export default PreviewAcaraPage;
