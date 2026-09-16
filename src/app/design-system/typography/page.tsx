import type { Metadata } from "next";
import { InlineCode } from "../_components/inline-code";
import { FoundationTable } from "../_components/foundation-table";
import { OnThisPage, type OnThisPageItem } from "../_components/on-this-page";
import { ProvenanceCard } from "../_components/provenance-card";
import { DocsShell } from "../_components/docs-shell";
import { figmaSource, fontFamilies, fontWeightRows, textStyles } from "../_data/foundation";

export const metadata: Metadata = { title: "Typography" };

const onThisPageItems: readonly OnThisPageItem[] = [
  { label: "Font family", href: "#font-family" },
  { label: "Text styles", href: "#size-scale" },
  { label: "Weights", href: "#weights" },
  { label: "Source of truth", href: "#source-of-truth" },
];

const scaleRowHeights = textStyles.map((style) => Math.ceil((style.size * style.lineHeight) / 100) + 16);

export default function TypographyPage() {
  return (
    <DocsShell
      pageTitle="Typography"
      activePath="/design-system/typography"
      breadcrumb={{ parent: "Foundations", current: "Typography" }}
      detailRail={<OnThisPage items={onThisPageItems} />}
      smoothAnchorScroll
    >
      <header className="flex min-h-12 w-full flex-col gap-1 border-b border-border-subtle px-3 pb-6">
        <h1 className="text-base leading-6 font-medium tracking-[0] text-text-primary">Typography</h1>
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
          {textStyles.length} text styles collected from Figma on {figmaSource.collectedOn}.
        </p>
      </header>

      <ProvenanceCard>
        These tokens were collected from the Figma local text styles on {figmaSource.collectedOn}. Figma defines desktop
        styles only — responsive sizes are not defined yet.
      </ProvenanceCard>

      <section id="font-family" className="flex w-full flex-col gap-2.5">
        <div className="flex h-11 flex-col gap-1 px-3">
          <h2 className="text-sm leading-5 font-medium text-text-primary">Font family</h2>
          <p className="text-sm leading-5 font-normal text-text-secondary">
            Nettle uses <span className="text-text-primary">{fontFamilies[0].name}</span>
            {" for headings and "}
            <span className="text-text-primary">{fontFamilies[1].name}</span>
            {" for body text."}
          </p>
        </div>
        <div className="relative flex h-[200px] w-full flex-col overflow-hidden rounded-card bg-background-primary shadow-card">
          <div className="flex h-[100px] items-center justify-center border-b-[0.5px] border-border-default px-2.5 py-1.5">
            <p className="font-crimson text-2xl leading-8 font-medium tracking-[-0.24px] text-text-primary">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="flex h-[100px] items-center justify-center px-2.5 py-1.5">
            <p className="text-base leading-6 font-medium tracking-[0] text-text-primary">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <span className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.5px] border-border-default" />
        </div>
      </section>

      <section id="size-scale" className="flex w-full flex-col gap-2.5">
        <div className="flex h-[84px] flex-col gap-1 px-3">
          <h2 className="text-sm leading-5 font-medium text-text-primary">Text styles</h2>
          <p className="text-sm leading-5 font-normal text-text-secondary">
            Every Figma local text style, from <InlineCode>text-heading-h1</InlineCode> to{" "}
            <InlineCode>text-body-small-medium</InlineCode>. Six heading styles and six body styles, with their line
            heights and tracking defined for each level.
          </p>
        </div>
        <FoundationTable
          columns={[
            { label: "Token", width: 230 },
            { label: "Size", width: 60 },
            { label: "Line height", width: 88 },
            { label: "Sample", width: 206 },
          ]}
          rowHeights={scaleRowHeights}
          rows={textStyles.map((style) => [
            { content: style.className, mono: true },
            `${style.size}px`,
            `${style.lineHeight}%`,
            {
              content: <span className={style.className}>Aa</span>,
            },
          ])}
        />
      </section>

      <section id="weights" className="flex w-full flex-col gap-2.5">
        <h2 className="h-5 px-3 text-sm leading-5 font-medium text-text-primary">Weights</h2>
        <FoundationTable
          columns={[
            { label: "Family", width: 290 },
            { label: "Weight", width: 294 },
          ]}
          rows={fontWeightRows.map((row) => [{ content: row.family }, String(row.weight)])}
        />
        <p className="h-10 px-3 text-sm leading-5 font-normal text-text-secondary">
          Suisse Int&apos;l only ships Regular and Medium — there is no bold cut available yet.
        </p>
      </section>

      <section id="source-of-truth" className="flex h-16 w-full flex-col gap-1 px-3">
        <h2 className="text-sm leading-5 font-medium text-text-primary">Source of truth</h2>
        <p className="text-sm leading-5 font-normal text-text-secondary">
          These are the source-of-truth Typography values from Figma&apos;s local text styles.{" "}
          <a href={figmaSource.url} target="_blank" rel="noreferrer" className="text-text-primary underline">
            <InlineCode>Nettle – Mega Design File</InlineCode>
          </a>
          {"."}
        </p>
      </section>
    </DocsShell>
  );
}
