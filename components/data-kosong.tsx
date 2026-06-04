import { IconCalendarOff, IconNewsOff } from "@tabler/icons-react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export const DataKosong = ({
  href,
  catagory,
}: {
  catagory: "Berita" | "Acara";
  href: string;
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-10 mt-4 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface-hover text-text-primary">
        {catagory === "Acara" ? (
          <IconCalendarOff className="h-10 w-10" />
        ) : (
          <IconNewsOff className="h-10 w-10" />
        )}
      </div>
      <h3 className="mt-4 title-tiga text-text-primary">Belum Ada {catagory}</h3>
      <p className="mb-6 mt-2 body text-text-secondary max-w-[250px] mx-auto">
        {catagory === "Acara"
          ? "Sepertinya jadwal acara masih kosong. Silakan kembali lagi nanti atau buat acara baru."
          : "Sepertinya Berita masih kosong. Silakan kembali lagi nanti atau buat Berita baru."}
      </p>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        onClick={() => router.push(href)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Buat Acara Pertama
      </button>
    </div>
  );
};
