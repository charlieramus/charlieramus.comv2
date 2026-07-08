import type { MDXComponents } from "mdx/types";

// Required by @next/mdx (App Router). The essay prose is styled globally via the
// `.writing-prose` wrapper in app/globals.css (design-system serif headings,
// reading measure, footnote/acknowledgment blocks), so element-level overrides
// aren't needed here — the MDX maps straight to semantic HTML. Kept as the
// documented empty map; per-element components can be added later if a body ever
// needs a custom component (e.g. an inline chart).
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
