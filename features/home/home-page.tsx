import { HomeContent, ProfileHome } from "./components";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

const HomePage = () => {
  return (
    <HomeLayoutComponent>
      <ProfileHome />
      <HomeContent />
    </HomeLayoutComponent>
  );
};

export default HomePage;
