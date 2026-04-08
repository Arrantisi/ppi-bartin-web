import Image from "next/image";
import Link from "next/link";

export const IconHome = () => {
  return (
    <Link href={"/home"}>
      <div className="bg-white rounded-full p-1.5 mx-2 flex items-center justify-center">
        <Image
          src={"/logo-ppi.png"}
          alt=""
          width={200}
          height={200}
          className="size-6"
        />
      </div>
    </Link>
  );
};
