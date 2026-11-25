import { getNews } from "@/server/data/news";
import { safeDb } from "@/lib/db/safe";
import { DataKosong } from "@/components/data-kosong";
import { ContentPageHeader } from "@/components/shared/content-page-header";
import { NewsEditorial } from "@/components/shared/news-editorial";

export const revalidate = 60;

export default async function PublicNewsPage() {
  const news = await safeDb(() => getNews(), [], "berita list");
  const items = news.slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <ContentPageHeader
        eyebrow="PPI Bartın"
        title="Berita"
        description="Artikel dan berita terbaru tentang PPI Bartın."
      />

      {items.length === 0 ? (
        <DataKosong href="/login" catagory="Berita" />
      ) : (
        <NewsEditorial items={items} hrefBase="/berita" />
      )}
    </div>
  );
}
