import { NewsDetailComponent } from "@/components/event/news/news-detail";

const DetailBeritaPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return (
    <div>
      <NewsDetailComponent slug={slug} />
    </div>
  );
};

export default DetailBeritaPage;
