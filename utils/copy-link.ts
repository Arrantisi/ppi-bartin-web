import { toast } from "sonner";

export const handleShare = (title?: string, text?: string) => {
  const url = window.location.href;
  const shareData: ShareData = { title: title || "", text: text || "", url };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link berhasil disalin ke clipboard!");
      })
      .catch((err) => {
        console.error("Gagal menyalin link: ", err);
      });
  }
};

export const handleCopyLink = () => {
  const currentUrl = window.location.href;

  navigator.clipboard
    .writeText(currentUrl)
    .then(() => {
      toast.success("Link berhasil disalin ke clipboard!");
    })
    .catch((err) => {
      console.error("Gagal menyalin link: ", err);
    });
};
