import { CreateEventContent } from "./content";

export const CreateEventComponent = ({
  backHref = "/home/acara",
}: {
  backHref?: string;
} = {}) => {
  return <CreateEventContent backHref={backHref} />;
};
