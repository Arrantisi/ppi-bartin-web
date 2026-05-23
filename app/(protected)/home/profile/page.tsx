import { ContentProfile } from "@/components/event/profile/content";
import { HeaderProfile } from "@/components/event/profile/header";
import { HeaderContentProfile } from "@/components/event/profile/header-content";

const ProfilePage = () => {
  return (
    <>
      <HeaderProfile />
      <HeaderContentProfile />
      <ContentProfile />
    </>
  );
};

export default ProfilePage;
