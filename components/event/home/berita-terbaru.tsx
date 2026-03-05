import Link from "next/link";
import { RenderNews } from "./render-news";

const BeritaTerbaru = () => {
  return (
    <div className="mt-7 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg tracking-tight capitalize">
          berita terbaru
        </h1>
        <Link
          href={"/home/news"}
          className="text-accent-foreground font-semibold text-sm"
        >
          selengkapnya
        </Link>
      </div>

      <RenderNews />
    </div>
  );
};

export default BeritaTerbaru;
