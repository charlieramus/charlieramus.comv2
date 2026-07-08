import { socials, contactEmail } from "@/data/socials";
import { snapshot } from "@/data/about";

// Shared inner-page footer: a compact "Get in touch" CTA + the socials row +
// the legal line. Reuses the same data as the homepage contact section, without
// duplicating its full red card.
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <div className="site-footer-cta">
          <span className="site-footer-vibe">Think we vibe?</span>
          <a className="btn" href={`mailto:${contactEmail}`}>
            Get in touch
          </a>
        </div>

        <nav className="site-footer-socials" aria-label="Social links">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label}
              {s.note ? ` (${s.note})` : ""}
            </a>
          ))}
        </nav>

        <p className="site-footer-legal">
          © {year} {snapshot.name} · {snapshot.location}
        </p>
      </div>
    </footer>
  );
}
