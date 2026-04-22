import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CountdownTimer from "./components/CountdownTimer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        <HeroSection />
        <CountdownTimer />
      </main>
      
      <footer className="py-8 text-center text-stone-500 text-sm font-sans tracking-widest uppercase bg-stone-50 border-t border-stone-200">
        <p>© 2026 Vincent &amp; Sister. All rights reserved.</p>
      </footer>
    </div>
  );
}
