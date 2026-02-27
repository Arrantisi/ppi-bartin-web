import { HomeLayoutComponent } from "@/components/layouts/home-layout";
import { ContentProfile } from "@/components/event/profile/content";
import { HeaderProfile } from "@/components/event/profile/header";
import { HeaderContentProfile } from "@/components/event/profile/header-content";

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
