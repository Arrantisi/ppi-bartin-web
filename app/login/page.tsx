import { GoogleProvider } from "@/components/buttons";
import Image from "next/image";

const RegisterPage = () => {
  return (
    <div className="w-full h-screen max-w-xl md:max-w-3xl xl:max-w-6xl mx-auto flex items-center justify-center">
      <div className="flex flex-col w-full md:max-w-md max-w-xs items-center">
        <div className="flex flex-col w-full items-start">
          <div className="rounded-full shadow p-2">
            <Image
              src={"/logo-ppi.png"}
              alt=""
              height={200}
              width={200}
              className="size-8"
            />
          </div>
          <h1 className="mb-1 mt-4 text-2xl font-bold tracking-tight">
            Masuk ke PPI Bartin
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Selamat datang! Silakan masuk untuk melanjutkan akses.
          </p>
        </div>

        <GoogleProvider />

        <div className="mt-6 border-t pt-4 w-full max-w-xs">
          <p className="text-center text-xs text-muted-foreground">
            Mengalami masalah saat lengkapi data diri? Hubungi Admin PPI di{" "}
            <span className="font-medium text-primary hover:underline underline-offset-4 cursor-pointer">
              @ppi_bartin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
