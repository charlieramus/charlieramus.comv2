// Social links — single source of truth (data only; icons live in the component
// layer). Seeded from the current site. CUSTOMIZE handles/links.

export type Social = {
  /** display label */
  label: string;
  href: string;
  /** @handle or username, optional */
  handle?: string;
  /** which account, for the two Instagrams */
  note?: string;
};

export const socials: Social[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/charlie-ramus-776366398/",
  },
  { label: "GitHub", href: "https://github.com/charlieramus", handle: "charlieramus" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/chahramii/",
    handle: "@chahramii",
    note: "photography",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/charlieramus_/",
    handle: "@charlieramus_",
    note: "personal",
  },
  { label: "Letterboxd", href: "https://letterboxd.com/cwramus/", handle: "cwramus" },
];

// CUSTOMIZE: preferred contact for the "Get in touch" CTA.
export const contactEmail = "charlie.ramus12@gmail.com";
