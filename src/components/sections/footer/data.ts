type FooterLink = { label: string; href: string };
type FooterLinkGroup = { id: string; title: string; links: FooterLink[] };

// Figma supplies labels, but no destinations. Follow the existing placeholder
// convention until approved routes are provided; retain Figma's spelling.
export const footerLinkGroups: FooterLinkGroup[] = [
  {
    id: "products",
    title: "Products",
    links: [
      { label: "Smart Triage", href: "#" },
      { label: "AI-assisted surveys", href: "#" },
      { label: "Account management", href: "#" },
      { label: "Team analytics", href: "#" },
      { label: "Loss prevention", href: "#" },
    ],
  },
  {
    id: "solutions",
    title: "Solutions",
    links: [
      { label: "Line of Business", href: "#" },
      { label: "Risk Engineer", href: "#" },
      { label: "Underwritting Leader", href: "#" },
      { label: "Loss Control Leader", href: "#" },
      { label: "Operations Leader", href: "#" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "News", href: "#" },
      { label: "Reports & Guides", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "Careers", href: "#" },
      { label: "About", href: "#" },
    ],
  },
];

export const footerLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];
