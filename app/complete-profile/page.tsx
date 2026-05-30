import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkNoSiswa } from "@/server/data/users";
import CompleteProfileOnboardingPage from "@/features/onboarding/03-complete-profile-page";

export default async function CompleteProfileRoute() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const student = await checkNoSiswa();

  if (!student?.nomorSiswa) {
    redirect("/register-profile");
  }

  if (!student.username) {
    // user must first set username at /register-profile/username
    redirect("/register-profile/username");
  }

  // If profile is already complete (all required fields filled), redirect to home
  if (
    student.fakultas &&
    student.jurusan &&
    student.angkatan &&
    student.statusPelajar &&
    student.jenisKelamin &&
    student.image
  ) {
    redirect("/home");
  }

  return <CompleteProfileOnboardingPage />;
}
