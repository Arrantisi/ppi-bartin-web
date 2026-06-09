import { getNews } from "@/server/data/news";
import { FrameNews } from "@/components/cards/card-news";
import { DataKosong } from "@/components/data-kosong";

export const revalidate = 60;

export default async function PublicNewsPage() {
  const news = await getNews();

  if (!news || news.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Berita</h1>
          <p className="text-muted-foreground">
            Artikel dan berita terbaru tentang PPI Bartin.
          </p>
        </div>
        <DataKosong href="/login" catagory="Berita" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Berita</h1>
        <p className="text-muted-foreground">
          Artikel dan berita terbaru tentang PPI Bartin.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {news.map((item) => (
          <FrameNews key={item.slug} {...item} hrefBase="/berita" />
        ))}
      </div>
    </div>
  );
}
