import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";

const nextConfig: NextConfig = {
  // Static export → a plain out/ folder of HTML/CSS/JS for Cloudflare Pages
  // (V7). Every route in this app is already static/SSG, so no server runtime is
  // needed. See UPDATELOGV7 Stage 1.
  output: "export",
  images: {
    // The default next/image optimizer needs a server and is unsupported under
    // `output: export`. The gallery already ships pre-sized WebP + blurDataURL,
    // so serve the files as-is (no on-the-fly optimization).
    unoptimized: true,
  },
  // Pin the workspace root to this project so Turbopack stops inferring it from
  // the stray C:\Users\jason lockfile (silences the multi-lockfile build warning).
  turbopack: { root: path.join(__dirname) },
  // Let .md / .mdx files act as pages/imports alongside the TS/JS routes.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // NOTE: the /blog → /writing redirect moved to Cloudflare's `_redirects`
  // (public/_redirects) in V7 Stage 2 — next.config `redirects()` is a no-op
  // under `output: export`.
};

// @next/mdx doesn't parse YAML frontmatter on its own. remark-frontmatter strips
// the leading `---` block out of the rendered body; remark-mdx-frontmatter then
// re-exposes it as a named `frontmatter` export the route can read. Plugins are
// passed as STRINGS (not imported functions) because Next 16 builds with
// Turbopack, which can only receive serializable plugin references.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
  },
});

export default withMDX(nextConfig);
