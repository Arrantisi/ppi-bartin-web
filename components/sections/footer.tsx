import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-500/20">
                B
              </div>
              <span className="font-bold text-2xl tracking-tighter text-foreground uppercase">
                PPI Bartın
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Platform resmi digital Persatuan Pelajar Indonesia di Bartın,
              Turki. Berdedikasi untuk transparansi dan kemudahan akses data
              anggota.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-6 uppercase text-xs tracking-widest">
              Layanan
            </h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Verifikasi Data
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Portal Anggota
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Laporan Keuangan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-6 uppercase text-xs tracking-widest">
              Organisasi
            </h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Struktur Kepengurusan
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  AD/ART
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm italic text-center md:text-left">
            © 2026 PPI Bartın. Dikembangkan dengan ♥ di Turki.
          </p>
          <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
