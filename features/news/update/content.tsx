import { NewsFormField } from "@/components/field/news-form";
import { ContentFormShell } from "@/components/layout/content-form-shell";
import { HomeLayoutComponent } from "@/components/layout/home-layout";
import { TupdateNewsProps } from "@/types";

export const UpdateNewsContent = ({
  slug,
  data,
  backHref = "/home/berita",
}: TupdateNewsProps & { backHref?: string }) => {
  return (
    <HomeLayoutComponent>
      <ContentFormShell
        eyebrow="Manajemen berita"
        title="Edit berita"
        description="Perbarui detail berita di bawah ini, lalu simpan perubahan."
        backHref={backHref}
        tips={[
          "Periksa kembali judul dan kategori berita.",
          "Cover yang tajam membantu berita mudah dikenali.",
          "Perubahan environment mengubah semua audiens yang melihat berita.",
        ]}
      >
        <NewsFormField
          mode="update"
          slug={slug}
          data={data}
          backHref={backHref}
        />
      </ContentFormShell>
    </HomeLayoutComponent>
  );
};
