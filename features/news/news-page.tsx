import { BeritaCatagory, HeaderBerita } from "./components";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

const NewsPage = () => {
  return (
    <HomeLayoutComponent>
      <HeaderBerita />
      <BeritaCatagory />
    </HomeLayoutComponent>
  );
};

export default NewsPage;
