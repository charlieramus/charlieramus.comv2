"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Shared inner-page header: just the cross-nav that navigates between the inner
// pages (the script wordmark was removed in V6 — see UPDATELOGV6 Stage 1). The
// homepage keeps its own hero nav; this is only mounted on the content routes.
const LINKS: { href: string; label: string }[] = [
  { href: "/web-projects", label: "Projects" },
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
                // No RSC prefetch: under `output: export` the segment payloads
                // (__next.<route>.__PAGE__.txt) aren't emitted at the prefetched
                // path, so prefetch 404s. Full-page nav still works.
                prefetch={false}
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
