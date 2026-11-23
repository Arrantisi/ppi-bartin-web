import { getNews } from "@/server/data/news";
import { safeDb } from "@/lib/db/safe";
import { FrameNews } from "@/components/cards/card-news";
import { DataKosong } from "@/components/data-kosong";
import { ContentPageHeader } from "@/components/shared/content-page-header";

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item.slug}
              className={index === 0 ? "md:col-span-2" : undefined}
            >
              <FrameNews
                {...item}
                hrefBase="/berita"
                variant={index === 0 ? "featured" : "compact"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
