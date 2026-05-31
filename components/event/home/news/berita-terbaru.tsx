import Link from "next/link";
import { RenderNews } from "./render-news";

const BeritaTerbaru = () => {
  return (
    <div className="mt-7 space-y-2 mb-28">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-[22px] tracking-tight capitalize">
          berita terbaru
        </h1>
        <Link
          href={"/home/berita"}
          className="text-secondary font-semibold text-[15px]"
        >
          selengkapnya
        </Link>
      </div>

      <RenderNews />
    </div>
  );
};

export default BeritaTerbaru;
