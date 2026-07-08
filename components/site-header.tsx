"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Shared inner-page header: the script wordmark links home (back-to-home), and
// the route links cross-navigate the inner pages. The homepage keeps its own hero
// nav; this is only mounted on the content routes.
const LINKS: { href: string; label: string }[] = [
  { href: "/web-projects", label: "Work" },
  { href: "/design", label: "Design" },
  { href: "/photography", label: "Photography" },
  { href: "/writing", label: "Writing" },
  { href: "/gear", label: "Gear" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Link href="/" className="site-logo">
          charlie ramus
        </Link>
        <nav className="site-nav" aria-label="Site">
          {LINKS.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
