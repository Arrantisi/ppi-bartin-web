import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link className="flex items-center gap-2" href="/">
            <div className="size-8 bg-surface-hover rounded-lg flex items-center justify-center">
              <Image
                src={"/logo-ppi-webp.webp"}
                alt="logo-ppi-bartin"
                width={20}
                height={20}
              />
            </div>
            <span className="title-tiga">
              PPI Bartın
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 body text-text-secondary">
            <Link
              href="/#about"
              className="hover:text-text-primary transition-colors"
            >
              Tentang
            </Link>
            <Link
              href="/berita"
              className="hover:text-text-primary transition-colors"
            >
              Berita
            </Link>
            <Link
              href="/acara"
              className="hover:text-text-primary transition-colors"
            >
              Acara
            </Link>
            <Link
              href="/home"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-surface-hover hover:text-text-primary transition-all"
            >
              Masuk ke Portal
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
