import RegisterField from "./register-profile-field";
import { OnboardingShell } from "@/features/onboarding/onboarding-shell";

const RegisterProfilePage = () => {
  return (
    <OnboardingShell
      title="Lengkapi Profil"
      description="Verifikasi status keanggotaan PPI Bartın kamu."
      formClassName="flex w-full flex-col items-stretch gap-6 md:max-w-md max-w-xs"
    >
      <RegisterField />
    </OnboardingShell>
  );
};

export default RegisterProfilePage;
