// Bio — the machine-readable half of ABOUT-CHARLIE.md. Reconciled in V2 from the
// current charlieramus.com copy + the newer "About Charlie" dump into one voice:
// dry and precise, letting the specifics carry it (Charlie's call, V2 Stage 1).

// Structured hero/about fields, so V3 can render name/location/roles without
// parsing prose. The hero shows `name`; `roles` feed the about + any chips.
export interface Snapshot {
  name: string;
  location: string;
  roles: string[];
}

// CUSTOMIZE: name is the hero headline (Charlie chose his name over a tagline).
export const snapshot: Snapshot = {
  name: "Charlie Ramus",
  location: "Boulder, Colorado",
  roles: ["Developer", "Designer", "Photographer", "Writer"],
};

// Source for the "Behind the pixels" about section. Newest framing first: the
// solo full-product builder, then the arc that got there, then off the screen.
// CUSTOMIZE: edit copy freely — types don't care how long each paragraph is.
export const aboutParagraphs: string[] = [
  "I'm a high school junior in Boulder and a self-taught developer who builds full products solo — backend architecture, the design system, and the marketing copy in between. I work mostly in Next.js, TypeScript, and Tailwind, with Claude Code as a daily collaborator.",
  "Right now that's Ostiara: a SaaS platform for door-to-door sales teams across home-service verticals like pest control, solar, roofing, and security. Teams and roles run on Clerk Organizations with Supabase row-level security, and the whole thing wears a design system I built for it. I ran customer-discovery interviews to figure out how reps actually quote prices on a doorstep — and found a real split between menu-priced reps and measure-on-site reps that changes what the tool owes each one.",
  "Before Ostiara there were e-commerce stores that never took off but taught me business, and years of building architecture content on Roblox that grew into a global community of builders and passed 300,000+ views. Alongside Ostiara I keep smaller builds moving — VaultDNA, MyLifeInARepo, Querryn, a browser-automation experiment, and this site.",
  "Off the screen I shoot on a Canon EOS R5 (with a photo credit at Boulder Reporting Lab), climb, ski, and ride a Cervelo Aspero on gravel. I read, journal, and get pulled into biotech, entrepreneurship, and the surreal audio fiction of Solar Sands. Lots of ideas still queued — I plan to keep building and sharing the journey.",
];

// SEO <meta> description + any social card. NOT the hero headline (that's the
// name) — this is the one-sentence summary that describes the site. CUSTOMIZE.
export const tagline =
  "Charlie Ramus — a self-taught developer in Boulder building full products solo, from backend to design system to shipped copy.";

// The big serif line that closes the page (finale flower grid). Charlie's thesis,
// in his own framing — echoes the about copy ("backend architecture, the design
// system, and the marketing copy in between"). `\n` marks the line break.
// CUSTOMIZE: swap for any closing line you like; the flowers stay decorative.
export const finaleQuote =
  "The whole thing, built by hand —\nbackend, design, and the words in between.";
