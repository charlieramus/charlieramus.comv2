import type { Metadata } from "next";
import { Libre_Baskerville, Inter, Caveat } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Charlie Ramus",
  description:
    "Charlie Ramus — builder, designer, and photographer based in Boulder, Colorado.",
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
