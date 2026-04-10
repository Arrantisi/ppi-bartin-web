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
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {catagory === "Acara" ? (
          <IconCalendarOff className="h-10 w-10 text-muted-foreground" />
        ) : (
          <IconNewsOff className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold">Belum Ada {catagory}</h3>
      <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-[250px] mx-auto">
        Sepertinya jadwal acara masih kosong. Silakan kembali lagi nanti atau
        buat acara baru.
      </p>
      {/* Tombol opsional jika user punya akses buat event */}
      <button
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
        onClick={() => router.push(href)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Buat Acara Pertama
      </button>
    </div>
  );
};
