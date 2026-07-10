import type { Metadata } from "next";
import { Libre_Baskerville, Inter, Caveat } from "next/font/google";
import { snapshot, tagline } from "@/data/about";
import { SITE_URL, SITE_NAME } from "@/data/site";
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
// metadataBase resolves relative OG/canonical URLs (and the generated
// app/opengraph-image.tsx) to absolute; `title.template` lets inner routes set a
// short title that gets the "— Charlie Ramus" suffix for free.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${snapshot.name} — Developer, Designer, Photographer`,
    template: `%s — ${SITE_NAME}`,
  },
  description: tagline,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "en_US",
    title: `${snapshot.name} — Developer, Designer, Photographer`,
    description: tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${snapshot.name} — Developer, Designer, Photographer`,
    description: tagline,
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
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
