import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Let .md / .mdx files act as pages/imports alongside the TS/JS routes.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // /blog was dropped (V2 addendum): writing is unified under /writing. Nothing
  // in-app links to /blog, but redirect any external/bookmarked link so it resolves.
  async redirects() {
    return [{ source: "/blog", destination: "/writing", permanent: true }];
  },
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
