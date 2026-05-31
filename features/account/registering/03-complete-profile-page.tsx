import { getProfileUser } from "@/server/data/users";
import CompleteProfileField from "./03-complete-profile-field";
import { OnboardingShell } from "./onboarding-shell";

const CompleteProfileOnboardingPage = async (): Promise<React.JSX.Element> => {
  const user = await getProfileUser();

  return (
    <OnboardingShell
      title="Lengkapi Profil Kamu"
      description="Isi semua data profil untuk menyelesaikan registrasi dan mengakses platform."
      formClassName="flex w-full flex-col items-stretch gap-6 md:max-w-2xl max-w-md"
    >
      <CompleteProfileField {...user} />
    </OnboardingShell>
  );
};

export default CompleteProfileOnboardingPage;
