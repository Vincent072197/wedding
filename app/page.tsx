import Navbar from "./components/Navbar";
import StorySection from "./components/StorySection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative w-full">
      <Navbar />
      <main className="flex-1 w-full">
        {/* The StorySection contains both the Hero narrative and the Countdown, spanning multiple viewport heights for scroll animations. */}
        <StorySection />
      </main>
    </div>
  );
}
