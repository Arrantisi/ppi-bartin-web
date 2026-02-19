import BeritaCatagory from "@/components/event/news/berita-catagory";
import CarouselCard from "@/components/event/news/carousel-card";
import HeaderBerita from "@/components/event/news/header";
import { HomeLayoutComponent } from "@/components/layouts/home-layout";

const BeritaPage = () => {
  return (
    <HomeLayoutComponent>
      <HeaderBerita />
      <CarouselCard />
      <BeritaCatagory />
    </HomeLayoutComponent>
  );
};

export default BeritaPage;
