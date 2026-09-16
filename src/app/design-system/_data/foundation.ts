// Design foundation values as defined in Figma.
// Must stay in sync with src/app/globals.css (the implementation).

export const figmaSource = {
  fileName: "Nettle – Mega Design File",
  url: "https://www.figma.com/design/G4qCwFQU5OyJGyqjWb1eEe/Nettle---Mega-Design-File?node-id=1-2",
  collectedOn: "16 Sep 2026",
};

export const colorSteps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

export type ColorScale = {
  name: string;
  hex: readonly string[];
};

// Figma variable collection "Colors" (mode: Default)
export const colorScales: ColorScale[] = [
  { name: "brand", hex: ["#FDE2D6", "#FBC5AF", "#F9A987", "#F78C5F", "#F56F37", "#F4530F", "#CB450C", "#A2370A", "#7A2907", "#511B05", "#280D02"] },
  { name: "warm-gray", hex: ["#FFFDFB", "#FFFBF7", "#FFFAF3", "#FFF8EF", "#FFF6EB", "#FFF5E8", "#D4CCC1", "#AAA39A", "#7F7A74", "#55514D", "#2A2826"] },
  { name: "cold-gray", hex: ["#D4D4D6", "#ABAAAE", "#818086", "#57555E", "#2D2B36", "#03010E", "#02000B", "#020009", "#010007", "#010004", "#000002"] },
  { name: "neon-green", hex: ["#E6FFFD", "#CEFFFC", "#B5FFFB", "#9DFFFA", "#84FFF9", "#6CFFF8", "#5AD4CE", "#48AAA5", "#367F7C", "#245552", "#122A29"] },
];

export const colorVariableCount = colorScales.reduce((total, scale) => total + scale.hex.length, 0);

// Page background/text colors are not Figma variables — pending design sign-off.
export const pendingDefaults = [
  { name: "page-background/warm-gray-100", value: "#FFFBF7" },
  { name: "page-text/warm-gray-900", value: "#55514D" },
];

export type FontFamily = {
  name: string;
  cssVariable: string;
  utility: string;
  loader: string;
  usedBy: string;
  weights: { label: string; value: number }[];
};

export const fontFamilies: FontFamily[] = [
  {
    name: "Crimson Pro",
    cssVariable: "--font-heading",
    utility: "font-crimson",
    loader: "next/font/google",
    usedBy: "Heading/*",
    weights: [
      { label: "Light", value: 300 },
      { label: "Regular", value: 400 },
    ],
  },
  {
    name: "Suisse Int'l",
    cssVariable: "--font-body",
    utility: "font-sans",
    loader: "next/font/local",
    usedBy: "Body/*",
    weights: [
      { label: "Regular", value: 400 },
      { label: "Medium", value: 500 },
    ],
  },  {
    name: "La Belle Aurore",
    cssVariable: "--font-handwritten",
    utility: "font-handwritten",
    loader: "next/font/google",
    usedBy: "Hero handwritten accent notes (detached text, no Figma style)",
    weights: [{ label: "Regular", value: 400 }],
  },
];

export type TextStyle = {
  figma: string;
  className: string;
  family: "crimson" | "suisse";
  weightLabel: string;
  weight: number;
  size: number;
  lineHeight: number; // Figma %
  letterSpacing: number; // Figma %
};

// Figma local text styles
export const textStyles: TextStyle[] = [
  { figma: "Heading/H1", className: "text-heading-h1", family: "crimson", weightLabel: "Light", weight: 300, size: 64, lineHeight: 100, letterSpacing: -1 },
  { figma: "Heading/H2", className: "text-heading-h2", family: "crimson", weightLabel: "Light", weight: 300, size: 56, lineHeight: 100, letterSpacing: -2 },
  { figma: "Heading/H3", className: "text-heading-h3", family: "crimson", weightLabel: "Light", weight: 300, size: 52, lineHeight: 100, letterSpacing: -1 },
  { figma: "Heading/H4", className: "text-heading-h4", family: "crimson", weightLabel: "Light", weight: 300, size: 48, lineHeight: 100, letterSpacing: -1 },
  { figma: "Heading/H5", className: "text-heading-h5", family: "crimson", weightLabel: "Regular", weight: 400, size: 32, lineHeight: 100, letterSpacing: 0 },
  { figma: "Heading/H6", className: "text-heading-h6", family: "crimson", weightLabel: "Regular", weight: 400, size: 24, lineHeight: 100, letterSpacing: 0 },
  { figma: "Body/Large/Regular", className: "text-body-large-regular", family: "suisse", weightLabel: "Regular", weight: 400, size: 18, lineHeight: 110, letterSpacing: 0 },
  { figma: "Body/Large/Medium", className: "text-body-large-medium", family: "suisse", weightLabel: "Medium", weight: 500, size: 18, lineHeight: 110, letterSpacing: 0 },
  { figma: "Body/Medium/Regular", className: "text-body-medium-regular", family: "suisse", weightLabel: "Regular", weight: 400, size: 16, lineHeight: 140, letterSpacing: 0 },
  { figma: "Body/Medium/Medium", className: "text-body-medium-medium", family: "suisse", weightLabel: "Medium", weight: 500, size: 16, lineHeight: 140, letterSpacing: 0 },
  { figma: "Body/Small/Regular", className: "text-body-small-regular", family: "suisse", weightLabel: "Regular", weight: 400, size: 14, lineHeight: 140, letterSpacing: 1 },
  { figma: "Body/Small/Medium", className: "text-body-small-medium", family: "suisse", weightLabel: "Medium", weight: 500, size: 14, lineHeight: 140, letterSpacing: 1 },
];

export const fontWeightRows = [
  { family: "Crimson Pro Light", weight: 300 },
  { family: "Crimson Pro Regular", weight: 400 },
  { family: "Suisse Int'l Regular", weight: 400 },
  { family: "Suisse Int'l Medium", weight: 500 },
];

export type ReviewNote = {
  title: string;
  detail: string;
};

export const openQuestions: ReviewNote[] = [
  {
    title: "Page background and text color",
    detail:
      "No Figma variable defines them. The site currently uses warm-gray/100 (background) and warm-gray/900 (text), the most-used bound variables in the latest frames.",
  },
  {
    title: "Semantic color tokens",
    detail: "The Colors collection holds primitives only. Roles such as background, text, border and accent are not defined yet.",
  },
  {
    title: "Responsive typography",
    detail: "Figma has desktop text styles only. Mobile and tablet sizes need to be defined before responsive layouts are built.",
  },
  {
    title: "Display, label and caption styles",
    detail: "None exist in Figma, so none are implemented. Confirm whether the site needs them.",
  },  {
    title: "Handwritten accent style",
    detail:
      "The Hero's handwritten notes use La Belle Aurore 16px / 120% / −2% as detached text. It is implemented centrally as text-handwritten; confirm whether it should become a Figma text style.",
  },
];

export const figmaInconsistencies: ReviewNote[] = [
  { title: "neon-green is cyan", detail: "The scale's values are cyan/aqua rather than green, e.g. neon-green/500 is #6CFFF8." },
  { title: "cold-gray 500–950 are nearly identical", detail: "All six steps are near-black, from #03010E to #000002." },
  { title: "warm-gray 50–500 are nearly identical", detail: "Six near-white steps (#FFFDFB → #FFF5E8), then 600 jumps to #D4CCC1." },
  { title: "H2 tracking is an outlier", detail: "H2 uses −2% letter spacing; every other heading (H1, H3, H4) uses −1%. Line height was normalized to 100% across all headings on 16 Sep 2026." },
  { title: "Body/Large line height", detail: "Body/Large uses 110% while Body/Medium and Body/Small use 140%. Body/Small also adds +1% tracking." },
  { title: "Detached text in frames", detail: "About 9,100 text runs aren't linked to a style, e.g. Suisse Int'l 16px / 120% (214×) and Crimson Pro Light 56px / −1.5% (15×)." },
  { title: "External UI kit styles", detail: "“Text sm/Medium” and “Display md/Semibold” (Plus Jakarta Sans) appear on canvas but aren't part of the Nettle system." },
  { title: "Hero product mockup colors", detail: "The Hero dashboard mockup uses raw fills with no variable: #FAFAFA (sidebar, accent squares), #FFEBEB / #FF0000 and #FEF1EB (risk badges), #F0F0FF / #6868A8 (status badges), #002F87 (team mark). They are kept as illustration-only values inside the mockup component." },
  { title: "Unbound raw colors", detail: "Frames use raw hex fills such as #FFFFFF, #D9D9D9 and #F56F37 (brand/400's value) instead of variables." },
  { title: "Font family naming", detail: "Both “Suisse Intl” and “Suisse Int'l” are used as family names." },
  { title: "Variable scopes", detail: "All 44 color variables use ALL_SCOPES, so they appear in every property picker." },
];

export function formatPercent(value: number) {
  if (value === 0) return "0%";
  return `${value > 0 ? "+" : "−"}${Math.abs(value)}%`;
}
