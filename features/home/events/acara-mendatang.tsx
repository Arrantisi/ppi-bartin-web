import Link from "next/link";
import { RenderAcara } from "./render-event";

const AcaraMendatang = () => {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[1rem] font-semibold tracking-[-0.01em] text-text-primary">
          Kegiatan terbaru
        </h2>
        <Link href="/home/acara" className="text-[0.8125rem] text-text-secondary">
          Lihat lebih banyak
        </Link>
      </div>
      <div className="flex justify-center">
        <RenderAcara />
      </div>
    </section>
  );
};

export default AcaraMendatang;
