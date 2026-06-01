import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HomeLayoutComponent } from "@/components/layout/home-layout";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { absoluteUrl, defaultOgImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "PPI Bartin | Portal Mahasiswa Indonesia di Bartin",
  description: "Portal resmi Persatuan Pelajar Indonesia di Bartin, Turki. Informasi kegiatan, acara, dan berita terkini.",
  openGraph: {
    title: "PPI Bartin | Portal Mahasiswa Indonesia di Bartin",
    description: "Portal resmi Persatuan Pelajar Indonesia di Bartin, Turki. Informasi kegiatan, acara, dan berita terkini.",
    url: absoluteUrl("/"),
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "PPI Bartin | Portal Mahasiswa Indonesia di Bartin",
    description: "Portal resmi Persatuan Pelajar Indonesia di Bartin, Turki. Informasi kegiatan, acara, dan berita terkini.",
    images: [defaultOgImage.url],
  },
};

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    return <HomeLayoutComponent>{children}</HomeLayoutComponent>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
