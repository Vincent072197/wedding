import Navbar from "../components/Navbar";
import IGPostBoard from "../components/IGPostBoard";

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden bg-stone-50">
      <Navbar />
      <main className="flex-1 w-full pt-24 pb-12 flex justify-center items-center">
        {/* We reuse the IGPostBoard here, but pad the top so it's not under the Navbar */}
        <IGPostBoard />
      </main>

      {/* <footer className="py-8 text-center text-stone-500 text-sm font-sans tracking-widest uppercase border-t border-stone-200 bg-white">
    
      </footer> */}
    </div>
  );
}
