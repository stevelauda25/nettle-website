// Documentation mirror only. CSS in globals.css is the source of truth.
export type SpacingToken = {
  name: `--space-${string}`;
  label: string;
  min: number;
  max: number;
  scaling: "fixed" | "fluid";
  usage: string;
  provenance: string;
  aliasOf?: `--space-${string}`;
};

export const responsiveSpacing = {
  minViewport: 390,
  maxViewport: 1440,
  defaultRootSize: 16,
  referenceUrl: "https://www.harvey.ai/",
  source: "User-approved Responsive Spacing Foundation — Balanced plan; existing Figma-derived desktop implementation and subsequent spacing approvals.",
  manualWidths: [390, 768, 1024, 1280, 1440],
} as const;

export const spacingTokens: readonly SpacingToken[] = [
  {
    "name": "--space-micro-gap",
    "label": "Micro gap",
    "min": 4,
    "max": 4,
    "scaling": "fixed",
    "usage": "Small decorative separations.",
    "provenance": "Existing fixed implementation; retained in the approved Balanced plan."
  },
  {
    "name": "--space-tight-gap",
    "label": "Tight gap",
    "min": 8,
    "max": 8,
    "scaling": "fixed",
    "usage": "Metric value to label; compact content.",
    "provenance": "Existing fixed implementation; retained in the approved Balanced plan."
  },
  {
    "name": "--space-related-gap",
    "label": "Related-item gap",
    "min": 12,
    "max": 12,
    "scaling": "fixed",
    "usage": "Related card title/body and content items.",
    "provenance": "Existing fixed implementation; retained in the approved Balanced plan."
  },
  {
    "name": "--space-heading-gap",
    "label": "Heading → description",
    "min": 12,
    "max": 16,
    "scaling": "fluid",
    "usage": "Related text blocks.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-component-gap",
    "label": "Component gap",
    "min": 16,
    "max": 24,
    "scaling": "fluid",
    "usage": "Header/control groups and small content groups.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-content-gap",
    "label": "Content/action-group gap",
    "min": 24,
    "max": 32,
    "scaling": "fluid",
    "usage": "Description/CTA and quote/action groups.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-content-block-gap",
    "label": "Content-block gap",
    "min": 24,
    "max": 48,
    "scaling": "fluid",
    "usage": "Footer groups and larger grouped content.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-major-content-gap",
    "label": "Major content gap",
    "min": 32,
    "max": 64,
    "scaling": "fluid",
    "usage": "Metrics heading/cards and footer legal separation.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-visual-gap",
    "label": "Content → large visual",
    "min": 40,
    "max": 80,
    "scaling": "fluid",
    "usage": "Hero content to dashboard.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-page-inline",
    "label": "Page inline padding",
    "min": 16,
    "max": 32,
    "scaling": "fluid",
    "usage": "Shared Container, overlay and carousel page edges.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-card-padding",
    "label": "Standard card padding",
    "min": 20,
    "max": 24,
    "scaling": "fluid",
    "usage": "Feature, business-line, metric and Security text insets.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-card-padding-spacious",
    "label": "Spacious card padding",
    "min": 24,
    "max": 32,
    "scaling": "fluid",
    "usage": "Role and testimonial cards.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation.",
    "aliasOf": "--space-content-gap"
  },
  {
    "name": "--space-card-leading",
    "label": "Spacious card leading inset",
    "min": 46,
    "max": 56,
    "scaling": "fluid",
    "usage": "Key Metrics leading card padding.",
    "provenance": "User-requested mobile top padding increased to 46px; approved desktop 56px retained."
  },
  {
    "name": "--space-section-content-gap",
    "label": "Section heading → cards",
    "min": 24,
    "max": 46,
    "scaling": "fluid",
    "usage": "Carousel, Solutions and Security content separation.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-standard",
    "label": "Standard section padding",
    "min": 48,
    "max": 120,
    "scaling": "fluid",
    "usage": "Solutions by Role and Footer top.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-generous",
    "label": "Generous section padding",
    "min": 64,
    "max": 160,
    "scaling": "fluid",
    "usage": "Security and CTA top.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-prominent",
    "label": "Prominent section padding",
    "min": 64,
    "max": 180,
    "scaling": "fluid",
    "usage": "Testimonial top/bottom.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-major",
    "label": "Major section padding",
    "min": 64,
    "max": 200,
    "scaling": "fluid",
    "usage": "Key Metrics bottom, Features top, One Workspace bottom.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-adjoining",
    "label": "Adjoining section padding",
    "min": 32,
    "max": 90,
    "scaling": "fluid",
    "usage": "Features bottom and One Workspace top; count both sides.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-media",
    "label": "Media section padding",
    "min": 32,
    "max": 120,
    "scaling": "fluid",
    "usage": "Static Video top/bottom and Key Metrics top.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-opening-start",
    "label": "Opening section start",
    "min": 48,
    "max": 98,
    "scaling": "fluid",
    "usage": "Hero top from md; retains the approved desktop header allowance.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-opening-end",
    "label": "Opening section end",
    "min": 32,
    "max": 60,
    "scaling": "fluid",
    "usage": "Hero bottom, and symmetric mobile vertical padding inside its centered viewport-minus-header minimum height.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation."
  },
  {
    "name": "--space-section-flush",
    "label": "Flush section padding",
    "min": 16,
    "max": 32,
    "scaling": "fluid",
    "usage": "CTA bottom.",
    "provenance": "Balanced mobile minimum approved by the user; maximum retained from the existing implementation.",
    "aliasOf": "--space-page-inline"
  }
];

export const sectionSpacing: readonly {
  label: string;
  file: string;
  top: SpacingToken["name"];
  bottom: SpacingToken["name"] | null;
}[] = [
  {
    "label": "Hero",
    "file": "src/components/sections/hero/hero.tsx",
    "top": "--space-section-opening-start",
    "bottom": "--space-section-opening-end"
  },
  {
    "label": "Video (static)",
    "file": "src/components/sections/video-explainer/video-explainer.tsx",
    "top": "--space-section-media",
    "bottom": "--space-section-media"
  },
  {
    "label": "Key Metrics",
    "file": "src/components/sections/key-metrics/key-metrics.tsx",
    "top": "--space-section-media",
    "bottom": "--space-section-major"
  },
  {
    "label": "Features",
    "file": "src/components/sections/features/features.tsx",
    "top": "--space-section-major",
    "bottom": "--space-section-adjoining"
  },
  {
    "label": "One Workspace",
    "file": "src/components/sections/business-lines/business-lines.tsx",
    "top": "--space-section-adjoining",
    "bottom": "--space-section-major"
  },
  {
    "label": "Solutions by Role",
    "file": "src/components/sections/solutions-by-role/solutions-by-role.tsx",
    "top": "--space-section-standard",
    "bottom": "--space-section-standard"
  },
  {
    "label": "Testimonial",
    "file": "src/components/sections/testimonial/testimonial.tsx",
    "top": "--space-section-prominent",
    "bottom": "--space-section-prominent"
  },
  {
    "label": "Security",
    "file": "src/components/sections/security/security.tsx",
    "top": "--space-section-generous",
    "bottom": "--space-section-generous"
  },
  {
    "label": "CTA",
    "file": "src/components/sections/cta/cta.tsx",
    "top": "--space-section-generous",
    "bottom": "--space-section-flush"
  },
  {
    "label": "Footer",
    "file": "src/components/sections/footer/footer.tsx",
    "top": "--space-section-standard",
    "bottom": null
  }
];

export const spacingAudit = [
  "Page gutters were 16px below md and 32px above, creating a step at 768px. They now scale continuously through the shared grid-margin token.",
  "Outer section padding ranged from 16–64px on mobile and 32–200px on desktop. Separate top/bottom roles retain intentional asymmetry and count adjoining padding on both sections.",
  "Repeated content gaps included 8, 12, 16, 24, 32, 46, 48, 64 and 80px. Their role, rather than just their number, determines the shared token.",
  "Card insets were generally 24px or 32px; metric cards also had 56px leading padding. Standard, spacious and leading-inset roles now compress independently.",
  "Footer group gaps were 48px, heading/link gaps 24px, and legal separation 64px. These now scale; link-to-link spacing and hit-area extensions stay fixed.",
] as const;

export const spacingExceptions = [
  "Challenge uses tighter mobile side padding on user request: below md its scoped grid-margin aliases --space-related-gap (12px at the default root), reduced from 16px. Its existing Container/Grid consume that token; other sections and desktop retain the global fluid margin.",
  "Grid columns (12), gutter (16px), maximum content width (1376px), and baseline (8px) stay fixed. Carousel endpoints continue to derive from that grid.",
  "Product-dashboard, feature mockup, artwork and badge internals retain illustration-coordinate spacing. Do not apply a second viewport-based spacing layer inside ScaledCanvas. Mobile Hero reference 440:3510 keeps its dashboard 640px wide (or wider when the available grid width exceeds that), left-anchored to the shared page edge and right-cropped at the viewport. The shared dashboard internals and desktop grid placement are unchanged.",
  "Business card bottom inset 23.2px; Security card gap 17px and description correction 2px; 10px tight copy gaps in Features/Security; role-card footer bottom inset 28px remain approved composition details.",
  "Features, Business Lines and Testimonial have no Previous/Next controls. Their headings are left-aligned and balanced; obsolete control offsets and header height reservations are removed. Shared carousel sizing exposes two grid gutters (32px) of the next card on phones, while retaining desktop card spans, native swipe/snap and focusable keyboard navigation. Button padding and footer 24px link-to-link gaps remain unchanged.",
  "Announcement bar keeps its approved 10px desktop inset exception; its mobile inset follows the shared page token. Navbar and all standard content use Container.",
  "Video desktop scroll geometry and its zero-padding override remain interaction-specific. Mobile uses equal media padding above and below its poster inside the sticky stage, with 20svh of travel and 95% to 100% scaling. Pin the stage just below the approximately 6rem mobile header, not at the viewport midpoint: midpoint pinning creates excess whitespace on tall phones. Keep the poster centered within the compact stage. Reduced-motion/unsupported browsers retain the same symmetric padding in natural-height flow. See video-explainer.module.css.",
  "Mobile Hero minimum height accounts for the approximately 6rem sticky header, so header + Hero fill the first viewport without adding a second header allowance. Its complete content group remains centered with symmetric opening-end padding and can grow for enlarged text. From md it remains content-driven with opening-start/top and opening-end/bottom padding. Challenge stays full-height. Role-card grid rows, Security/CTA minimum heights and desktop testimonial artwork rows are unchanged.",
  "Mobile Testimonial cards follow Figma 440:4548 below the inferred 768px breakpoint: fixed 20px content insets, a 340px width cap over the shared next-card peek sizing, and a 406px minimum height. A 180px artwork-clearance row separates the small logo from live quotations; cards may grow for narrower widths or enlarged text. Tablet/desktop retain spacious card padding and the existing composition. The mobile artwork uses its own approved coordinate system, not a scaled desktop collage.",
  "Mobile CTA card 440:4680 preserves a 527px minimum height and vertically centers the live headline/button group. Its approved 312px text measure is bounded by the shared card-padding inset on narrower phones; the heading-to-button gap is the explicit fixed 32px Figma value. These card-internal exceptions apply below the inferred 768px breakpoint. Outer section spacing, desktop grid spans, button hit areas and shared spacing tokens are unchanged. Decorative corner crops keep their own native coordinates.",
  "Video image sizes mirrors the fluid page inset as a bounded rem/vw expression because HTML sizes cannot reference CSS custom properties; numerical checks guard that mirror.",
] as const;

export const spacingRules = [
  "Choose a semantic relationship first: tight < component < content < major separation. Do not scale every distance by the same percentage.",
  "All fluid roles reuse --space-fluid-step, an alias of the unchanged --type-fluid-step. At a 16px root the range is 390–1440px; sizes clamp outside it. Rem bounds and viewport endpoints respect enlarged root text preferences.",
  "For min/max expressed in rem, use clamp(min, calc(min + (max - min) * var(--space-fluid-step)), max). The step is a length, not an unbounded viewport-only size.",
  "Use tokens through Tailwind variable utilities, e.g. gap-(--space-content-gap), p-(--space-card-padding), py-(--space-section-standard). Do not replace Tailwind’s base --spacing unit or alter documentation-tool spacing.",
  "Page padding flows through --grid-margin to Container, GridOverlay and carousel rails. Never add a second independent section-level page inset.",
  "Count adjacent padding together: Features bottom + One Workspace top = 64px minimum / 180px maximum. Hero opening-end + Video stage media padding = 64px mobile minimum; centered Hero free space is additional. Desktop static Hero bottom + Video top remains 180px. Mobile Video owns equal top/bottom media padding in its stage, not also on its section. CTA bottom + Footer top = 64px / 152px. Do not add a section margin.",
  "Reuse a role when meaning and endpoints match. Add a new shared role only for a genuinely different relationship or approved desktop treatment; keep CSS, metadata, consumer mappings and tests synchronized.",
  "Mobile minima are the user-selected Balanced implementation scale, not Figma mobile specifications. Desktop maxima are the current approved implementation. Harvey informs spacing hierarchy only; its values are not copied.",
  "No typography, column spans, breakpoints, minimum heights, image coordinates, navigation or interaction changes in this pass. Responsive canvases may resize naturally with their parent padding.",
] as const;
