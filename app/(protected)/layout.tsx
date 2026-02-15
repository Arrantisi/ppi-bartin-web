import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkNoSiswa } from "@/lib/data";
import { UsernameForceDialog } from "@/components/alert-username";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const student = await checkNoSiswa();

  if (!student?.nomorSiswa) {
    redirect("/complite-profile");
  }

  return (
    <>
      {!student.username && <UsernameForceDialog />}
      {children}
    </>
  );
}
