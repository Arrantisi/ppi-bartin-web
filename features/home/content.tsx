import AcaraMendatang from "./events/acara-mendatang";
import BeritaTerbaru from "./news/berita-terbaru";

export const HomeContent = () => {
  return (
    <div className="mt-6 space-y-10">
      <AcaraMendatang />
      <BeritaTerbaru />
    </div>
  );
};
