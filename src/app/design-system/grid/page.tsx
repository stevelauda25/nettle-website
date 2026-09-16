import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/grid/container";
import { Grid } from "@/components/layout/grid/grid";
import { GridBand } from "@/components/layout/grid/grid-band";
import { GridOverlay } from "@/components/layout/grid/grid-overlay";
import { InlineCode } from "../_components/inline-code";
import { FoundationTable } from "../_components/foundation-table";
import { ProvenanceCard } from "../_components/provenance-card";
import { DocsShell } from "../_components/docs-shell";
import { OnThisPage, type OnThisPageItem } from "../_components/on-this-page";
import {
  baselineMismatches,
  baselineNote,
  desktopGrid,
  docSections,
  gridSkill,
  undefinedGrids,
} from "../_data/grid";
import { figmaSource } from "../_data/foundation";

export const metadata: Metadata = { title: "Grid" };

const onThisPageItems: readonly OnThisPageItem[] = [
  { label: "Live grid", href: "#live-grid" },
  { label: "Configuration", href: "#configuration" },
  { label: "Baseline", href: "#baseline" },
  { label: "Documentation", href: "#documentation" },
];

export default async function GridPage({ searchParams }: PageProps<"/design-system/grid">) {
  const params = await searchParams;
  const gridOn = params.grid === "true";

  return (
    <DocsShell
      pageTitle="Grid"
      activePath="/design-system/grid"
      breadcrumb={{ parent: "Foundations", current: "Grid" }}
      detailRail={<OnThisPage items={onThisPageItems} />}
      smoothAnchorScroll
    >
      <header className="flex min-h-12 w-full flex-col gap-1 border-b border-border-subtle px-3 pb-6">
        <h1 className="text-base leading-6 font-medium tracking-[0] text-text-primary">Grid</h1>
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
          The Nettle layout grid, collected from Figma on {figmaSource.collectedOn}, engineered with the{" "}
          {gridSkill.name} skill.
        </p>
      </header>

      <ProvenanceCard>
        Grid engineering follows the{" "}
        <a href={gridSkill.url} target="_blank" rel="noreferrer" className="text-text-primary underline">
          {gridSkill.name}
        </a>{" "}
        skill — structural methodology only, not its visual art direction. Column values are collected from the
        Figma layout grid on every Hero frame; Nettle typography and color tokens are unchanged by this page.
      </ProvenanceCard>

      <section id="live-grid" className="flex w-full flex-col gap-2.5">
        <div className="flex flex-col gap-1 px-3">
          <h2 className="text-sm leading-5 font-medium tracking-[0] text-text-primary">Live grid</h2>
          <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
            Real <InlineCode>Container</InlineCode> / <InlineCode>Grid</InlineCode> /{" "}
            <InlineCode>GridBand</InlineCode> primitives — not a duplicated demo. Add{" "}
            <InlineCode>?grid=true</InlineCode> to this page&apos;s URL to overlay the same columns, gutter and
            margin the content uses.{" "}
            <Link href={gridOn ? "/design-system/grid" : "/design-system/grid?grid=true"} className="text-text-primary underline">
              {gridOn ? "Hide overlay" : "Show overlay"}
            </Link>
          </p>
        </div>

        <div className="w-full rounded-card bg-background-primary shadow-card">
          <Container className="relative flex flex-col gap-3 py-6">
            <GridOverlay visible={gridOn} baseline />

            <Grid>
              <GridBand>
                <ExampleBlock label="Full span" className="col-span-12" />
              </GridBand>
            </Grid>

            <Grid>
              <GridBand>
                <ExampleBlock label="Half" className="col-span-6" />
                <ExampleBlock label="Half" className="col-span-6" />
              </GridBand>
            </Grid>

            <Grid>
              <GridBand>
                <ExampleBlock label="Visual (5)" className="col-span-5" />
                <ExampleBlock label="Content (7)" className="col-span-7" />
              </GridBand>
            </Grid>

            <Grid>
              <GridBand>
                <ExampleBlock label="Card" className="col-span-4" />
                <ExampleBlock label="Card" className="col-span-4" />
                <ExampleBlock label="Card" className="col-span-4" />
              </GridBand>
            </Grid>
          </Container>
        </div>
      </section>

      <section id="configuration" className="flex w-full flex-col gap-2.5">
        <div className="flex flex-col gap-1 px-3">
          <h2 className="text-sm leading-5 font-medium tracking-[0] text-text-primary">Configuration</h2>
          <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
            {desktopGrid.label}. Every value below is confirmed from the Figma layout grid on the Hero frames.
          </p>
        </div>
        <FoundationTable
          columns={[
            { label: "Token", width: 194 },
            { label: "Value", width: 390 },
          ]}
          rows={desktopGrid.values.map((v) => [{ content: v.name }, { content: v.value, mono: true }])}
        />
        <div className="flex flex-col gap-1.5 px-3">
          {undefinedGrids.map((g) => (
            <p key={g.label} className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
              <span className="text-text-primary">{g.label}:</span> {g.note}
            </p>
          ))}
        </div>
      </section>

      <section id="baseline" className="flex w-full flex-col gap-2.5">
        <div className="flex flex-col gap-1 px-3">
          <h2 className="text-sm leading-5 font-medium tracking-[0] text-text-primary">Baseline</h2>
          <p className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">{baselineNote}</p>
        </div>
        <FoundationTable
          columns={[
            { label: "Text style", width: 260 },
            { label: "Line height", width: 160 },
            { label: "8px multiple", width: 164 },
          ]}
          rows={baselineMismatches.map((m) => [
            { content: m.style },
            { content: m.lineHeightPx, mono: true },
            { content: m.multipleOf8 ? "Yes" : "No", secondary: !m.multipleOf8 },
          ])}
        />
      </section>

      <section id="documentation" className="flex w-full flex-col gap-4">
        <h2 className="h-5 px-3 text-sm leading-5 font-medium tracking-[0] text-text-primary">Documentation</h2>
        {docSections.map((doc) => (
          <div key={doc.title} className="flex flex-col gap-1.5 px-3">
            <h3 className="text-sm leading-5 font-medium tracking-[0] text-text-primary">{doc.title}</h3>
            {doc.body.map((line, i) => (
              <p key={i} className="text-sm leading-5 font-normal tracking-[0] text-text-secondary">
                {line}
              </p>
            ))}
          </div>
        ))}
      </section>
    </DocsShell>
  );
}

function ExampleBlock({ label, className }: { label: string; className: string }) {
  return (
    <div className={`flex h-16 items-center justify-center rounded-[6px] bg-background-subtle text-xs text-text-secondary ${className}`}>
      {label}
    </div>
  );
}
