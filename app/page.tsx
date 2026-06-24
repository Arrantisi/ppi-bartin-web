import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";

export default function PublicHomePage() {
  return (
    <div className="min-h-screen z-20">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
