import UpdateProfileField from "./02-username-field";
import { OnboardingShell } from "./onboarding-shell";

const UsernamePage = () => {
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

export default UsernamePage;
