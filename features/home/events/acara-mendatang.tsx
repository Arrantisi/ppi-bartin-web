import Link from "next/link";
import { RenderAcara } from "./render-event";

const AcaraMendatang = () => {
  return (
    <div className="mt-7 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="title-satu">
          Kegiatan Terbaru
        </h1>
        <Link
          href={"/acara"}
          className="title-tiga text-text-secondary"
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
