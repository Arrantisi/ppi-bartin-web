import { CreateNewsContent } from "./content";
import { ButtonHeaderField } from "@/components/buttons";

export const CreateNewsComponent = () => {
  return (
    <div>
      <ButtonHeaderField href="/home/news" label="Buat Berita" />
      <CreateNewsContent />
    </div>
  );
};
