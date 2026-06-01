import Link from "next/link";
import { ThemeToggle } from "../shared";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 bg-surface-hover rounded-lg flex items-center justify-center">
                <Image
                  src={"/logo-ppi-webp.webp"}
                  alt="logo-ppi-bartin"
                  width={20}
                  height={20}
                />
              </div>
              <span className="title-satu uppercase w-full">
                Portal Digital PPI Bartın
              </span>
              <span className="flex items-center text-sm text-text-secondary">
                Tema
                <ThemeToggle />
              </span>
            </div>
            <p className="body max-w-sm">
              Platform digital Persatuan Pelajar Indonesia di Bartın,
              Turki. Berdedikasi untuk transparansi dan kemudahan akses data
              anggota.
            </p>
          </div>

          <div>
            <h5 className="subheadline mb-6 text-text-primary">
              Layanan
            </h5>
            <ul className="space-y-4 body">
              <li>
                <Link href="/berita" className="hover:text-text-primary transition-colors">
                  Berita Organisasi
                </Link>
              </li>
              <li>
                <Link href="/acara" className="hover:text-text-primary transition-colors">
                  Acara dan Kegiatan
                </Link>
              </li>
              <li>
                <span>
                  Transparansi Keuangan <span className="text-warning">(segera hadir)</span>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="subheadline mb-6 text-text-primary">
              Organisasi
            </h5>
            <ul className="space-y-4 body">
              <li>
                <Link href="/#about" className="hover:text-text-primary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-text-primary transition-colors">
                  Portal Anggota
                </Link>
              </li>
              <li>
                <Link href="/home" className="hover:text-text-primary transition-colors">
                  Masuk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="footnote italic text-center md:text-left">
            © 2026 PPI Bartın. Dikembangkan dengan ♥ di Turki.
          </p>
          <div className="flex gap-8 subheadline text-text-disabled">
            <Link href="#" className="hover:text-text-primary">
              Privacy
            </Link>
            <Link href="#" className="hover:text-text-primary">
              Terms
            </Link>
            <Link href="#" className="hover:text-text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
