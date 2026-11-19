import AcaraMendatang from "./events/acara-mendatang";
import { FinanceShortcut } from "./finance-shortcut";
import BeritaTerbaru from "./news/berita-terbaru";

export const HomeContent = () => {
  return (
    <div className="mt-6 space-y-10">
      <FinanceShortcut />
      <AcaraMendatang />
      <BeritaTerbaru />
    </div>
  );
};
