import NewsDetailPage from "@/features/news/news-detail-page";

const DetailBeritaPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <NewsDetailPage slug={slug} />;
};

export default DetailBeritaPage;
