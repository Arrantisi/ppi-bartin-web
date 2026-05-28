import UpdateProfileField from "./complete-profile-field";
import { ProfileShell } from "@/features/profile/profile-shell";

const CompleteProfilePage = () => {
  return (
    <ProfileShell
      title="Buat Username"
      description="Lengkapi profil kamu dengan username yang unik dan mudah dikenali."
    >
      <UpdateProfileField />
    </ProfileShell>
  );
};

export default CompleteProfilePage;
