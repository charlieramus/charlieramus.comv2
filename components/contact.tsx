import Reveal from "@/components/reveal";
import { socials, contactEmail } from "@/data/socials";

// Pills = the real social links (data/socials.ts). The two Instagrams are
// disambiguated by their `note` so the row doesn't read "Instagram" twice.
const PILLS = socials.map((s) => ({
  label: s.note ? `${s.label} (${s.note})` : s.label,
  href: s.href,
}));

export default function Contact() {
  return (
    <section className="contact">
      <div className="wrap">
        {/* The whole red card is the "Get in touch" CTA → mailto:contactEmail */}
        <Reveal as="a" className="box" href={`mailto:${contactEmail}`}>
          <div className="peace">
            <svg
              viewBox="0 0 40 48"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 27 L10.5 13 a2.4 2.4 0 0 1 4.8 -0.6 L17 25" />
              <path d="M17 25 L17 10 a2.4 2.4 0 0 1 4.8 0 L22 26" />
              <path d="M22 26 L24 18.5 a2.3 2.3 0 0 1 4.5 1.1 L27 30" />
              <path d="M13 27 c-4.2 2 -5.2 6.2 -3.2 11 2 4.8 6 7.6 11.7 7.6 6.7 0 10.5 -4.6 10.5 -11.4" />
            </svg>
          </div>
          <div className="vibe">Looking to reach me?</div>
          <div className="huge">Get in touch</div>
        </Reveal>

        <Reveal className="pills">
          {PILLS.map((pill) => (
            <a
              key={pill.label}
              href={pill.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pill.label}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
