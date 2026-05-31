import Link from "next/link";
import { RenderNews } from "./render-news";

const BeritaTerbaru = () => {
  return (
    <div className="mt-7 space-y-2 mb-28">
      <div className="flex justify-between items-center">
        <h1 className="title-satu capitalize">
          berita terbaru
        </h1>
        <Link
          href={"/berita"}
          className="title-tiga text-text-secondary"
        >
          selengkapnya
        </Link>
      </div>

      <RenderNews />
    </div>
  );
};

export default BeritaTerbaru;
