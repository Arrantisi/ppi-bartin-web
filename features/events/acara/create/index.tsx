import { ButtonHeaderField } from "@/components/buttons";
import { CreateEventContent } from "./content";

export const CreateEventComponent = ({
  backHref = "/home/acara",
}: {
  backHref?: string;
} = {}) => {
  return (
    <div>
      <ButtonHeaderField href={backHref} label="Buat Acara" />
      <CreateEventContent />
    </div>
  );
};
