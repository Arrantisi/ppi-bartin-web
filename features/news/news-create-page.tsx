import { CreateNewsComponent } from "./components";

const NewsCreatePage = ({
  backHref,
}: {
  backHref?: string;
}) => {
  return <CreateNewsComponent backHref={backHref} />;
};

export default NewsCreatePage;
