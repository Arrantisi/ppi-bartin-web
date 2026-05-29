import { getProfileUser } from "@/server/data/users";
import { CompleteProfileOnboardingField } from "./complete-profile-onboarding-field";
import { ProfileShell } from "@/features/profile/profile-shell";

const CompleteProfileOnboardingPage = async () => {
  const user = await getProfileUser();

  return (
    <ProfileShell
      title="Lengkapi Profil Kamu"
      description="Isi semua data profil untuk menyelesaikan registrasi dan mengakses platform."
    >
      <CompleteProfileOnboardingField {...user} />
    </ProfileShell>
  );
};

export default CompleteProfileOnboardingPage;
