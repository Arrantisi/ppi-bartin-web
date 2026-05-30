import UpdateProfileField from "./complete-profile-field";
import { OnboardingShell } from "@/features/onboarding/onboarding-shell";

const CompleteProfilePage = () => {
  return (
    <OnboardingShell
      title="Buat Username"
      description="Lengkapi profil kamu dengan username yang unik dan mudah dikenali."
      formClassName="flex w-full flex-col items-stretch gap-6 md:max-w-md max-w-xs"
    >
      <UpdateProfileField />
    </OnboardingShell>
  );
};

export default CompleteProfilePage;
