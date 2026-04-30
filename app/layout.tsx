import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { getAllConfig } from "@/lib/queries/config";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "軒 & 璇 Wedding",
  description: "Join us in celebrating our special day.",
};

const isHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let primaryColor = "#f43f5e";
  let bgColor = "#fffafa";

  try {
    const rows = await getAllConfig();
    for (const row of rows) {
      if (row.section === "theme") {
        if (row.key === "primaryColor" && isHex(row.value)) primaryColor = row.value;
        if (row.key === "bgColor" && isHex(row.value)) bgColor = row.value;
      }
    }
  } catch {
    // fall back to defaults if DB is unreachable
  }

  const themeStyle = `:root { --primary: ${primaryColor}; --background: ${bgColor}; }`;

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} scroll-smooth antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body className="min-h-screen bg-rose-50/50 font-sans text-stone-800 flex flex-col">
        {children}
      </body>
    </html>
  );
}
