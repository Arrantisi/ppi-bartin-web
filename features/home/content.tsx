import AcaraMendatang from "./events/acara-mendatang";
import { FinanceShortcut } from "./finance-shortcut";
import BeritaTerbaru from "./news/berita-terbaru";

export const HomeContent = () => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="lg:col-span-12">
        <FinanceShortcut />
      </div>
      <div className="lg:col-span-7">
        <AcaraMendatang />
      </div>
      <div className="lg:col-span-5">
        <BeritaTerbaru />
      </div>
    </div>
  );
};
