import Link from "next/link";

const BeritaTerbaru = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-7 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg tracking-tight capitalize">
          berita terbaru
        </h1>
        <Link
          href={"/events/berita"}
          className="text-primary font-semibold text-sm"
        >
          selengkapnya
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default BeritaTerbaru;
