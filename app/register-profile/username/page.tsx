import CompleteProfilePage from "@/features/onboarding/complete-profile-page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkNoSiswa } from "@/server/data/users";

export default async function RegisterProfileUsernameRoute() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const student = await checkNoSiswa();

  if (!student?.nomorSiswa) {
    redirect("/register-profile");
  }

  if (student.username) {
    redirect("/home");
  }

  return <CompleteProfilePage />;
}
