import { IconHome } from "@/components/shared/icon-home";
import { ContentPageHeader } from "@/components/shared/content-page-header";

const HeaderBerita = () => {
  return (
    <ContentPageHeader
      eyebrow="Portal berita"
      title="Berita"
      description="Semua info penting untuk kamu, dirangkum dalam satu tempat."
      action={<IconHome />}
    />
  );
};

export default HeaderBerita;
