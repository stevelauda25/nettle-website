import type { SectionMeta } from "../../types";

/**
 * Business lines — metadata only.
 *
 * Seven Concepts, one per key visual, in the production card order of
 * src/components/sections/business-lines/data.ts. Ids equal the data ids and
 * `visual` equals the artwork key, so a Concept, its storyline and the layer
 * stack it animates stay aligned. Every Concept previews the section's
 * Original (the real production component); nothing is duplicated.
 *
 * Ownership follows the split approved on 2026-09-19. Workload labels from the
 * audit (notes only, not lab states): Worker's Compensation high; Construction,
 * Commercial Auto, High Net Worth and Energy medium; Commercial Property and
 * Liability low.
 *
 * All seven start at `storyline`. Their storyline.md files are created when
 * storyline work begins and gain an approval line at Gate 1.
 */
const section: SectionMeta = {
  id: "business-lines",
  title: "Business lines",
  summary: "Heading with arrow controls and a rail of seven cards, each with a layered line-of-business illustration.",
  kind: "section",
  componentName: "BusinessLines",
  path: "src/components/sections/business-lines/business-lines.tsx",
  concepts: [
    {
      id: "commercial-property",
      title: "Commercial Property",
      summary: "Isometric planes in one linework SVG with a tower photograph in a diamond window and a strip window.",
      owner: "rycho",
      state: "storyline",
      storyline: "commercial-property/storyline.md",
      visual: "commercial-property",
    },
    {
      id: "workers-compensation",
      title: "Worker’s Compensation",
      summary: "Five concentric circle pairs mirrored across a vertical axis, with two photograph windows at the centre.",
      owner: "rycho",
      state: "storyline",
      storyline: "workers-compensation/storyline.md",
      visual: "workers-compensation",
    },
    {
      id: "liability",
      title: "Liability",
      summary: "Two overlapping circles with a photograph in the lens and markers at its edges.",
      owner: "rycho",
      state: "storyline",
      storyline: "liability/storyline.md",
      visual: "liability",
    },
    {
      id: "construction-builders-risk",
      title: "Construction & Builder’s Risk",
      summary: "Three circles of increasing size on one line, two diagonals fanning from the left, two photograph windows.",
      owner: "agil",
      state: "storyline",
      storyline: "construction-builders-risk/storyline.md",
      visual: "construction",
    },
    {
      id: "commercial-auto-fleet",
      title: "Commercial Auto & Fleet",
      summary: "Nested squares alternating straight and turned, an X of axes, photograph windows at opposite corners.",
      owner: "agil",
      state: "storyline",
      storyline: "commercial-auto-fleet/storyline.md",
      visual: "commercial-auto",
    },
    {
      id: "high-net-worth-home",
      title: "High Net Worth Home",
      summary: "Diamond and trapezoid pairs mirrored across a horizontal line, photograph windows left and right.",
      owner: "rycho",
      state: "storyline",
      storyline: "high-net-worth-home/storyline.md",
      visual: "high-net-worth",
    },
    {
      id: "energy-marine-specialty",
      title: "Energy, Marine & Specialty",
      summary: "Eight spokes through one centre inside a circle, photograph windows above and below.",
      owner: "agil",
      state: "storyline",
      storyline: "energy-marine-specialty/storyline.md",
      visual: "energy-marine",
    },
  ],
};

export default section;
