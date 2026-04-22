import Navbar from "../components/Navbar";

export default function LocationPage() {
  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden bg-stone-50">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-stone-800 mb-4">Location &amp; Transport</h1>
          <p className="font-sans text-stone-500 max-w-xl mx-auto">
            We are excited to celebrate with you. Below you will find all the details regarding our wedding venue, parking, and transportation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Card */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="font-serif text-2xl text-primary mb-2">Venue (婚宴會館)</h2>
              <p className="font-sans font-semibold text-stone-800">The Grand Ballroom Hotel</p>
              <p className="font-sans text-stone-600 mt-1">123 Wedding Blvd, Romance City, RC 90210</p>
            </div>

            <div className="mb-8">
              <h2 className="font-serif text-2xl text-primary mb-2">Parking (停車資訊)</h2>
              <p className="font-sans text-stone-600">
                Complimentary valet parking is available at the main entrance. Self-parking is located in the underground garage (Level B1 &amp; B2). Please validate your ticket at the reception.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-2">Shuttle Bus (接駁車)</h2>
              <p className="font-sans text-stone-600">
                A shuttle bus will depart from Central Station (Exit 3) every 30 minutes starting from 4:00 PM. The last return shuttle will leave the venue at 11:00 PM.
              </p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-stone-200 w-full h-[400px] md:h-auto min-h-[400px] rounded-sm flex items-center justify-center border border-stone-300 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30" />
             <div className="relative z-10 bg-white/90 backdrop-blur px-6 py-4 rounded shadow-lg text-center">
               <span className="font-sans font-semibold text-stone-800 block mb-1">Google Maps iframe</span>
               <span className="text-sm text-stone-500">To be embedded here</span>
             </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-stone-500 text-sm font-sans tracking-widest uppercase bg-white border-t border-stone-200">
        <p>© 2026 Vincent &amp; Sister. All rights reserved.</p>
      </footer>
    </div>
  );
}
