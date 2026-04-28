import { ButtonHeaderField } from "@/components/buttons";
import { CreateEventContent } from "./content";

export const CreateEventComponent = () => {
  return (
    <div>
      <ButtonHeaderField href="/home/acara" label="Buat Acara" />
      <CreateEventContent />
    </div>
  );
};
