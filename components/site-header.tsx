"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Shared inner-page header: just the cross-nav that navigates between the inner
// pages (the script wordmark was removed in V6 — see UPDATELOGV6 Stage 1). The
// homepage keeps its own hero nav; this is only mounted on the content routes.
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
