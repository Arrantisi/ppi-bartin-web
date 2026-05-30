import ButtonUser from "@/components/button-user";
import Image from "next/image";
import Link from "next/link";

type OnboardingShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  formClassName?: string;
};

export const OnboardingShell = ({
  title,
  description,
  children,
  formClassName = "flex w-full flex-col items-stretch gap-6 md:max-w-md max-w-xs",
}: OnboardingShellProps) => {
  return (
    <div className="relative flex min-h-screen w-full max-w-xl items-start justify-center overflow-y-auto px-4 py-8 mx-auto md:max-w-3xl md:items-center xl:max-w-6xl sm:px-6 sm:py-10">
      <div className={formClassName}>
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

        <div className="w-full">{children}</div>

        <div className="mt-6 border-t pt-4 w-full">
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