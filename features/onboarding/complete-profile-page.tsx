import UpdateProfileField from "./complete-profile-field";
import { ProfileShell } from "@/features/profile/profile-shell";

const CompleteProfilePage = () => {
  return (
    <ProfileShell
      title="Lengkapi Profil"
      description="Verifikasi status keanggotaan PPI Bartın kamu."
    >
      <UpdateProfileField />
    </ProfileShell>
  );
};

export default CompleteProfilePage;
