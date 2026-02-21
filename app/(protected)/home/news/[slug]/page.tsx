import { NewsDetailComponent } from "@/components/event/news-detail";

const DetailBeritaPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  console.log(slug);

  return (
    <div>
      <NewsDetailComponent slug={slug} />
    </div>
  );
};

export default DetailBeritaPage;
