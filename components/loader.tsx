import { LoaderOne } from "@/components/ui/loader";
import Image from "next/image";

export function LoaderOneDemo() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col items-center pb-10">
        <Image
          src="/logo-ppi-webp.webp"
          alt="Logo PPI Bartin"
          height={130}
          width={130}
          priority
          quality={75}
          className="animate-pulse"
        />
        <LoaderOne />
      </div>
    </div>
  );
}
