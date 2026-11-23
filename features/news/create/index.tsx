import { CreateNewsContent } from "./content";

export const CreateNewsComponent = ({
  backHref = "/home/berita",
}: {
  backHref?: string;
} = {}) => {
  return <CreateNewsContent backHref={backHref} />;
};
