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
  family: "crimson" | "suisse" | "handwritten";
  weightLabel: string;
  weight: number;
  size: number; // Original desktop/Figma maximum, in px at the default root.
  minSize: number;
  scaling: "fluid" | "fixed";
  lineHeight: number; // Figma %
  letterSpacing: number; // Figma %
};

// Figma local text styles
export const textStyles: TextStyle[] = [
  { figma: "Heading/H1", className: "text-heading-h1", family: "crimson", weightLabel: "Light", weight: 300, size: 64, minSize: 40, scaling: "fluid", lineHeight: 100, letterSpacing: -1 },
  { figma: "Heading/H2", className: "text-heading-h2", family: "crimson", weightLabel: "Light", weight: 300, size: 56, minSize: 34, scaling: "fluid", lineHeight: 100, letterSpacing: -2 },
  { figma: "Heading/H3", className: "text-heading-h3", family: "crimson", weightLabel: "Light", weight: 300, size: 52, minSize: 32, scaling: "fluid", lineHeight: 100, letterSpacing: -1 },
  { figma: "Heading/H4", className: "text-heading-h4", family: "crimson", weightLabel: "Light", weight: 300, size: 48, minSize: 30, scaling: "fluid", lineHeight: 100, letterSpacing: -1 },
  { figma: "Heading/H5", className: "text-heading-h5", family: "crimson", weightLabel: "Regular", weight: 400, size: 32, minSize: 22, scaling: "fluid", lineHeight: 110, letterSpacing: 0 },
  { figma: "Heading/H6", className: "text-heading-h6", family: "crimson", weightLabel: "Regular", weight: 400, size: 24, minSize: 20, scaling: "fluid", lineHeight: 100, letterSpacing: 0 },
  { figma: "Body/Large/Regular", className: "text-body-large-regular", family: "suisse", weightLabel: "Regular", weight: 400, size: 18, minSize: 15, scaling: "fluid", lineHeight: 110, letterSpacing: 0 },
  { figma: "Body/Large/Medium", className: "text-body-large-medium", family: "suisse", weightLabel: "Medium", weight: 500, size: 18, minSize: 15, scaling: "fluid", lineHeight: 110, letterSpacing: 0 },
  { figma: "Body/Medium/Regular", className: "text-body-medium-regular", family: "suisse", weightLabel: "Regular", weight: 400, size: 16, minSize: 14, scaling: "fluid", lineHeight: 140, letterSpacing: 0 },
  { figma: "Body/Medium/Medium", className: "text-body-medium-medium", family: "suisse", weightLabel: "Medium", weight: 500, size: 16, minSize: 14, scaling: "fluid", lineHeight: 140, letterSpacing: 0 },
  { figma: "Body/Small/Regular", className: "text-body-small-regular", family: "suisse", weightLabel: "Regular", weight: 400, size: 14, minSize: 14, scaling: "fixed", lineHeight: 140, letterSpacing: 1 },
  { figma: "Body/Small/Medium", className: "text-body-small-medium", family: "suisse", weightLabel: "Medium", weight: 500, size: 14, minSize: 14, scaling: "fixed", lineHeight: 140, letterSpacing: 1 },
];

// Detached treatments already approved in the homepage, not new Figma styles.
export const supplementaryTextStyles: TextStyle[] = [
  { figma: "Compact card heading (approved CTA mobile)", className: "text-heading-card", family: "crimson", weightLabel: "Regular", weight: 400, size: 32, minSize: 28, scaling: "fluid", lineHeight: 100, letterSpacing: 0 },
  { figma: "Display statement (approved detached)", className: "text-display-statement", family: "crimson", weightLabel: "Light", weight: 300, size: 54, minSize: 32, scaling: "fluid", lineHeight: 110, letterSpacing: -2 },
  { figma: "Handwritten accent (approved detached)", className: "text-handwritten", family: "handwritten", weightLabel: "Regular", weight: 400, size: 16, minSize: 16, scaling: "fixed", lineHeight: 120, letterSpacing: -2 },
];

export const typographyStyles = [...textStyles, ...supplementaryTextStyles];

// Documentation mirror only; the rendering implementation lives in globals.css.
export const responsiveTypography = {
  minViewport: 390,
  maxViewport: 1440,
  defaultRootSize: 16,
  sourceUrl: "https://www.figma.com/design/G4qCwFQU5OyJGyqjWb1eEe/Nettle---Mega-Design-File?node-id=440-3509",
  referenceUrl: "https://www.harvey.ai/",
  manualWidths: [390, 768, 1024, 1280, 1440],
} as const;

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
    detail: "Figma supplies desktop maxima. The user-approved Balanced scale interpolates from 390 to 1440px at the default root size. The latest user refinement reduces large mobile headings by 4px and smaller headings/body copy by 2px. H5 now starts at 22px (Figma mobile was 24px); compact CTA heading starts at 28px (Figma mobile was 32px). Hero H1 and its 16px supporting copy are unchanged. Body Small/UI remain 14px. Responsive visual QA remains manual.",
  },
  {
    title: "Display, label and caption styles",
    detail: "No named display, label or caption styles exist in Figma. The approved detached 54px Challenge statement is centralized as text-display-statement; labels continue using existing body roles.",
  },  {
    title: "Handwritten accent style",
    detail:
      "The Hero's handwritten notes use La Belle Aurore 16px / 120% / −2% as detached text. It is implemented centrally as text-handwritten; confirm whether it should become a Figma text style.",
  },
];

export const figmaInconsistencies: ReviewNote[] = [
  { title: "Security badge outer-circle correction", detail: "The three security badges retain black at 2% opacity on their outer circles. The exported outer inner-shadow filter was replaced with an explicit 0.6px inset white/10% border because its alpha amplification brightened the translucent ring. Inner-circle fill, inner border and icon/text paths are unchanged." },
  { title: "Footer source resolution and responsive inference", detail: "Footer (415:4735) uses a single flattened PNG at 415:4771, including the outlined Nettle logo. The original is only 1440 × 562 (SHA-1 06fa881f51d2b0ffbe8c22e8b6f0933fc18f66c3); the downloaded file matches exactly. It is served unoptimized, lazy-loaded, with its native aspect ratio, and displayed full viewport width as explicitly requested. A higher-resolution original is still needed for sharp 1920px/Retina presentation; the source file has not been upscaled or re-encoded. No responsive frames or link destinations are supplied: the tagline stacks below lg, navigation groups and the legal row stack below sm, and the complete artwork is retained at smaller widths. Links remain #. The approved spelling ‘Underwritting Leader’ and fixed 2026 copyright are preserved. Detached legal text reuses Body/Small/Regular with local 120% line height and zero tracking; no shared typography token changes. Visual QA is manual." },
  { title: "CTA mobile card and typography", detail: "Desktop CTA 415:4669 retains Heading/H3 and its existing grid placement. Mobile card 440:4680 is 370 × 527 with a centered 312px text measure, 32px content gap, and distinct corner artwork. Its Figma H5 still uses the original 32px Regular / 100% leading / zero-tracking treatment, unlike the updated Testimonial H5 / 110%. Shared text-heading-card records this compact treatment without changing H5 leading; the subsequent user-requested mobile reduction makes its scale 28–32px. The mobile variant applies below an inferred 768px breakpoint; the panel may grow for enlarged content, while art stays anchored to its corners at native scale. Existing brand/600, white, warm-gray tokens and the light Button are reused. Photos and texture are byte-identical to existing assets; masks are reused and visible line SVGs exported from Figma. The 1376 × 527 texture is cropped on mobile, not resized to fit. Content/CTA remain live. The button destination remains #. Visual QA is manual." },
  { title: "Security card artwork and layout", detail: "Security (415:4576) uses an unbound #0F0F0F card fill, retained locally, and #161616 badge interiors / #1F1F1F linework retained in the exact exported SVGs. The ten-column card row has an approved 17px gap rather than the global 16px gutter; the shared grid is unchanged. Header text boxes are 597px and 388px within the shared grid span. Typography reuses Heading/H3, Body/Large/Medium and Body/Medium/Regular. No responsive variants or Security overview destination are supplied in the approved Dev Area. Responsive stacking is inferred; browser visual QA is reserved for the user." },
  { title: "Solutions by Role card fill and copy", detail: "Solutions by Role (415:4188) uses an unbound #181515 card fill, kept locally in RoleCard rather than promoted to a shared token. The approved title reads ‘For Underwritting Leaders’ and is preserved verbatim. Learn more links have no supplied destination. No responsive variants are available in the approved Dev Area." },
  { title: "neon-green is cyan", detail: "The scale's values are cyan/aqua rather than green, e.g. neon-green/500 is #6CFFF8." },
  { title: "cold-gray 500–950 are nearly identical", detail: "All six steps are near-black, from #03010E to #000002." },
  { title: "warm-gray 50–500 are nearly identical", detail: "Six near-white steps (#FFFDFB → #FFF5E8), then 600 jumps to #D4CCC1." },
  { title: "H2 tracking is an outlier", detail: "H2 uses −2% letter spacing; every other light heading (H1, H3, H4) uses −1%. Headings use 100% line height except H5, updated to the approved Testimonial's 110% on 17 Sep 2026." },
  { title: "Testimonial typography and artwork", detail: "Testimonial desktop 415:4223 confirms H5: Crimson Pro Regular, 32px, 110% line height, zero tracking. Mobile 440:4548 confirms 24px quotes, 340 × 406 cards, 20px insets, smaller logos, distinct artwork crops and no CTA. Shared H5 now scales 22–32px after the subsequent user-requested mobile reduction; its Figma mobile source remains 24px. Quotes remain live and cards can grow for enlarged text. Below 768px, card width retains the shared next-card peek and caps at 340px; this breakpoint is inferred. Separate mobile artwork components reuse the original photos/masks and approved mobile linework SVGs. Allianz underlines follow wrapped emphasis rather than fixed Figma text coordinates; Brotherhood has no mobile underline. Decorative photo overlays use unbound #F4713A and #979797 locally. Desktop CTAs reuse Body/Small/Medium (140%). No attribution names or case-study destinations are supplied." },
  { title: "Body/Large line height", detail: "Body/Large uses 110% while Body/Medium and Body/Small use 140%. Body/Small also adds +1% tracking." },
  { title: "Detached text in frames", detail: "About 9,100 text runs aren't linked to a style, e.g. Suisse Int'l 16px / 120% (214×) and Crimson Pro Light 56px / −1.5% (15×)." },
  { title: "External UI kit styles", detail: "“Text sm/Medium” and “Display md/Semibold” (Plus Jakarta Sans) appear on canvas but aren't part of the Nettle system." },
  { title: "Hero product mockup colors", detail: "The Hero dashboard mockup uses raw fills with no variable: #FAFAFA (sidebar, accent squares), #FFEBEB / #FF0000 and #FEF1EB (risk badges), #F0F0FF / #6868A8 (status badges), #002F87 (team mark). They are kept as illustration-only values inside the mockup component." },
  { title: "Features and business-line illustration colors", detail: "Features (409:3712) uses unbound UI colors #FEF1EC, #FFF8F5, #EBFFEB / #008000 and #E59761, alongside the existing raw risk badge colors. Business-line artwork (409:3967) uses unbound #D1CFCC linework. These remain local to the approved illustrations; no shared tokens were added." },
  { title: "Unbound raw colors", detail: "Frames use raw hex fills such as #FFFFFF, #D9D9D9 and #F56F37 (brand/400's value) instead of variables." },
  { title: "Font family naming", detail: "Both “Suisse Intl” and “Suisse Int'l” are used as family names." },
  { title: "Variable scopes", detail: "All 44 color variables use ALL_SCOPES, so they appear in every property picker." },
];

export function formatPercent(value: number) {
  if (value === 0) return "0%";
  return `${value > 0 ? "+" : "−"}${Math.abs(value)}%`;
}
