import Link from "next/link";
import { RenderNews } from "./render-news";

const BeritaTerbaru = () => {
  return (
    <section className="space-y-3 pb-28">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[1rem] font-semibold tracking-[-0.01em] text-text-primary">
          Berita terbaru
        </h2>
        <Link href="/home/berita" className="text-[0.8125rem] text-text-secondary">
          Lihat lebih banyak
        </Link>
      </div>

      <RenderNews />
    </section>
  );
};

export default BeritaTerbaru;
