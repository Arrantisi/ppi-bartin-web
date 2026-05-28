import NewsUpdatePage from "@/features/news/news-update-page";

const UpdateNewsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <NewsUpdatePage slug={slug} />;
};

export default UpdateNewsPage;
