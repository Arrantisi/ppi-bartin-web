import { NewsDetailComponent } from "./components";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

const NewsDetailPage = async ({ slug }: { slug: string }) => {
  return (
    <HomeLayoutComponent>
      <NewsDetailComponent slug={slug} />
    </HomeLayoutComponent>
  );
};

export default NewsDetailPage;
