import { UpdateProfileComponent } from "./components";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

const ProfileUpdatePage = async () => {
  return (
    <HomeLayoutComponent>
      <UpdateProfileComponent />
    </HomeLayoutComponent>
  );
};

export default ProfileUpdatePage;
