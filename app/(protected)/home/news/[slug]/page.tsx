import BeritaEventComoponent from "@/components/event/berita-event";

const DetailBeritaPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  console.log(slug);

  return (
    <div>
      <BeritaEventComoponent slug={slug} />
    </div>
  );
};

export default DetailBeritaPage;
