import type { Metadata } from "next";
import { InlineCode } from "../_components/inline-code";
import { OnThisPage, type OnThisPageItem } from "../_components/on-this-page";
import { ProvenanceCard } from "../_components/provenance-card";
import { DocsShell } from "../_components/docs-shell";
import { figmaSource, fontFamilies, fontWeightRows, responsiveTypography, textStyles, typographyStyles } from "../_data/foundation";
import { TypographySpecimens } from "./_components/typography-specimens";

export const metadata: Metadata = { title: "Typography" };

const onThisPageItems: readonly OnThisPageItem[] = [
  { label: "Font family", href: "#font-family" },
  { label: "Responsive Typography Scaling", href: "#responsive-typography-scaling" },
  { label: "Text styles", href: "#size-scale" },
  { label: "H5 · 110%", href: "#heading-h5" },
  { label: "Weights", href: "#weights" },
  { label: "Source of truth", href: "#source-of-truth" },
];

export default function TypographyPage() {
  return (
    <DocsShell
      pageTitle="Typography"
      activePath="/design-system/typography"
      breadcrumb={{ parent: "Foundations", current: "Typography" }}
      detailRail={<OnThisPage items={onThisPageItems} />}
      smoothAnchorScroll
      responsive
    >
      <header className="flex min-h-12 w-full flex-col gap-1 border-b border-border-subtle px-3 pb-6">
        <h1 className="text-base leading-6 font-medium tracking-[0] text-text-primary">Typography</h1>
        <p className="text-sm leading-5 text-text-secondary">
          {textStyles.length} Figma text styles, plus {typographyStyles.length - textStyles.length} approved supplementary treatments, using the existing foundation.
        </p>
      </header>

      <ProvenanceCard>
        Desktop styles were collected on {figmaSource.collectedOn} and remain the maximum sizes.
        The latest user-requested mobile refinement reduces large headings by 4px and smaller headings/body copy by 2px.
        These values supersede the initial Balanced minima and mobile Figma sizes where noted. H5 retains 110% line height.
      </ProvenanceCard>

      <section id="font-family" className="flex w-full flex-col gap-3 px-3">
        <h2 className="text-sm font-medium text-text-primary">Font family</h2>
        <p className="text-sm leading-5 text-text-secondary">
          {fontFamilies[0].name} for headings, {fontFamilies[1].name} for body and UI text,
          and {fontFamilies[2].name} for handwritten accents. Font loading, weights and tracking are unchanged.
        </p>
      </section>

      <section id="responsive-typography-scaling" className="flex min-w-0 flex-col gap-3 px-3 text-sm leading-5 text-text-secondary">
        <h2 className="font-medium text-text-primary">Responsive Typography Scaling</h2>
        <p>
          Larger headings scale more; smaller headings scale less. Body Large now scales 15–18px
          and Body Medium 14–16px. Body Small, navigation, buttons and handwritten text remain fixed.
          Hero H1 remains 40–64px, and its supporting copy explicitly retains 16px through the shared body-size variable.
          The semantic H1–H6 names describe visual roles; HTML heading levels still follow document structure.
        </p>
        <p>
          Every fluid role uses the same {responsiveTypography.minViewport}–{responsiveTypography.maxViewport}px
          interpolation range at a {responsiveTypography.defaultRootSize}px root. Below it, sizes hold at the minimum;
          above it, they stop at the Figma desktop maximum. The specimens document the complete min/max scale.
        </p>
        <code className="block whitespace-normal break-words rounded bg-background-subtle p-3 text-xs">
          size = clamp(min, min + (max − min) × (viewport − 390) / 1050, max)
        </code>
        <p>
          In CSS, a shared length step grows from 0rem at 24.375rem to 1rem at 90rem.
          Each role applies its own min/max rem values to that step: a bounded rem-plus-vw calculation,
          not unbounded viewport sizing. Rem bounds and viewport anchors accommodate larger default text settings;
          the pixel values here assume the default 16px root. Fixed UI styles retain their existing pixel sizes.
        </p>
        <p>
          Families, weights, letter spacing and unitless line heights stay at their approved values.
          H1–H4 and H6 retain 100% leading; H5 and the display statement retain 110%.
          Body Large retains 110%, Medium/Small 140%, and handwritten text 120%.
          No line-height changes or breakpoint-based font-size jumps are introduced.
        </p>
        <p>
          Mobile CTA frame 440:4680 explicitly uses a different card-heading treatment:
          Crimson Pro Regular, 32px, 100% leading, zero tracking. The shared{" "}
          <InlineCode>text-heading-card</InlineCode> utility preserves the font, weight and leading, but now scales
          28–32px following the user&apos;s mobile reduction. It does not change Testimonial H5&apos;s 110% leading.
          The CTA applies it below the inferred 768px breakpoint;
          its tablet/desktop H3 remains unchanged. This Figma-backed variant is an explicit exception
          to the default single-role fluid scaling rule, not a general breakpoint-substitution pattern.
        </p>
        <p>
          The Challenge&apos;s detached 54px / 110% / −2% treatment is now the shared{" "}
          <InlineCode>text-display-statement</InlineCode> role (32–54px), not a section-local clamp.
          Its mobile minimum is reduced from 36px to 32px in the latest user refinement.
          The Challenge targets three balanced lines on mobile by removing the forced sentence break below md,
          keeping “Your expertise” together as one inline-block rather than stranding “Your” on the preceding line,
          with 12px side padding via the shared related-gap token. Its underlined emphasis is unchanged;
          narrower viewports or enlarged text may wrap further without clipping. Tablet/desktop retain the sentence break.
          The mobile scale is an implementation choice, not a Figma mobile specification;
          text is never truncated to enforce a line count.
          Product-mockup text stays in its illustration coordinate system; applying viewport typography there
          would scale it twice. Existing legal/button leading exceptions and intentional line breaks are preserved.
        </p>
        <p>
          <a href={responsiveTypography.referenceUrl} target="_blank" rel="noreferrer" className="underline">Harvey</a>{" "}
          informs the semantic hierarchy and restrained body scaling, not Nettle&apos;s sizes, fonts or branding.
          Nettle uses continuous interpolation even where the reference uses breakpoint changes.
        </p>
        <h3 className="font-medium text-text-primary">Adding or changing a role</h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Verify the desktop treatment in Figma and reuse an existing role whenever it matches.</li>
          <li>Choose a role-appropriate minimum, bounded by the desktop maximum, within the shared range.</li>
          <li>Define it centrally in globals.css and mirror its min/max, scaling mode, leading and tracking in the foundation data.</li>
          <li>Use one semantic utility in components. Do not add local clamps or swap heading roles at breakpoints.</li>
          <li>Run the typography checks and inspect wrapping manually before changing spacing or layout.</li>
        </ol>
        <p>
          Manual review widths: {responsiveTypography.manualWidths.join(", ")}px, plus intermediate sizes
          and enlarged text. Check hierarchy, wrapping, long titles and quotations. Layout and spacing polish
          remain a separate phase.
        </p>
      </section>

      <section id="size-scale" className="flex min-w-0 flex-col gap-3">
        <h2 className="px-3 text-sm font-medium text-text-primary">Text styles</h2>
        <p className="px-3 text-sm leading-5 text-text-secondary">
          Minimum/maximum values use the default root size. Desktop maxima below preserve the original static
          token values; live readings reflect the actual viewport and text settings.
        </p>
        <TypographySpecimens styles={typographyStyles} />
      </section>

      <section id="heading-h5" className="flex flex-col gap-3 px-3">
        <h2 className="text-sm font-medium text-text-primary">H5 · Testimonial typography</h2>
        <p className="text-sm leading-5 text-text-secondary">
          <InlineCode>text-heading-h5</InlineCode> — Crimson Pro Regular (400), fluid 22–32px,
          exactly 110% line height, zero tracking. At the desktop maximum, line height remains 35.2px.
          Mobile Testimonial frame 440:4548 specifies 24px; the latest user-requested reduction takes precedence
          at 22px. The shared interpolation range is unchanged.
        </p>
        <p className="text-heading-h5 text-text-primary">
          Nettle is genuinely the future of risk engineering.<br />
          This is the future for the whole sector.
        </p>
      </section>

      <section id="weights" className="flex flex-col gap-3 px-3">
        <h2 className="text-sm font-medium text-text-primary">Weights</h2>
        <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-sm text-text-secondary">
          {fontWeightRows.map((row) => (
            <div key={row.family} className="contents"><dt>{row.family}</dt><dd>{row.weight}</dd></div>
          ))}
        </dl>
        <p className="text-sm leading-5 text-text-secondary">Suisse Int&apos;l only ships Regular and Medium; no new fonts or weights are loaded.</p>
      </section>

      <section id="source-of-truth" className="flex flex-col gap-3 px-3 text-sm leading-5 text-text-secondary">
        <h2 className="font-medium text-text-primary">Source of truth</h2>
        <p>
          <a href={responsiveTypography.sourceUrl} target="_blank" rel="noreferrer" className="underline">Nettle Homepage · 440:3509</a>
          {" "}provides approved desktop treatments.{" "}
          <a href={figmaSource.url} target="_blank" rel="noreferrer" className="underline">Figma Design Foundation</a>
          {" "}provides named styles. CSS is authoritative; the metadata documents it and is checked by{" "}
          <InlineCode>pnpm test:typography</InlineCode>. Browser QA is manual.
        </p>
      </section>
    </DocsShell>
  );
}
