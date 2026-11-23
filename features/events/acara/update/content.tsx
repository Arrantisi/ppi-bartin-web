import { EventFormField } from "@/components/field/event-form";
import { ContentFormShell } from "@/components/layout/content-form-shell";
import { HomeLayoutComponent } from "@/components/layout/home-layout";
import { TupdateEventProps } from "@/types";

export const UpdateEventContent = ({
  slug,
  data,
  backHref = "/home/acara",
}: TupdateEventProps & { backHref?: string }) => {
  return (
    <HomeLayoutComponent>
      <ContentFormShell
        eyebrow="Manajemen acara"
        title="Edit acara"
        description="Perbarui detail acara di bawah ini, lalu simpan perubahan."
        backHref={backHref}
        tips={[
          "Periksa kembali jadwal dan kuota peserta.",
          "Batas pendaftaran tidak boleh melewati tanggal acara.",
          "Perubahan environment mengubah semua audiens yang melihat acara.",
        ]}
      >
        <EventFormField
          mode="update"
          slug={slug}
          data={data}
          backHref={backHref}
        />
      </ContentFormShell>
    </HomeLayoutComponent>
  );
};
