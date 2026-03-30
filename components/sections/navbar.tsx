import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="fixed top-0 w-full z-50 shadow bg-background backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-accent rounded-lg flex items-center justify-center">
              <Image
                src={"/logo-ppi.png"}
                alt="logo-ppi-bartin"
                width={20}
                height={20}
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              PPI Bartın
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              href="/database"
              className="hover:text-[#0055A4] transition-colors"
            >
              Database
            </Link>
            <Link
              href="/transparansi"
              className="hover:text-[#0055A4] transition-colors"
            >
              Transparansi Keuangan
            </Link>
            <Link
              href="/berita"
              className="hover:text-[#0055A4] transition-colors"
            >
              Berita
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all"
            >
              Portal Anggota
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
