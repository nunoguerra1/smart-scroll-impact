import Preloader from "./components/Preloader";
import NoiseOverlay from "./components/NoiseOverlay";
import Hero from "./components/Hero";
import Features from "./components/Features";
import BentoGrid from "./components/BentoGrid";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-[#EBE6DF] min-h-screen">
      <Preloader />
      <NoiseOverlay />

      <section id="hero">
        <Hero />
      </section>

      <section id="manifesto">
        <Features />
      </section>

      <section id="lab">
        <BentoGrid />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}