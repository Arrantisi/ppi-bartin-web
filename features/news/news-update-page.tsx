import { UpdateNewsComponent } from "./components";

const NewsUpdatePage = async ({ slug }: { slug: string }) => {
  return <UpdateNewsComponent slug={slug} />;
};

export default NewsUpdatePage;
