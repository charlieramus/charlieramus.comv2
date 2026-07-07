import Hero from "@/components/hero";
import DigitalHome from "@/components/digital-home";
import PersonalBento from "@/components/personal-bento";
import Work from "@/components/work";
import Services from "@/components/services";
import About from "@/components/about";
import Contact from "@/components/contact";
import Finale from "@/components/finale";

export default function Home() {
  return (
    <>
      <Hero />
      <DigitalHome />
      <PersonalBento />
      <Work />
      <Services />
      <About />
      <Contact />
      <Finale />
      {/* CUSTOMIZE: legal line */}
      <div className="legal-min">
        © 2026 — placeholder content · homepage rebuilt from the mockup
      </div>
    </>
  );
}
