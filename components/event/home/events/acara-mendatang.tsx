import Link from "next/link";
import { RenderAcara } from "./render-event";

const AcaraMendatang = () => {
  return (
    <div className="mt-7 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-[22px] tracking-tight">
          Kegiatan Tebaru
        </h1>
        <Link
          href={"/home/events"}
          className="text-accent-foreground font-semibold text-sm"
        >
          selengkapnya
        </Link>
      </div>
      <div className="flex justify-center">
        <RenderAcara />
      </div>
    </div>
  );
};

export default AcaraMendatang;
