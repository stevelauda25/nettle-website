/**
 * Motion Lab metadata types. DEV ONLY.
 *
 * Two state axes, kept apart on purpose:
 *  - ConceptState: how far a Concept has travelled through the workflow.
 *  - ValuesState: whether what the designer sees is recorded anywhere.
 * Persistence mechanics (browser storage, snapshot files, production defaults)
 * are implementation details behind these words and never appear in the UI.
 */

export type ConceptState = "storyline" | "draft" | "in-review" | "approved" | "live";

export type ValuesState = "unsaved" | "saved" | "same-as-live";

export type Owner = "rycho" | "agil";

export type ConceptMeta = {
  /** URL segment, unique within its section. */
  id: string;
  /** What the designer reads. */
  title: string;
  /** One line: what this Concept does. */
  summary: string;
  owner: Owner;
  state: ConceptState;
  /**
   * Path of the colocated storyline.md, relative to the section folder. It is
   * created when storyline work begins, so a Concept at `storyline` may exist
   * before the file does. A Concept can only carry code or leave `storyline`
   * once the file has an approval line (Gate 1); the guard test enforces it.
   */
  storyline: string;
  /**
   * The production visual inside the section this Concept animates, named by
   * the key the section's own data uses (for Business Lines, the `visual` key
   * in data.ts). The Concept previews the section's Original; this says which
   * part of it is the subject. Omitted when the Concept covers the whole part.
   */
  visual?: string;
};

export type SectionMeta = {
  /** URL segment, e.g. "hero". */
  id: string;
  /** Designer-facing name, e.g. "Hero". */
  title: string;
  /** One line: what the production part contains. Facts, not intent. */
  summary: string;
  /** Whether this is a <main> section or surrounding layout (header, footer). */
  kind: "section" | "layout";
  /** Engineering detail for the advanced drawer. */
  componentName: string;
  path: string;
  concepts: ConceptMeta[];
};
