import { ContentProfile, HeaderContentProfile, HeaderProfile } from "./components";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

const ProfilePage = () => {
  return (
    <HomeLayoutComponent>
      <HeaderProfile />
      <HeaderContentProfile />
      <ContentProfile />
    </HomeLayoutComponent>
  );
};

export default ProfilePage;
