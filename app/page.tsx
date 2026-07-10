import Hero from "@/components/hero";
import DigitalHome from "@/components/digital-home";
import RightNow from "@/components/right-now";
import PersonalBento from "@/components/personal-bento";
import Work from "@/components/work";
import Services from "@/components/services";
import About from "@/components/about";
import Contact from "@/components/contact";
import Finale from "@/components/finale";
import { snapshot, tagline } from "@/data/about";
import { socials } from "@/data/socials";
import { SITE_URL } from "@/data/site";

// Person structured data (schema.org) — describes Charlie to search engines / AI.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: snapshot.name,
  url: SITE_URL,
  jobTitle: snapshot.roles.join(", "),
  address: { "@type": "PostalAddress", addressLocality: snapshot.location },
  description: tagline,
  sameAs: socials.map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <main id="main-content" tabIndex={-1}>
        <DigitalHome />
        <RightNow />
        <PersonalBento />
        <Work />
        <Services />
        <About />
        <Contact />
        <Finale />
      </main>
      {/* CUSTOMIZE: legal line */}
      <footer className="legal-min">
        © {new Date().getFullYear()} {snapshot.name} · {snapshot.location}
      </footer>
    </>
  );
}
