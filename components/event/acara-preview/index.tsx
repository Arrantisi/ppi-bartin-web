"use client";

import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconCalendarWeek,
  IconCloud,
  IconMapPin,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAcaraPreview } from "@/data/acara";
import { formattedDate } from "@/utils/date-format";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { SheetForm } from "../sheet-form";
import { supabase } from "@/lib/supabase";
import PhotoUpload from "../dialog-upload";
import {
  Dialog,
  DialogTrigger,
} from "@/components/animate-ui/components/base/dialog";
import { toastManager } from "@/components/ui/toast";
import { publishAcara } from "@/actions/acara";
import { Spinner } from "@/components/ui/spinner";
import AvatarParticipant from "../avatar-participant";

export const EventPreviewComoponent = ({ slug }: { slug: string }) => {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [onLoading, setOnLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["getPreviewAcara", slug],
    queryFn: () => getAcaraPreview(slug),
  });

  useEffect(() => {
    const channel = supabase
      .channel("preview_acara")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getPreviewAcara"] });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "images",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["getPreviewAcara"] });
        },
      )
      .subscribe((status) => {
        console.log(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handlePusblish = async () => {
    setOnLoading(true);
    const fetc = await publishAcara(slug);
    if (fetc.status === "success") {
      toastManager.add({ type: "success", title: "Acara berhasil di publish" });
      router.push("/events/acara");
    } else {
      toastManager.add({ type: "error", title: fetc.msg });
    }
    setOnLoading(false);
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading data acara...</div>;

  if (!data)
    return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="relative flex flex-col h-screen bg-background overflow-hidden">
          {/* Gambar & Header Sticky */}
          <div className="relative h-[40vh] w-full">
            {data.images && data.images.length > 0 ? (
              <Image
                src={data.images[0].url}
                alt={""}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <DialogTrigger
                  className={
                    "rounded-full py-3 px-4 text-sm shadow flex items-center gap-2"
                  }
                >
                  Upload Photo <IconCloud />
                </DialogTrigger>
              </div>
            )}

            <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-10">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-md bg-white/80 backdrop-blur-sm"
                onClick={() => router.back()}
              >
                <IconArrowLeft size={20} />
              </Button>

              <div className="font-bold text-lg drop-shadow-md bg-white/80 p-2 rounded-full backdrop-blur-md">
                Preview Acara
              </div>

              <div className="flex gap-2">
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    className="rounded-full shadow-md bg-white/80 backdrop-blur-sm w-full text-sm px-3"
                  >
                    Update
                  </Button>
                </SheetTrigger>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-background -mt-8 relative z-20 rounded-t-[2.5rem] px-6 pt-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {data.judul}
              </h1>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Oleh{" "}
                  <span className="font-medium text-foreground capitalize">
                    {data.creator.username}
                  </span>
                </p>
                <AvatarParticipant
                  participant={data.participants.map((p) => ({
                    image: p.user.image || "",
                  }))}
                  totalParticipant={data.participants.length}
                  maxCapacity={data.maxCapacity}
                />
              </div>

              <div className="prose prose-sm text-muted-foreground mb-8">
                <p>{data.content}</p>
              </div>

              {/* Info Waktu & Tempat */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <IconCalendarWeek size={20} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">Tanggal</span>
                    <span className="text-xs text-muted-foregroun">
                      {formattedDate(data.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <IconMapPin size={20} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">Lokasi</span>
                    <span className="text-xs text-muted-foreground">
                      {data.lokasi}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pb-8 mt-auto">
              <Button
                onClick={handlePusblish}
                disabled={onLoading}
                className="w-full rounded-full py-7 text-base font-semibold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
              >
                {onLoading && <Spinner className="size-6" />} Publish Sekarang
              </Button>
            </div>
          </div>
        </div>
        <PhotoUpload
          catagory="acara"
          onClose={() => setIsDialogOpen(false)}
          slug={slug}
        />
        <SheetForm
          onClose={() => setIsSheetOpen(false)}
          catagory="update"
          maxCapacity={data.maxCapacity}
          content={data.content}
          slug={data.slug}
          date={data.date}
          lokasi={data.lokasi}
          judul={data.judul}
        />
      </Sheet>
    </Dialog>
  );
};
