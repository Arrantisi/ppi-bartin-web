import { NewsFormField } from "@/components/field/news-form";
import { ContentFormShell } from "@/components/layout/content-form-shell";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const CreateNewsContent = ({
  backHref = "/home/berita",
}: {
  backHref?: string;
} = {}) => {
  return (
    <HomeLayoutComponent>
      <ContentFormShell
        eyebrow="Manajemen berita"
        title="Buat berita"
        description="Bagikan informasi terbaru kepada seluruh anggota PPI Bartın."
        backHref={backHref}
        tips={[
          "Gunakan judul yang singkat dan jelas.",
          "Cover yang tajam membantu berita mudah dikenali.",
          "Tulis ringkasan maksimal satu paragraf.",
        ]}
      >
        <NewsFormField mode="create" backHref={backHref} />
      </ContentFormShell>
    </HomeLayoutComponent>
  );
};
