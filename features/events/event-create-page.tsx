import { CreateEventComponent } from "./components";

const EventCreatePage = ({
  backHref,
}: {
  backHref?: string;
}) => {
  return <CreateEventComponent backHref={backHref} />;
};

export default EventCreatePage;
