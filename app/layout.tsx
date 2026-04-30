import type { Metadata } from "next";
import {
  Playfair_Display,
  Montserrat,
  Cormorant_Garamond,
  Lato,
  Cinzel,
  Raleway,
  DM_Serif_Display,
  DM_Sans,
} from "next/font/google";
import "./globals.css";
import { getAllConfig } from "@/lib/queries/config";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "600"] });
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["300", "400", "700"] });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"] });
const dmSerif = DM_Serif_Display({ variable: "--font-dm-serif", subsets: ["latin"], weight: "400" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "軒 & 璇 Wedding",
  description: "Join us in celebrating our special day.",
};

const isHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

const FONT_PAIRS: Record<string, { serif: string; sans: string }> = {
  classic:  { serif: "var(--font-playfair)",  sans: "var(--font-montserrat)" },
  romantic: { serif: "var(--font-cormorant)", sans: "var(--font-lato)" },
  luxury:   { serif: "var(--font-cinzel)",    sans: "var(--font-raleway)" },
  modern:   { serif: "var(--font-dm-serif)",  sans: "var(--font-dm-sans)" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let primaryColor = "#f43f5e";
  let bgColor = "#fffafa";
  let fontPairKey = "classic";

  try {
    const rows = await getAllConfig();
    for (const row of rows) {
      if (row.section === "theme") {
        if (row.key === "primaryColor" && isHex(row.value)) primaryColor = row.value;
        if (row.key === "bgColor" && isHex(row.value)) bgColor = row.value;
        if (row.key === "fontPair" && row.value in FONT_PAIRS) fontPairKey = row.value;
      }
    }
  } catch {
    // fall back to defaults if DB is unreachable
  }

  const { serif, sans } = FONT_PAIRS[fontPairKey];

  const fontClasses = [
    playfair.variable, montserrat.variable,
    cormorant.variable, lato.variable,
    cinzel.variable, raleway.variable,
    dmSerif.variable, dmSans.variable,
  ].join(" ");

  return (
    <html
      lang="en"
      className={`${fontClasses} scroll-smooth antialiased`}
      style={{
        "--primary": primaryColor,
        "--background": bgColor,
        "--font-serif": serif,
        "--font-sans": sans,
      } as React.CSSProperties}
    >
      <body className="min-h-screen bg-rose-50/50 font-sans text-stone-800 flex flex-col">
        {children}
      </body>
    </html>
  );
}
