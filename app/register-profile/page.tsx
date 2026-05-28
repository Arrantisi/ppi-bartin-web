import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkNoSiswa } from "@/server/data/users";
import RegisterProfilePage from "@/features/onboarding/register-profile-page";

export default async function RegisterProfileRoute() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) redirect("/login");

	const student = await checkNoSiswa();

	if (student?.nomorSiswa) {
		if (!student.username) redirect("/complete-profile");
		redirect("/home");
	}

	return <RegisterProfilePage />;
}
