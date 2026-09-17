import type { UsageSection } from "../_components/usage-guide";

// Audited implementation values, not new radius tokens. Default-root px equivalents.
export const radiusExamples = [
  { label: "Square", value: "0", utility: "rounded-none", usage: "Artwork canvases, geometric masks, full-bleed surfaces." },
  { label: "Subtle", value: "2px", utility: "rounded-xs", usage: "Video poster. Also used as an explicit 2px radius inside product illustrations." },
  { label: "Small", value: "4px", utility: "rounded-sm", usage: "Small mockup surfaces; rounded is the equivalent existing 4px shorthand." },
  { label: "Medium", value: "6px", utility: "rounded-md", usage: "Primary/light buttons, Testimonial cards, CTA panel and dashboard frame." },
  { label: "Large", value: "8px", utility: "rounded-lg", usage: "Features, business-line, role and Security card shells." },
  { label: "Circular", value: "Fully rounded", utility: "rounded-full", usage: "Circular play control and explicitly circular controls—not the standard CTA shape." },
] as const;

export const radiusSections: readonly UsageSection[] = [
  {
    id: "radius-hierarchy", title: "Choose by component role",
    description: "Nettle uses restrained rounding around structured content, with sharper technical artwork inside. These mappings describe the current implementation; do not normalize every surface to the same radius.",
    rules: [
      "Reuse rounded-md for standard buttons; do not turn Request a Demo or the white secondary button into a pill.",
      "Use the existing card shell for its family: Features, business-line, role and Security cards use rounded-lg; Testimonial and CTA use rounded-md. Card size alone is not a reason to change this distinction.",
      "Full-width section backgrounds and the Footer visual remain square. Rounded clipping belongs to the card/poster boundary, not to the entire page section.",
      "Circle, arch, diamond and other illustration masks are artwork geometry, not border-radius choices. Preserve the approved SVG mask rather than approximating it with a rounded box.",
    ],
  },
  {
    id: "radius-implementation", title: "Implementation and nesting",
    description: "Existing Tailwind radius utilities are the implementation source. Their rem values do not interpolate with viewport width; the labels above assume a 16px root.",
    rules: [
      "Current theme values: --radius-xs = 0.125rem, --radius-sm = 0.25rem, --radius-md = 0.375rem and --radius-lg = 0.5rem. No parallel marketing radius-token scale is needed.",
      "Use overflow-hidden on the surface that actually clips artwork. Keep focusable controls and their focus rings outside clipping layers wherever possible.",
      "Border/ring overlays follow the same corner with rounded-[inherit] or border-radius: inherit. Avoid overlay corners that disagree with the underlying card.",
      "Nested surfaces do not automatically inherit the outer radius. Retain their existing smaller internal treatment, padding and border thickness; do not introduce a universal radius subtraction formula.",
      "The docs-tool --radius-navigation (6px) and --radius-card (8px) are internal documentation tokens. Do not consume rounded-navigation or rounded-card in the marketing site.",
    ],
  },
  {
    id: "radius-exceptions", title: "Exceptions and acceptance",
    description: "Illustration dimensions and one-off Figma measurements remain separate from the marketing surface hierarchy.",
    rules: [
      "Features UI mockups intentionally use a 10px top-left corner. Dashboard internals also contain 2px, 3px and 5px details. Keep these in their illustration coordinate system; ScaledCanvas scales the whole visual once.",
      "Do not use larger Tailwind radii simply because they are available. A new role needs a design reason, a documented consumer and review before introducing another value.",
      "On mobile, preserve shell radii while padding and content widths respond. Do not independently shrink corners at breakpoints.",
      "Manual check: inspect clipped texture edges, inset rings, focus visibility and consistency between cards of the same family on light and dark backgrounds.",
    ],
  },
];

export const logoTreatments = [
  { name: "Light mode · monochrome", background: "Solid cream / light", symbol: "Black", wordmark: "Black", dark: false, coloured: false, transparent: false, status: "Default monochrome treatment on a quiet cream surface." },
  { name: "Dark mode · colour", background: "Solid black / dark", symbol: "Orange", wordmark: "Cream", dark: true, coloured: true, transparent: false, status: "Orange symbol and cream wordmark provide the dark-mode treatment." },
  { name: "Transparent · monochrome on light", background: "Light transparency preview", symbol: "Black", wordmark: "Black", dark: false, coloured: false, transparent: true, status: "No background is part of the logo. The checkerboard demonstrates transparency only." },
  { name: "Transparent · colour on light", background: "Light transparency preview", symbol: "Orange", wordmark: "Black", dark: false, coloured: true, transparent: true, status: "Pair a dark wordmark with a light surface, regardless of the supplied filename." },
  { name: "Transparent · colour on dark", background: "Dark transparency preview", symbol: "Orange", wordmark: "Cream", dark: true, coloured: true, transparent: true, status: "Pair a cream wordmark with a dark surface. The checkerboard is not part of the artwork." },
] as const;

export const logoSections: readonly UsageSection[] = [
  {
    id: "logo-colour", title: "Colour and background pairing",
    description: "The supplied Colour usage reference establishes light and dark treatments. Choose by the actual symbol/wordmark colours and destination surface—not by a potentially misleading filename.",
    rules: [
      "Light mode: use a solid monotone cream background with a black symbol and black wordmark. Keep the surrounding surface quiet and uncluttered.",
      "Dark mode: use a solid black background with an orange symbol and cream wordmark. Orange is the symbol accent, not a replacement for the entire wordmark.",
      "Transparent assets inherit the page background; transparency is not a colour mode. Black text needs a light surface, while cream text needs a dark surface. The reference’s dark slide is a presentation canvas, not a valid backdrop for every transparent example.",
      "These documentation examples apply existing tokens to the original vector paths: cold-gray/500 for black artwork, brand/500 for orange, warm-gray/100 for cream, and black for the dark surface. These are explicit system-token interpretations, not colour values sampled or verified from the reference image.",
      "The specimen-only viewBox frames the visible 79 × 17 artwork rather than the original 143 × 17 canvas. Path coordinates, lockup spacing and proportions are identical; the production SVG and header are unchanged. Preview padding is not a prescribed clear-space ratio.",
      "Use an original vector master for each colour treatment. Do not cut a logo out of this screenshot, recolour the whole lockup with a filter, or manufacture a replacement wordmark.",
    ],
  },
  {
    id: "logo-filenames", title: "Transparent asset labels: ambiguity",
    description: "Two coloured transparent examples appear to have reversed background labels. The written light/dark guidance is clear; the filename-to-artwork mapping still needs confirmation when the source files are supplied.",
    rules: [
      "Nettle_black_logo_transp_light_background: shown with black symbol and black wordmark; consistent with light-background placement.",
      "Nettle_colored_logo_transp_dark_background: shown with an orange symbol and black wordmark. That wordmark needs a light surface, despite the dark_background suffix.",
      "Nettle_colored_logo_transp_light_background: shown with an orange symbol and cream wordmark. That wordmark matches the stated dark-mode treatment, despite the light_background suffix.",
      "Do not silently rename or approve a mismatched file. Inspect the actual export, confirm its intended background and retain a traceable mapping from supplied filename to final asset path.",
    ],
  },
  {
    id: "logo-naming", title: "Company name and capitalization",
    description: "Use Nettle in written language. The lowercase nettle lettering belongs to the wordmark artwork only.",
    rules: [
      "Capitalize Nettle consistently in full sentences, headings, navigation labels, metadata, accessible names and editorial copy—even when it appears in the middle of a sentence.",
      "Correct: Nettle helps teams assess risk. Correct: Built with Nettle. Avoid lowercase nettle when naming the company in prose.",
      "Do not modify the lowercase vector wordmark to read Nettle. Preserve approved logo artwork exactly; textual naming and logo lettering are separate rules.",
      "Keep technical identifiers such as URLs, filenames and code paths in their required form; do not change them merely to capitalize the brand name.",
    ],
  },
  {
    id: "logo-master", title: "Master asset and lockup",
    description: "Use the symbol-plus-wordmark SVG as one unit. The supplied reference defines colour usage and written naming; dimensions below are audited from the current repository, not measurements inferred from the screenshot.",
    rules: [
      "Master: public/assets/logos/nettle.svg. Its exported canvas and viewBox are 143 × 17; the current header requests those same image dimensions. This is an observed placement, not a verified minimum logo size or visible-artwork bounding box.",
      "The SVG uses #03010E, matching cold-gray/500. Keep the original vector paths and fill. Do not typeset the wordmark with a font, redraw the symbol, adjust kerning or separate the lockup.",
      "Preserve the asset canvas aspect ratio with proportional sizing (one dimension plus auto, or matching width/height). The source SVG declares preserveAspectRatio=none, making a mismatched CSS box especially unsafe.",
      "Do not crop transparent space from the export or assume its canvas equals the visible artwork. Any revised export must be reconciled with the supplied brand reference first.",
    ],
  },
  {
    id: "logo-placement", title: "Placement, backgrounds and access",
    description: "The functional logo belongs to the page structure, while the oversized Footer logo is part of a separate decorative composition.",
    rules: [
      "Use Container/Grid for the header anchor. Keep the current logo on a clean light surface; do not place the dark SVG directly on a dark or visually busy image.",
      "Keep surrounding controls and text outside the logo artwork. Numerical clear-space ratios, minimum digital/print sizes and co-brand spacing are not defined in the supplied reference and remain unspecified; do not present a guessed ratio as approved.",
      "The orange/cream and orange/black variants are shown in the reference, but their original vector files are not in the current logos folder. Standalone and compact responsive marks are also not supplied. Request the required master rather than applying a CSS filter or cropping the wordmark away.",
      "For a linked logo, give the link a meaningful name such as Nettle home and use alt=\"\" on its image to avoid duplicate announcements. For a meaningful standalone logo, use alt=\"Nettle\".",
      "Do not rotate, stretch, outline, add shadows, apply gradients, reduce opacity or add animation to the functional logo without an approved variant.",
    ],
  },
  {
    id: "logo-footer", title: "Footer artwork exception",
    description: "The outlined Nettle lockup in the Footer is already baked into a full-width image; it is not a reusable outline logo master.",
    rules: [
      "Reuse footer-visual.png unchanged in FooterVisual. Preserve the complete 1440 × 562 aspect ratio, focal composition and full-width placement.",
      "Do not extract this raster lockup for navigation, stretch it to a different ratio, or recreate its outline as a new brand variant.",
      "Its original 1440px width is a known limit for wider/high-DPI presentation. A higher-resolution approved source is needed; upscaling or sharpening does not provide missing native detail.",
      "Outstanding inputs: original colour-variant vector exports, clarification of the two transparent filenames, exact variant colour specifications, and any separate clear-space/minimum-size standards. These are not grounds for changing the current header logo.",
    ],
  },
];

export const imagerySections: readonly UsageSection[] = [
  {
    id: "imagery-direction", title: "Direction: pre-1900 industry",
    description: "Use industrial subject matter from before 1900 to express observation, engineering and the physical world behind risk. The mood is precise and human—not nostalgic decoration or futuristic stock art.",
    rules: [
      "Prioritize factories, mills, foundries, masonry warehouses, docks, steam-era transport, bridges, cranes, surveying instruments, workshops, engineering drawings and people inspecting or making things.",
      "Choose one legible primary subject for each card. Relate it to the category: property to buildings; construction to structural work; workers to trades; marine to docks and ships; risk engineering to measurement and inspection.",
      "For modern business categories, use a relevant historical precursor or infrastructure metaphor rather than pretending modern equipment is pre-1900. Do not change approved category copy to accommodate an image.",
      "Avoid modern cars, electronic screens, contemporary PPE, skyscraper skylines and other later technology in new historical brand compositions. Avoid generic AI brains, glossy 3D objects and futuristic gradients.",
      "Keep the emphasis on craft, systems and prevention. Avoid sensational accidents or decorative use of suffering; retain source context when people or hazardous work are depicted.",
    ],
  },
  {
    id: "imagery-treatment", title: "Print texture and composition",
    description: "The existing direction combines engraved linework, halftone/riso-like texture, limited ink colors, geometric crops and thin technical construction lines.",
    rules: [
      "Retain readable crosshatching, fine detail and paper/ink contrast. Texture should support the subject, not erase it. Do not stack a second grain or halftone effect onto an already treated source.",
      "Use monochrome, warm paper, charcoal and approved brand-color contexts. Preserve existing approved teal/ink treatments as assets; do not create new global color tokens from sampled image colors.",
      "Crop around the machinery, structure or human action that carries meaning. Keep the focal point recognizable at the smallest card size; avoid accidental cuts through faces, instruments or the only identifying detail.",
      "Keep image, mask, technical linework and accent layers separate where the current component already does. Reuse dedicated visual components and approved SVG masks; do not flatten editable compositions unnecessarily.",
      "Align structural content to the grid. Decorative fragments may extend beyond it only within their approved clipping composition. Keep text areas quiet and avoid putting fine imagery behind readable copy.",
      "Follow dedicated mobile artwork when supplied. Do not proportionally shrink an entire desktop collage if doing so loses its subject; preserve the approved mobile crop and layer order.",
    ],
  },
  {
    id: "imagery-provenance", title: "Source and date verification",
    description: "A vintage appearance or a filename containing archive/riso does not establish age. The new pre-1900 direction is a sourcing requirement, not a claim that every existing approved asset is historically verified.",
    rules: [
      "For a historical source, record collection/creator, title or catalog ID, source URL, creation/publication date, subject date where different, rights/permission information, original dimensions, download date and local asset path.",
      "Require a source record that supports a date before 1900. Mark unknown dates as unverified; do not silently infer a date from clothing, print texture or subject matter.",
      "Treat a modern illustration of pre-1900 industry as an interpretation, not an archival document. Record its creator and approval; never invent archival attribution or imply it is a historical photograph.",
      "Confirm permission and required credit for each selected asset before publication. Old-looking imagery, search thumbnails and collection previews are not sufficient provenance or permission records.",
      "Existing imagery remains in place until reviewed. For example, hero/riso-surveyor.png contains electronic equipment: it illustrates the current texture treatment, but is not a pre-1900 subject example. Audit comparable legacy assets before reuse under this new direction.",
    ],
  },
  {
    id: "imagery-production", title: "Delivery, fidelity and accessibility",
    description: "Preserve the source first; implement the intended crop with the smallest production delivery that still retains the approved detail.",
    rules: [
      "Store approved originals under public/assets/images/<section>/ with descriptive kebab-case filenames. Keep vector linework and masks under public/assets/icons/<section>/. Reuse identical files rather than duplicating exports.",
      "Choose native resolution for the largest rendered crop and target display density. Account for crop loss: a 2× source is useful only if enough pixels remain within the visible region. Never enlarge a thumbnail and call it high resolution.",
      "Use next/image with truthful dimensions/aspect ratio and sizes matching its actual container. Preserve alpha and approved color treatment; avoid repeated lossy encoding. Bypass optimization only for a documented fidelity reason, as with the existing Footer master.",
      "Decorative layers use empty alt and an aria-hidden parent. A meaningful image needs concise subject/context text. Complex visual components expose one useful accessible label rather than announcing every collage fragment.",
      "Product UI screenshots and evidence thumbnails are a separate lane: retain accurate, legible contemporary product/evidence content. Do not apply archival styling to interface text, certification marks or customer logos.",
      "Handoff checklist: approved subject/date, permission record, sufficient native resolution, desktop/mobile focal crops, mask integrity, readable text contrast, accessible naming and no new image compression artifacts. Visual checks remain manual.",
    ],
  },
];
