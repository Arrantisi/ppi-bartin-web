import ValidateNameField from "./01-validate-name-field";
import { OnboardingShell } from "@/features/onboarding/onboarding-shell";

const ValidateNamePage = () => {
  return (
    <OnboardingShell
      title="Lengkapi Profil"
      description="Verifikasi status keanggotaan PPI Bartın kamu."
      formClassName="flex w-full flex-col items-stretch gap-6 md:max-w-md max-w-xs"
    >
      <ValidateNameField />
    </OnboardingShell>
  );
};

export default ValidateNamePage;
