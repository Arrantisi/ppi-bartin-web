import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { NewsSection } from "@/components/sections/news-section";

export default function PublicHomePage() {
  return (
    <div className="min-h-screen z-20">
      <Navbar />
      <Hero />
      <NewsSection />
      <Footer />
    </div>
  );
}