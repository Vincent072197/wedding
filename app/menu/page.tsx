import Navbar from "../components/Navbar";

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden bg-rose-50/30">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20 px-4 flex justify-center">
        <div className="max-w-2xl w-full bg-white p-8 md:p-16 shadow-lg border border-rose-100 rounded-sm">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-primary mb-2">Wedding Menu</h1>
            <p className="font-sans text-sm tracking-widest text-stone-500 uppercase">A Feast to Celebrate</p>
            <div className="w-16 h-px bg-primary/30 mx-auto mt-6" />
          </div>

          <div className="space-y-12">
            {/* Appetizers */}
            <section className="text-center">
              <h2 className="font-serif text-2xl text-stone-800 mb-6 italic">Appetizers</h2>
              <div className="space-y-4 font-sans text-stone-600">
                <p>
                  <span className="font-semibold block text-stone-800">龍蝦沙拉佐魚子醬</span>
                  Lobster Salad with Caviar
                </p>
                <p>
                  <span className="font-semibold block text-stone-800">松露野菇濃湯</span>
                  Truffle Mushroom Soup
                </p>
              </div>
            </section>

            {/* Main Course */}
            <section className="text-center">
              <h2 className="font-serif text-2xl text-stone-800 mb-6 italic">Main Course</h2>
              <div className="space-y-4 font-sans text-stone-600">
                <p>
                  <span className="font-semibold block text-stone-800">法式慢燉紅酒牛頰</span>
                  French Slow-Cooked Red Wine Beef Cheek
                </p>
                <p>
                  <span className="font-semibold block text-stone-800">香煎北海道干貝佐海膽醬</span>
                  Seared Hokkaido Scallops with Uni Sauce
                </p>
              </div>
            </section>

            {/* Dessert */}
            <section className="text-center">
              <h2 className="font-serif text-2xl text-stone-800 mb-6 italic">Desserts &amp; Drinks</h2>
              <div className="space-y-4 font-sans text-stone-600">
                <p>
                  <span className="font-semibold block text-stone-800">經典法式千層酥</span>
                  Classic Mille-Feuille
                </p>
                <p>
                  <span className="font-semibold block text-stone-800">手沖莊園咖啡 &amp; 伯爵茶</span>
                  Pour-over Coffee &amp; Earl Grey Tea
                </p>
              </div>
            </section>
          </div>
          
          <div className="mt-16 text-center">
            <div className="w-16 h-px bg-primary/30 mx-auto mb-6" />
            <p className="font-serif italic text-primary">Bon Appétit</p>
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-stone-500 text-sm font-sans tracking-widest uppercase bg-white border-t border-stone-200">
        <p>© 2026 Vincent &amp; Sister. All rights reserved.</p>
      </footer>
    </div>
  );
}
