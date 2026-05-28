import { NewsDetailComponent } from "./components";

const NewsDetailPage = async ({ slug }: { slug: string }) => {
  return <NewsDetailComponent slug={slug} />;
};

export default NewsDetailPage;
