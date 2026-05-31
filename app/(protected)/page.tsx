import { DashboardPreview } from "@/components/sections/dashboard-preview";
import { Features } from "@/components/sections/feature";
import { FinanceSection } from "@/components/sections/finance-section";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { NewsSection } from "@/components/sections/news-section";

export default function HomePage() {
  return (
    <div className="min-h-screen z-20">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <Features />
      <FinanceSection />
      <NewsSection />
      <Footer />
    </div>
  );
}
