import { UpdateEventComponent } from "./components";

const EventUpdatePage = async ({ slug }: { slug: string }) => {
  return <UpdateEventComponent slug={slug} />;
};

export default EventUpdatePage;
