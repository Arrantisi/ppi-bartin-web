import { CreateEventContent } from "./content";
import { CreateContentHeader } from "./header";

export const CreateEventComponent = () => {
  return (
    <div>
      <CreateContentHeader />
      <CreateEventContent />
    </div>
  );
};
