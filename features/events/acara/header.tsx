import { IconHome } from "@/components/shared/icon-home";
import { ContentPageHeader } from "@/components/shared/content-page-header";

const HeaderAcara = () => {
  return (
    <ContentPageHeader
      eyebrow="Portal kegiatan"
      title="Kegiatan"
      description="Temukan kegiatan dan acara PPI Bartın terdekat."
      action={<IconHome />}
    />
  );
};

export default HeaderAcara;
