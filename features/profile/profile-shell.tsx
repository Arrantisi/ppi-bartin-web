import ButtonUser from "@/components/button-user";
import Image from "next/image";
import Link from "next/link";

type ProfileShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const ProfileShell = ({
  title,
  description,
  children,
}: ProfileShellProps) => {
  return (
    <div className="w-full h-screen max-w-xl md:max-w-3xl xl:max-w-6xl mx-auto flex items-center justify-center">
      <div className="flex flex-col w-full md:max-w-md max-w-xs items-center">
        <div className="flex flex-col w-full items-start">
          <div className="mb-6 space-y-1">
            <div className="rounded-full shadow p-2 w-fit">
              <Image
                src="/logo-ppi.png"
                alt="PPI Bartin"
                height={200}
                width={200}
                className="size-8"
              />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {children}

        <div className="mt-6 border-t pt-4 w-full max-w-xs">
          <p className="text-center text-xs text-muted-foreground">
            Mengalami masalah saat lengkapi data diri? Hubungi Admin PPI di{" "}
            <span className="font-medium text-primary hover:underline underline-offset-4 cursor-pointer">
              <Link href="">@ppi_bartin</Link>
            </span>
          </p>
        </div>
      </div>

      <div className="absolute top-6 right-6">
        <ButtonUser />
      </div>
    </div>
  );
};
