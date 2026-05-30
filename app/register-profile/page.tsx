import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkNoSiswa } from "@/server/data/users";
import RegisterProfilePage from "@/features/onboarding/01-validate-name-page";

export default async function RegisterProfileRoute() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) redirect("/login");

	const student = await checkNoSiswa();

	if (student?.nomorSiswa) {
		// If no username yet, go to the username step under register-profile
		if (!student.username) redirect("/register-profile/username");

		// if username exists but profile incomplete, send to complete-profile (full profile)
		if (
			student.username &&
			!(
				student.fakultas &&
				student.jurusan &&
				student.angkatan &&
				student.statusPelajar &&
				student.jenisKelamin &&
				student.image
			)
		) {
			redirect("/complete-profile");
		}

		redirect("/home");
	}

	return <RegisterProfilePage />;
}
