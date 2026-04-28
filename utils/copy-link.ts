import { toast } from "sonner";

export const handleCopyLink = () => {
  const currentUrl = window.location.href; // Mengambil URL halaman detail saat ini

  navigator.clipboard
    .writeText(currentUrl)
    .then(() => {
      // Gunakan toast atau alert sederhana
      toast.success("Link berhasil disalin ke clipboard!");
      // Jika kamu punya library toast (seperti shadcn/ui toast), gunakan itu:
      // toast({ title: "Tersalin!", description: "Link acara telah disalin." });
    })
    .catch((err) => {
      console.error("Gagal menyalin link: ", err);
    });
};
