// Grid foundation values as defined in Figma.
// Must stay in sync with the :root grid tokens in src/app/globals.css.

export const gridSkill = {
  name: "Müller-Brockmann Grid Systems",
  url: "https://github.com/alex-hyperagent/hyperagent-public-skills/blob/main/skill-muller-brockmann-grid-systems.json",
};

export type GridConfig = {
  label: string;
  values: { name: string; value: string }[];
  note?: string;
};

// Confirmed from Figma: every "Hero" / "Hero - Option N" frame in the file
// carries the identical COLUMNS layout grid (desktop, 1440px canvas).
export const desktopGrid: GridConfig = {
  label: "Desktop (1440px canvas)",
  values: [
    { name: "Columns", value: "12" },
    { name: "Gutter", value: "16px" },
    { name: "Margin", value: "32px" },
    { name: "Content width", value: "1376px  (1440 − 2 × 32)" },
    { name: "Baseline", value: "not a Figma value — see below" },
  ],
};

export const undefinedGrids: { label: string; note: string }[] = [
  { label: "Tablet", note: "No layout grid found on any tablet-width frame in Figma." },
  { label: "Mobile", note: "No layout grid found on any mobile-width frame in Figma." },
];

export const baselineNote =
  "Figma defines no baseline or row grid — only the 12-column layout grid above. 8px is adopted here as a general-purpose layout spacing/QA unit (most heading line-heights land on or near multiples of it), per the Müller-Brockmann skill's methodology. Approved Figma typography line-heights are NOT retrofitted to this baseline — see the mismatches below.";

export const baselineMismatches: { style: string; lineHeightPx: string; multipleOf8: boolean }[] = [
  { style: "Heading/H1 — 64px / 100%", lineHeightPx: "64px", multipleOf8: true },
  { style: "Heading/H2 — 56px / 100%", lineHeightPx: "56px", multipleOf8: true },
  { style: "Heading/H3 — 52px / 100%", lineHeightPx: "52px", multipleOf8: false },
  { style: "Heading/H4 — 48px / 100%", lineHeightPx: "48px", multipleOf8: true },
  { style: "Heading/H5 — 32px / 100%", lineHeightPx: "32px", multipleOf8: true },
  { style: "Heading/H6 — 24px / 100%", lineHeightPx: "24px", multipleOf8: true },
  { style: "Body/Large — 18px / 110%", lineHeightPx: "19.8px", multipleOf8: false },
  { style: "Body/Medium — 16px / 140%", lineHeightPx: "22.4px", multipleOf8: false },
  { style: "Body/Small — 14px / 140%", lineHeightPx: "19.6px", multipleOf8: false },
];

export type DocSection = {
  title: string;
  body: string[];
};

export const docSections: DocSection[] = [
  {
    title: "1. Grid skill",
    body: [
      "Grid implementation follows the Müller-Brockmann Grid Systems skill (see the link above) — grid engineering only, not its Swiss visual art direction.",
    ],
  },
  {
    title: "2. Purpose",
    body: [
      "The grid provides the structural foundation used when translating Figma layouts into frontend implementation: a single source of truth for columns, gutters and margins, shared by real content and its verification overlay.",
    ],
  },
  {
    title: "4. Single source of truth",
    body: [
      "Every grid parameter lives in :root CSS variables in src/app/globals.css (--grid-columns, --grid-gutter, --grid-margin, --grid-max-width, --grid-baseline).",
      "Content (Container / Grid / GridBand) and the GridOverlay both read these exact same variables — the overlay is never hand-authored separately, so it cannot drift from real content.",
    ],
  },
  {
    title: "5. Content box rule",
    body: [
      "The grid overlay and page content must always share the same content box. <GridOverlay> is rendered inside the same <Container> as the content it checks — never as an independent full-width sibling of a centered max-width container.",
    ],
  },
  {
    title: "6. Full-width sections",
    body: [
      "A section's background may span the full viewport. Its functional content still follows the main grid (wrapped in <Container>) unless Figma explicitly shows an exception.",
    ],
  },
  {
    title: "7. Column placement",
    body: [
      "Structural layouts map to grid columns (col-span-*, col-start-*/col-end-*, or a <GridBand> subgrid child) before reaching for a custom width or horizontal offset.",
    ],
  },
  {
    title: "8. Intentional grid breaking",
    body: [
      "Decorative visual elements — oversized imagery, editorial illustrations, texture, linework, parallax assets — may escape the grid when the design calls for it. Their primary anchor should still originate from a grid column where possible.",
    ],
  },
  {
    title: "9. Anti-patterns",
    body: [
      "Avoid arbitrary horizontal margin (ml-[73px]).",
      "Avoid arbitrary translateX (translate-x-[18px]).",
      "Avoid unrelated max-width values (max-w-[817px]) — use --grid-max-width.",
      "Avoid section-specific containers without design evidence.",
      "Avoid manually recreating the overlay outside GridOverlay.",
      "Avoid eyeballing column positions — place by column line.",
    ],
  },
  {
    title: "10. Grid QA",
    body: [
      "Figma → enable the grid overlay (?grid=true) → compare the container → compare column lines → compare gutters → compare element anchors → correct the structural layout → optical polish last.",
    ],
  },
];
