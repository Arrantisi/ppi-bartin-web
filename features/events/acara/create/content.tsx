import { EventFormField } from "@/components/field/event-form";
import { ContentFormShell } from "@/components/layout/content-form-shell";
import { HomeLayoutComponent } from "@/components/layout/home-layout";

export const CreateEventContent = ({
  backHref = "/home/acara",
}: {
  backHref?: string;
} = {}) => {
  return (
    <HomeLayoutComponent>
      <ContentFormShell
        eyebrow="Manajemen acara"
        title="Buat acara"
        description="Susun informasi kegiatan agar peserta mudah mengikuti."
        backHref={backHref}
        tips={[
          "Pastikan batas pendaftaran sebelum tanggal acara.",
          "Cantumkan lokasi yang mudah ditemukan peserta.",
          "Cover acara membantu peserta mengenali kegiatan.",
        ]}
      >
        <EventFormField mode="create" backHref={backHref} />
      </ContentFormShell>
    </HomeLayoutComponent>
  );
};
