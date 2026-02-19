import CardAcaras from "@/components/event/acara/card-acaras";
import HeaderAcara from "@/components/event/acara/header";
import { HomeLayoutComponent } from "@/components/layouts/home-layout";

const AcaraPage = () => {
  return (
    <HomeLayoutComponent>
      <HeaderAcara />
      <CardAcaras />
    </HomeLayoutComponent>
  );
};

export default AcaraPage;
