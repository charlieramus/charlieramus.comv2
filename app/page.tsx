import Hero from "@/components/hero";
import DigitalHome from "@/components/digital-home";
import RightNow from "@/components/right-now";
import PersonalBento from "@/components/personal-bento";
import Work from "@/components/work";
import Services from "@/components/services";
import About from "@/components/about";
import Contact from "@/components/contact";
import Finale from "@/components/finale";
import { snapshot } from "@/data/about";

export default function Home() {
  return (
    <>
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
