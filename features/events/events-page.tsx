import { CardAcaras, HeaderAcara } from "./components";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

const EventsPage = () => {
  return (
    <HomeLayoutComponent>
      <HeaderAcara />
      <CardAcaras />
    </HomeLayoutComponent>
  );
};

export default EventsPage;
