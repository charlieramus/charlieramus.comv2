import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

// Emit /robots.txt as a static file under `output: export`.
export const dynamic = "force-static";

// Allow everything; point crawlers at the sitemap. Nothing on this site is private.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
