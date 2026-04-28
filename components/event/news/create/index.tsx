import { CreateNewsContent } from "./content";
import { ButtonHeaderField } from "@/components/buttons";

export const CreateNewsComponent = () => {
  return (
    <div>
      <ButtonHeaderField href="/home/berita" label="Buat Berita" />
      <CreateNewsContent />
    </div>
  );
};
