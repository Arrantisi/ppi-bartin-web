import { getProfileUser } from "@/server/data/users";
import CompleteProfileOnboardingField from "@/features/onboarding/complete-profile-onboarding-field";
import { OnboardingShell } from "@/features/onboarding/onboarding-shell";

const CompleteProfileOnboardingPage = async (): Promise<React.JSX.Element> => {
  const user = await getProfileUser();

  return (
    <OnboardingShell
      title="Lengkapi Profil Kamu"
      description="Isi semua data profil untuk menyelesaikan registrasi dan mengakses platform."
      formClassName="flex w-full flex-col items-stretch gap-6 md:max-w-2xl max-w-md"
    >
      <CompleteProfileOnboardingField {...user} />
    </OnboardingShell>
  );
};

export default CompleteProfileOnboardingPage;
