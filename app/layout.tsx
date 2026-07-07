import type { Metadata } from "next";
import { Libre_Baskerville, Inter, Caveat } from "next/font/google";
import { snapshot, tagline } from "@/data/about";
import "./globals.css";

// Serif — headings / quotes. Libre Baskerville is NOT a variable font, so weights
// are enumerated. The mockup only ever renders upright text, so italic is omitted.
const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Sans — body / UI. Variable font, no weight needed.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Script — accent / signature. Variable font.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

// Title = Charlie's name; description = `tagline` (the <meta>-only one-liner,
// per the V2 hero decision — the name, not the tagline, is the hero headline).
export const metadata: Metadata = {
  title: `${snapshot.name} — Developer, Designer, Photographer`,
  description: tagline,
  openGraph: {
    title: snapshot.name,
    description: tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
