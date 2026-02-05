import ButtonUser from "@/components/button-user";
import { AdminLink } from "@/components/buttons";
import RegisterField from "@/components/field/complite-profile-field";

const CompleteProfilePage = () => {
  return (
    <div className="w-full h-screen max-w-xl md:max-w-3xl xl:max-w-6xl mx-auto flex items-center justify-center">
      <div className="flex flex-col w-full md:max-w-md max-w-xs items-center">
        <div className="flex flex-col w-full items-start">
          <div className="mb-6 space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Lengkapi Profil
            </h2>
            <p className="text-sm text-muted-foreground">
              Verifikasi status keanggotaan PPI Bartın kamu.
            </p>
          </div>
        </div>
        <RegisterField />
        <div className="mt-6 border-t pt-4 w-full max-w-xs">
          <p className="text-center text-xs text-muted-foreground">
            Mengalami masalah saat lengkapi data diri? Hubungi Admin PPI di{" "}
            <AdminLink />
          </p>
        </div>
      </div>
      <div className="absolute top-6 right-6">
        <ButtonUser />
      </div>
    </div>
  );
};

export default CompleteProfilePage;
