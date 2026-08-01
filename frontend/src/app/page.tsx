import Preloader from "./components/Preloader";
import NoiseOverlay from "./components/NoiseOverlay";
import Hero from "./components/Hero";
import Features from "./components/Features";

export default function Home() {
  return (
    <main className="bg-[#EBE6DF] min-h-screen">
      <Preloader />
      <NoiseOverlay />
      <Hero />
      <Features />

    </main>
  );
}