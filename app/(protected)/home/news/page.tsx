import BeritaCatagory from "@/components/event/news/berita-catagory";
import HeaderBerita from "@/components/event/news/header";
import { HomeLayoutComponent } from "@/components/layouts/home-layout";

const BeritaPage = () => {
  return (
    <HomeLayoutComponent>
      <HeaderBerita />
      <BeritaCatagory />
    </HomeLayoutComponent>
  );
};

export default BeritaPage;
