import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { writing } from "@/data/writing";

// Static routes + every essay, driven by the writing manifest so new essays are
// picked up automatically. `next build` emits /sitemap.xml from this.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/web-projects`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/photography`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/writing`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/design`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/gear`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];

  const essays: MetadataRoute.Sitemap = writing.map((w) => ({
    url: `${SITE_URL}/writing/${w.slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...routes, ...essays];
}
