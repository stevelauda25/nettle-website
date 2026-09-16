import type { Metadata } from "next";
import { InlineCode } from "../_components/inline-code";
import { ColorRamp } from "../_components/color-ramp";
import type { ColorSwatchValue } from "../_components/color-swatch";
import { DocsShell } from "../_components/docs-shell";
import { OnThisPage, type OnThisPageItem } from "../_components/on-this-page";
import { colorScales, colorSteps, colorVariableCount, figmaSource, pendingDefaults } from "../_data/foundation";

export const metadata: Metadata = { title: "Color" };

function getScale(name: string, hex: readonly string[]): ColorSwatchValue[] {
  return colorSteps.map((step, index) => ({ name: `${name}-${step}`, value: hex[index] }));
}

const onThisPageItems: readonly OnThisPageItem[] = [
  { label: "Primitive scales", href: "#palette-ramps" },
  ...colorScales.map((scale) => ({ label: scale.name, href: `#${scale.name}` as const, nested: true })),
  { label: "Page defaults", href: "#page-defaults" },
  { label: "Source of truth", href: "#source-of-truth" },
];

export default function ColorPage() {
  return (
    <DocsShell
      pageTitle="Color"
      activePath="/design-system/color"
      breadcrumb={{ parent: "Foundations", current: "Color" }}
      detailRail={<OnThisPage items={onThisPageItems} />}
      smoothAnchorScroll
    >
      <header className="flex min-h-12 w-full flex-col gap-1 border-b border-border-subtle px-3 pb-6">
        <h1 className="text-base leading-6 font-medium tracking-[0] text-text-primary">Color</h1>
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
          {colorVariableCount} color variables collected from the Figma <span className="text-text-primary">Colors</span>{" "}
          collection on {figmaSource.collectedOn}.
        </p>
      </header>

      <section
        aria-labelledby="provenance-heading"
        className="relative flex h-[108px] w-full flex-col gap-1 overflow-hidden rounded-card bg-background-subtle p-3 shadow-card"
      >
        <h2 id="provenance-heading" className="h-5 shrink-0 text-sm leading-5 font-medium tracking-[0] text-text-primary">
          Provenance
        </h2>
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
          These tokens were collected from the Figma variable collection{" "}
          <span className="text-text-primary">Colors</span> (mode: Default) on {figmaSource.collectedOn}. Swatches render
          from the same <InlineCode>@theme</InlineCode> tokens the site ships, not from static hex values.
        </p>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.5px] border-border-default" />
      </section>

      <section id="palette-ramps" aria-labelledby="palette-ramps-heading" className="flex w-full flex-col gap-1 px-3">
        <h2 id="palette-ramps-heading" className="h-5 shrink-0 text-sm leading-5 font-medium tracking-[0] text-text-primary">
          Primitive scales
        </h2>
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
          Figma defines primitives only — no semantic collection exists yet. Each scale has 11 steps, from{" "}
          <InlineCode>50</InlineCode> to <InlineCode>950</InlineCode>. Names follow Figma:{" "}
          <InlineCode>brand/500</InlineCode> in Figma is <InlineCode>brand-500</InlineCode> in code.
        </p>
      </section>

      {colorScales.map((scale) => (
        <ColorRamp key={scale.name} id={scale.name} title={scale.name} colors={getScale(scale.name, scale.hex)} />
      ))}

      <ColorRamp
        id="page-defaults"
        title="Page defaults (pending)"
        description="Not defined in Figma. The most-used bound variables in the latest frames — needs design sign-off."
        colors={pendingDefaults}
      />

      <section id="source-of-truth" aria-labelledby="source-of-truth-heading" className="flex h-16 w-full flex-col gap-1 px-3">
        <h2 id="source-of-truth-heading" className="h-5 shrink-0 text-sm leading-5 font-medium tracking-[0] text-text-primary">
          Source of truth
        </h2>
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
          These are the source-of-truth Nettle Design System{" "}
          <a href={figmaSource.url} target="_blank" rel="noreferrer" className="text-text-primary underline">
            Color tokens
          </a>
          {"."} Primitive scales render directly from <InlineCode>src/app/globals.css</InlineCode>.
        </p>
      </section>
    </DocsShell>
  );
}
