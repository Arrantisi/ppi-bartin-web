import { CreateNewsContent } from "./content";
import { ButtonHeaderField } from "@/components/buttons";

export const CreateNewsComponent = ({
  backHref = "/home/berita",
}: {
  backHref?: string;
} = {}) => {
  return (
    <div>
      <ButtonHeaderField href={backHref} label="Buat Berita" />
      <CreateNewsContent />
    </div>
  );
};
