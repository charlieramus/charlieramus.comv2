// Ambient types for MDX imports. @types/mdx only declares `mdx/types`; it doesn't
// type the default component or the `frontmatter` export that remark-mdx-frontmatter
// injects (see next.config.ts). This declares both so `/writing/[slug]` can read a
// typed frontmatter object from `import("@/content/writing/<slug>.mdx")`.
declare module "*.mdx" {
  import type { ComponentType } from "react";

  /** The essay frontmatter contract — mirrors data/writing.ts + the MDX headers. */
  export const frontmatter: {
    title: string;
    date: string;
    author: string;
    /** "" = no header image (rendered from Stage 4 onward). */
    headerImage: string;
    /** "" = no external-link button. */
    externalLink: string;
    externalLinkLabel: string;
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
