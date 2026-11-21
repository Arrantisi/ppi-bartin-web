import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkNoSiswa } from "@/server/data/users";
import { NotificationAlert } from "@/components/notification-alert";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, student] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    checkNoSiswa(),
  ]);

  if (!session) redirect("/login");
  if (!student?.nomorSiswa) {
    redirect("/register-profile");
  }

  if (!student.username) {
    redirect("/complete-profile");
  }

  const isProfileComplete =
    Boolean(
      student.fakultas &&
        student.jurusan &&
        student.angkatan &&
        student.statusPelajar &&
        student.jenisKelamin &&
        student.image,
    );

  if (!isProfileComplete) {
    redirect("/complete-profile");
  }

  return (
    <>
      <NotificationAlert />
      {children}
    </>
  );
}
