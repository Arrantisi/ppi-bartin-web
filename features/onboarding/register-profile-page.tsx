import RegisterField from "./register-profile-field";
import { ProfileShell } from "@/features/profile/profile-shell";

const RegisterProfilePage = () => {
  return (
    <ProfileShell
      title="Lengkapi Profil"
      description="Verifikasi status keanggotaan PPI Bartın kamu."
    >
      <RegisterField />
    </ProfileShell>
  );
};

export default RegisterProfilePage;
